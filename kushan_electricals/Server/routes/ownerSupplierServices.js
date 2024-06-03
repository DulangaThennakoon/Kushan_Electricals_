// routes/customerServices.js

const express = require("express");
const router = express.Router();
const db = require("../Server_Configuration");
const e = require("express");
const {validateOwnerToken} = require('../ownerJWT');

router.get("/getSuppliers", (req, res) => {
    const sql = "SELECT * FROM supplier;";
    db.query(sql, (err, result) => {
      if (err) res.json({ message: "Server error occurred" });
      res.json(result);
    });
  });

 router.post("/addSupplier",validateOwnerToken, (req, res) => {
    // Retrieve data from request body
    const supplierDetails = req.body.supplierDetails;
    const supplierName = req.body.supplierName;
    const supplierEmail = req.body.supplierEmail;
    const phone1 = req.body.phone1;
    const phone2 = req.body.phone2;
    const sql =
      "INSERT INTO supplier (name, email, phone1, phone2, details) VALUES (?, ?, ?, ?, ?)";
    const values = [supplierName, supplierEmail, phone1, phone2, supplierDetails];
  
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error("Error adding supplier", err);
        return res.status(500).json({ message: "Server error occurred" });
      }
  
      console.log("Supplier added successfully");
      res.status(200).json({ message: "Supplier added successfully" });
    });
  });  

module.exports = router;
