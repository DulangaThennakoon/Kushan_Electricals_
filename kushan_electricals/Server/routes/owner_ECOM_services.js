const express = require("express");
const router = express.Router();
const db = require("../Server_Configuration");
const e = require("express");
const multer = require("multer");
const upload = multer();
const moment = require("moment-timezone");
const { validateOwnerToken } = require("../ownerJWT");

router.get("/getOrders",validateOwnerToken, (req, res) => {
  const query =
    "SELECT cart.*, cart_item.*,product.productName,(cart_item.quantity * cart_item.unitPrice) AS total FROM cart INNER JOIN cart_item ON cart.cartID = cart_item.cartID INNER JOIN product ON product.productID = cart_item.productID WHERE cart.deliveryStatus = 0;";
  db.query(query, (err, result) => {
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
        productName: curr.productName,
        quantity: curr.quantity,
        unitPrice: curr.unitPrice,
        total: curr.total,
        // add other cart_item fields here
      });
      acc[curr.cartID].totalAmount += curr.total;
      return acc;
    }, {});

    // Convert object to array
    const finalResult = Object.values(groupedResult);

    return res.status(200).json({ status: 200, data: finalResult });
  });
});

router.post("/updateDeliveryStatus",validateOwnerToken, (req, res) => {
    const { cartID } = req.body;
    const query = "UPDATE cart SET deliveryStatus = 1 WHERE cartID = ?";
    db.query(query, [cartID], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Internal server error" });
      }
      return res.status(200).json({ status: 200, message: "Delivery status updated" });
    });
});

module.exports = router;
