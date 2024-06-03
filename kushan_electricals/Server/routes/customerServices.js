// routes/customerServices.js

const express = require("express");
const router = express.Router();
const db = require("../Server_Configuration");
const e = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
//const session = require('express-session');
router.use(cookieParser());
const { createToken, validateToken } = require("../JWT");
const { verify } = require("crypto");

const moment = require("moment-timezone");
// Define route handler for sign-up user endpoint
router.post("/signUpUser", (req, res) => {
  // Extract the request body
  const { firstName, lastName, email, address, phoneNumber, password } =
    req.body;
  const sql = `SELECT * FROM customer WHERE email = '${email}'`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    } else {
      bcrypt
        .hash(password, 10)
        .then((hash) => {
          const sql = `INSERT INTO customer (firstName,lastName,email,password,address,telephone) VALUES(?,?,?,?,?,?)`;
          const values = [
            firstName,
            lastName,
            email,
            hash,
            address,
            phoneNumber,
          ];
          db.query(sql, values, (err, result) => {
            if (err) {
              return res.status(500).json({ message: "Internal server error" });
            }
            return res
              .status(200)
              .json({ message: "User created successfully" });
          });
        })
        .catch((err) => {
          return res.status(500).json({ message: "Internal server error" });
        });
      // const sql = `INSERT INTO customer (firstName,lastName,email,password,address,telephone) VALUES(?,?,?,?,?,?)`;
      // const values = [firstName, lastName, email, password, address, phoneNumber];
      // db.query(sql, values, (err, result) => {
      //     if (err) {
      //         return res.status(500).json({ message: "Internal server error" });
      //     }
      //     return res.status(200).json({ message: "User created successfully" });
      // }	)
    }
  });
});

router.get("/isAuth", validateToken, (req, res) => {
  return res.status(200).json({ message: "User is authenticated" });
});

router.post("/loginUser", (req, res) => {
  // Extract the request body
  const { email, password } = req.body;
  console.log(email, password);
  const sql = `SELECT * FROM customer WHERE email = '${email}'`;
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    if (result.length > 0) {
      const dbPassword = result[0].password;
      bcrypt
        .compare(password, dbPassword)
        .then((match) => {
          if (match) {
            //req.session.user = result;
            //console.log(req.session.user);
            console.log(result[0].customerID);
            const accessToken = createToken(result[0]);
            return res.status(200).json({
              auth: true,
              message: "Login successful",
              accessToken: accessToken,
              customerName: result[0].firstName,
              customerID: result[0].customerID,
            });
          } else {
            return res.status(401).json({ message: "Invalid credentials" });
          }
        })
        .catch((err) => {
          return res.status(500).json({ message: "Internal server error" });
        });
      //return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  });
});

router.post("/getCustomerDetails", validateToken, (req, res) => {
  const customerID = req.customerID;
  const sql =
    "SELECT customerID, firstName,lastName,address,telephone,email FROM customer WHERE customerID = ?;";
  db.query(sql, customerID, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    return res.status(200).json({ status: 200, data: result[0] });
  });
});

// router.get("/getOrderHistory", validateToken, (req, res) => {
//   const customerID = req.customerID;
//   const sql = `SELECT * FROM cart WHERE paymentStatus = true AND customerID = ?`;
//   db.query(sql, customerID, (err, result) => {
//     if (err) {
//       return res.status(500).json({ message: "Internal server error" });
//     }
//     return res.status(200).json({ status: 200, data: result });
//   });
// });

router.get("/getOrderHistory", validateToken, (req, res) => {
  const customerID = req.customerID;
  const sql = `
  SELECT cart.*,cart_item.*, product.productName, (cart_item.quantity * cart_item.unitPrice) AS totalAmount 
  FROM cart_item INNER JOIN cart ON cart_item.cartID = cart.cartID 
  INNER JOIN product ON cart_item.productID = product.productID 
  WHERE  cart.customerID = ? AND cart.paymentStatus = true;  
  `;
  db.query(sql, customerID, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }

    // Group cart items by cart
    const groupedResult = result.reduce((acc, curr) => {
      if (!acc[curr.cartID]) {
        acc[curr.cartID] = {
          ...curr,
          items: [],
          dateTime: moment
            .utc(curr.dateTime)
            .tz("Asia/Colombo")
            .format("YYYY-MM-DD"),
          totalAmount: 0,
        };
      }
      acc[curr.cartID].items.push({
        cart_itemID: curr.cart_itemID,
        productID: curr.productID,
        productName: curr.productName,
        quantity: curr.quantity,
        unitPrice: curr.unitPrice,
        totalAmount: curr.totalAmount,
        // add other cart_item fields here
      });
      acc[curr.cartID].totalAmount += curr.totalAmount;
      return acc;
    }, {});

    // Convert object to array
    const finalResult = Object.values(groupedResult);

    return res.status(200).json({ status: 200, data: finalResult });
  });
});

router.post("/updateCustomerDetails", validateToken, (req, res) => {
  const customerID = req.customerID;
  const { firstName, lastName, telephone, address } = req.body;
  const sql = `UPDATE customer SET firstName = ?, lastName = ?, address = ?, telephone = ? WHERE customerID = ?`;
  const values = [firstName, lastName, address, telephone, customerID];
  db.query(sql, values, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    return res.status(200).json({ message: "Details updated successfully" });
  });
});

router.post("/verifyPassword", validateToken, (req, res) => {
  const customerID = req.customerID;
  const { password } = req.body;

  const sql = `SELECT password FROM customer WHERE customerID = ?`;
  db.query(sql, customerID, (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    const dbPassword = result[0].password;
    bcrypt
      .compare(password, dbPassword)
      .then((match) => {
        if (match) {
          return res
            .status(200)
            .json({ status: 200, message: "Password verified" });
        } else {
          return res
            .status(401)
            .json({ status: 401, message: "Invalid password" });
        }
      })
      .catch((err) => {
        return res
          .status(500)
          .json({ status: 500, message: "Internal server error" });
      });
  });
});

router.post("/changePassword", validateToken, (req, res) => {
  const customerID = req.customerID;
  const { newPassword } = req.body;
  console.log(newPassword);
  bcrypt
    .hash(newPassword, 10)
    .then((hash) => {
      const sql = `UPDATE customer SET password = ? WHERE customerID = ?`;
      const values = [hash, customerID];
      db.query(sql, values, (err, result) => {
        if (err) {
          return res
            .status(500)
            .json({ status: 500, message: "Internal server error" });
        }
        return res
          .status(200)
          .json({ status: 200, message: "Password changed successfully" });
      });
    })
    .catch((err) => {
      return res
        .status(500)
        .json({ status: 500, message: "Internal server error" });
    });
});

module.exports = router;
