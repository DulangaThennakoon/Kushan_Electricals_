const express = require("express");
const router = express.Router();
const db = require("../Server_Configuration");
const e = require("express");
const multer = require("multer");
const upload = multer();
const moment = require("moment-timezone");
const { validateOwnerToken } = require("../ownerJWT");

const GenerateInventoryReport = require("./GenerateInventoryReport");
const GenerateSalesReport = require("./GenerateSalesReport");

router.use("/inventory-report", GenerateInventoryReport);
router.use("/sales-report", GenerateSalesReport);

router.get("/getInstoreSales", (req, res) => {
    const sql = 'SELECT dateTime, total FROM transactions';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ message: "Server error occurred" });
        } else {
            const sales = formatSalesWeekly(result);
           const formattedSales = extendObject(sales);
           console.log(formattedSales);
            res.status(200).json( formattedSales );
        }
    });
});

router.get("/getOnlineSales", (req, res) => {
    const sql = 'SELECT c.dateTime, SUM(ci.unitPrice*ci.quantity) AS total FROM cart c JOIN cart_item ci ON c.cartID = ci.cartID GROUP BY c.dateTime;';
    db.query(sql, (err, result) => {
        if (err) {
            res.status(500).json({ message: "Server error occurred" });
        } else {
            const sales = formatSalesWeekly(result);
            console.log(sales);
           const formattedSales = extendObject(sales);
            //console.log(formattedSales);
            res.status(200).json( formattedSales );
        }
    });
});

function formatSalesWeekly(data) {
    let sales = {};
    data.forEach((sale) => {
        const week = moment(sale.dateTime).week();
        if (sales[week]) {
            sales[week] += sale.total/1000;
        } else {
            sales[week] = sale.total/1000;
        }
    });
    return sales;
}
function extendObject(obj) {
    const extendedArray = [];
    for (let i = 1; i <= 52; i++) {
        extendedArray.push(obj[i.toString()] || 0);
    }
    return extendedArray;
}



module.exports = router;
