const express = require("express");
const router = express.Router();
const db = require("../Server_Configuration");
const {createOwnerToken, validateOwnerToken} = require('../ownerJWT');  
const bcrypt = require("bcrypt");
const { stat } = require("fs/promises");

router.post("/login", (req, res) => {
    const { email, password } = req.body;
    const sql = "SELECT * FROM owner WHERE email = ?";
  
    db.query(sql, [email], (err, result) => {
      if (err) {
        res.status(500).json({ message: "Server error occurred" });
      } else {
        if (result.length > 0) {
          const user = result[0];
          bcrypt.compare(password, user.password).then((match) => {
            if (match) {
              const accessToken = createOwnerToken(user.id);
              res.status(200).json({ message: "Logged in", accessToken });
            } else {
              res.status(401).json({ message: "Invalid Credentials !" });
            }
          });
        } else {
          res.status(404).json({ message: "Invalid Credentials !" });
        }
      }
    });
  });

  router.post("/verifyPassword",validateOwnerToken, (req, res) => {
    const { password } = req.body;
    const ownerID = req.ownerID;
    const sql = "SELECT password FROM owner WHERE id = ?";
    db.query(sql, [ownerID], (err, result) => {
      if (err) {
        res.status(500).json({ status: 500, message: "Server error occurred" });
      } else {
        if (result.length > 0) {
          const user = result[0];
          bcrypt.compare(password, user.password).then((match) => {
            if (match) {
              res.status(200).json({ status: 200, message: "Password Verified !" });
            } else {
              res.status(401).json({ status: 401, message: "Invalid Password !" });
            }
          });
        } else {
          res.status(404).json({ status: 404, message: "Invalid Owner !" });
        }
      }
    });
  });

  router.post("/changeEmail",validateOwnerToken, (req, res) => {
    const { email } = req.body;
    const ownerID = req.ownerID;
    const sql = "UPDATE owner SET email = ? WHERE id = ?";
    db.query(sql, [email, ownerID], (err, result) => {
      if (err) {
        res.status(500).json({ status: 500, message: "Server error occurred" });
      } else {
        res.status(200).json({ status: 200, message: "Email Updated !" });
      }
    });
  });

  router.get("/getEmail",validateOwnerToken, (req, res) => {
    const ownerID = req.ownerID;
    const sql = "SELECT email FROM owner WHERE id = ?";
    db.query(sql, [ownerID], (err, result) => {
      if (err) {
        res.status(500).json({ status: 500, message: "Server error occurred" });
      } else {
        if (result.length > 0) {
          res.status(200).json({ status: 200, email: result[0].email });
        } else {
          res.status(404).json({ status: 404, message: "Invalid Owner !" });
        }
      }
    });
  });

  router.post("/changePassword",validateOwnerToken, (req, res) => {
    const { password } = req.body;
    const ownerID = req.ownerID;
    const sql = "UPDATE owner SET password = ? WHERE id = ?";
    bcrypt.hash(password, 10).then((hash) => {
      db.query(sql, [hash, ownerID], (err, result) => {
        if (err) {
          res.status(500).json({ status: 500, message: "Server error occurred" });
        } else {
          res.status(200).json({ status: 200, message: "Password Updated !" });
        }
      });
    }).catch((err) => {
      res.status(500).json({ status: 500, message: "Server error occurred" });
    });
  });

module.exports = router;