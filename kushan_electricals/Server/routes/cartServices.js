// routes/customerServices.js

const express = require("express");
const router = express.Router();
const db = require("../Server_Configuration");
const e = require("express");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
//const session = require('express-session');
router.use(cookieParser());
const { validateToken } = require("../JWT");
const { verify } = require("crypto");
const { count } = require("console");

router.post("/addToCart", validateToken, (req, res) => {
  const customerID = req.customerID;
  console.log("Customer id is   ", customerID);
  const { productID, quantity, unitPrice } = req.body;
  const sql1 = `Select * from cart where customerID = ${customerID} and paymentStatus = false`;
  db.query(sql1, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length > 0) {
        const sql2 = `INSERT INTO cart_item (cartID, productID,quantity,unitPrice) VALUES (${result[0].cartID}, ${productID},${quantity},${unitPrice})`;
        db.query(sql2, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.status(200).json({ message: "Product added to cart" });
          }
        });
      } else {
        const sql5 = `SELECT CONCAT(firstName, ' ', lastName) AS name, address, telephone FROM customer WHERE customerID = ${customerID};`;
        db.query(sql5, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            const sql3 = `INSERT INTO cart (customerID, paymentStatus,receiverName,receiverTelephone,deliveryAddress) VALUES (${customerID}, false, '${result[0].name}', '${result[0].telephone}', '${result[0].address}')`;
            db.query(sql3, (err, result) => {
              if (err) {
                console.log(err);
              } else {
                const sql4 = `INSERT INTO cart_item (cartID, productID,quantity,unitPrice) VALUES (${result.insertId}, ${productID},${quantity},${unitPrice})`;
                db.query(sql4, (err, result) => {
                  if (err) {
                    console.log(err);
                  } else {
                    console.log(result);
                    res.status(200).json({ message: "Product added to cart" });
                  }
                });
              }
            });
          }
        });
      }
    }
  });
});

// router.post("/loginUser", (req, res) => {
//     // Extract the request body
//     const { email, password } = req.body;
//     console.log(email, password);
//     const sql = `SELECT * FROM customer WHERE email = '${email}'`;
//     db.query(sql, (err, result) => {

//     });

// });

router.get("/getCart", validateToken, (req, res) => {
  const customerID = req.customerID;
  console.log("Customer id is   ", customerID);
  const sql = `SELECT * FROM cart WHERE customerID = ? AND paymentStatus = false`;
  db.query(sql, customerID, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      if (result.length > 0) {
        //res.status(200).json({message:"working"});
        const sql2 = `SELECT CI.*,p.productName FROM cart_item CI INNER JOIN product p on CI.productID=p.productID WHERE cartID = ${result[0].cartID}`;
        db.query(sql2, (err, result) => {
          if (err) {
            console.log(err);
          } else {
            res.status(200).json(result);
          }
        });
      } else {
        res.status(200).json([]);
      }
    }
  });
});

router.post("/changeDeliveryInfo", validateToken, (req, res) => {
  const customerID = req.customerID;
  const { receiverName, mobile, address } = req.body;
  const sql = `UPDATE cart SET receiverName = '${receiverName}', receiverTelephone = '${mobile}', deliveryAddress = '${address}' WHERE customerID = ${customerID} AND paymentStatus = false`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).json({ status:500,message: "Internal server error" });
    } else {
      res.status(200).json({ status:200,message: "Delivery information updated" });
    }
  });
});

router.put("/changeCartItemQuantity", validateToken, (req, res) => {
    const { cartItem, quantity } = req.body;
    console.log(cartItem, quantity);
    const sql = "UPDATE cart_item SET quantity = quantity + ? WHERE cart_itemID = ?";
    db.query(sql, [quantity, cartItem], (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ status:500, message: "Internal server error" });
      } else {
        console.log(result);
        res.status(200).json({ status:200, message: "Quantity updated" });
      }
    });
});


router.put("/updateCurrentStock", validateToken, async (req, res) => {
  const { cartItems } = req.body;
  const sql = 'UPDATE product SET currentStock = currentStock - ? WHERE productID = ?';

  try {
    const updatePromises = cartItems.map(item => {
      return new Promise((resolve, reject) => {
        db.query(sql, [item.quantity, item.productID], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    });

    await Promise.all(updatePromises);

    res.status(200).json({ status: 200, message: "Updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: "Internal server error" });
  }
});

router.delete("/removeCartItem",validateToken, (req, res) => {
  console.log("removeCartItem");
  const { cartItemID } = req.body;
  const sql = "DELETE FROM cart_item WHERE cart_itemID = ?";
  db.query(sql, cartItemID, (err, result) => {
    if(err){
      console.log(err);
      res.status(500).json({ status:500, message: "Internal server error" });
    }else{
      res.status(200).json({ status:200, message: "Item removed from cart" });
    }
  });  
});
router.get("/getCartItem",validateToken,(req,res)=>{
  console.log("getcartITem");
  const customerID = req.customerID;
  console.log("+++++++++",customerID)
  const sql  = "SELECT count(productID) as count from cart_item WHERE cartID = (SELECT cartID FROM cart WHERE customerID = ? AND paymentStatus = 0)"
  
  db.query(sql, customerID, (err, result) => {
    if(err){
      console.log(err);
      res.status(500).json({ status:500, message: "Internal server error" });
    }else{
      res.status(200).json({ status:200, message: "Item removed from cart",count:result });
    }
  });  
  })
  

router.post("/checkout", validateToken, (req, res) => {
  const customerID = req.customerID;
  const { cartID,cardNumber, expiry, cvc } = req.body;
  console.log("Card number is ",cardNumber);

  const sql = `SELECT * FROM cart WHERE customerID = ${customerID} AND paymentStatus = false`;
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.json({ status:500, message: "Internal server error" });
    } else {
      if (result.length > 0) {
        const sql2 = `UPDATE cart SET paymentStatus = true, dateTime = CONVERT_TZ(CURRENT_TIMESTAMP, '+00:00', '+05:30') WHERE cartID = ${result[0].cartID};
        `;
        db.query(sql2, (err, result) => {
          if (err) {
            console.log(err);
            res.json({ status:500, message: "Internal server error" });
          } else {
            res.json({ status:200, message: "Payment completed" });
          }
        });
      } else {
        res.json({ status:404, message: "Cart not found" });
      }
    }
  });
});

module.exports = router;
