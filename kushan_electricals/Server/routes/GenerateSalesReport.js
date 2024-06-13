const bodyParser = require("body-parser");
const pdf = require("html-pdf");
const path = require("path");
const fs = require("fs");
const db = require("../Server_Configuration");
const { validateOwnerToken } = require("../ownerJWT");
const express = require("express");
const router = express.Router();

let [
  totalSales,
  totalOnlineSales,
  totalInstoreSales,
  totalCostOfGoodsSold,
  onlineCostOfGoodsSold,
  instoreCostOfGoodsSold,
  totalProfit,
  onlineProfit,
  instoreProfit,
  totalDiscounts,
  onlineItemCount,
  instoreItemCount,
  costOfReturnedProducts,
  costOfExpiredProducts,
] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

const getCategorySQL = "SELECT categoryID,categoryName from category";
const getOnlineSalesSQL =
  "SELECT SUM(ci.quantity * ci.unitPrice) AS totalOnlineSales FROM cart c JOIN cart_item ci ON c.cartID = ci.cartID WHERE DATE(c.dateTime) BETWEEN ? AND ?;";
const getInstoreSalesSQL =
  "SELECT SUM(total) AS totalInstoreSales FROM transactions WHERE DATE(dateTime) BETWEEN ? AND ?;";
const getDiscountsSQL =
  "SELECT SUM(discount) AS totalDiscounts FROM transactions WHERE DATE(dateTime) BETWEEN ? AND ?;";
const getOnlineCOGSSQL =
  "SELECT SUM(ci.quantity * ip.avgUnitBuyingPrice) AS onlineCostOfGoodsSold FROM cart_item ci JOIN (SELECT productID, AVG(unitBuyingPrice) AS avgUnitBuyingPrice FROM inventory_purchase WHERE DATE(date) BETWEEN ? AND ? GROUP BY productID) ip ON ci.productID = ip.productID JOIN cart c ON ci.cartID = c.cartID WHERE DATE(c.dateTime) BETWEEN ? AND ?;";
const getInstoreCOGSSQL =
  "SELECT SUM(iti.quantity * ip.avgUnitBuyingPrice) AS instoreCostOfGoodsSold FROM transaction_items iti JOIN ( SELECT productID, AVG(unitBuyingPrice) AS avgUnitBuyingPrice FROM inventory_purchase WHERE DATE(date) BETWEEN ? AND ? GROUP BY productID ) ip ON iti.productID = ip.productID JOIN transactions ist ON iti.transactionID = ist.transactionID WHERE DATE(ist.dateTime) BETWEEN ? AND ?;";
const onlineItemCountSQL =
  "SELECT SUM(cart_item.quantity) as itemCount FROM cart_item INNER JOIN cart ON cart.cartID = cart_item.cartID WHERE cart.dateTime BETWEEN ? AND ?;";
const instoreItemCountSQL =
  "SELECT SUM(transaction_items.quantity) itemCount FROM transaction_items INNER JOIN transactions ON transactions.transactionID = transaction_items.transactionID WHERE transactions.dateTime BETWEEN ? AND ?;";
const returnSalesSQL =
  "SELECT SUM(totalReturnLoss) AS totalReturnLoss FROM ( SELECT SUM(pr.quantity * ip.unitBuyingPrice) AS totalReturnLoss FROM product_return pr JOIN inventory_purchase ip ON pr.productID = ip.productID WHERE pr.date BETWEEN ? AND ? GROUP BY pr.productID) AS subquery;";
const expiringProductsSQL =
  "SELECT SUM(totalExpireLoss) AS totalExpireLoss FROM ( SELECT SUM(ep.quantity * ip.unitBuyingPrice) AS totalExpireLoss FROM expiredproducts ep JOIN inventory_purchase ip ON ep.productID = ip.productID WHERE ep.date BETWEEN ? AND ? GROUP BY ep.productID ) AS subquery;";

const dbCategories = [];

function getCategories() {
  return new Promise((resolve, reject) => {
    db.query(getCategorySQL, (err, result) => {
      if (err) {
        reject(err);
      } else {
        dbCategories.push(
          result.map((rowDataPacket) => ({
            categoryID: rowDataPacket.categoryID,
            CategoryName: rowDataPacket.categoryName,
          }))
        );
        resolve(dbCategories);
      }
    });
  });
}

function getQueryResult(query, params) {
  return new Promise((resolve, reject) => {
    db.query(query, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0]);
      }
    });
  });
}

function getSalesData(startDate, endDate) {
  return Promise.all([
    getQueryResult(getOnlineSalesSQL, [startDate, endDate]),
    getQueryResult(getInstoreSalesSQL, [startDate, endDate]),
    getQueryResult(getDiscountsSQL, [startDate, endDate]),
    getQueryResult(getOnlineCOGSSQL, [startDate, endDate, startDate, endDate]),
    getQueryResult(getInstoreCOGSSQL, [
      startDate,
      endDate,
      startDate,
      endDate,
    ]),
    getQueryResult(onlineItemCountSQL, [startDate, endDate]),
    getQueryResult(instoreItemCountSQL, [startDate, endDate]),
    getQueryResult(returnSalesSQL, [startDate, endDate]),
    getQueryResult(expiringProductsSQL, [startDate, endDate]),
  ]);
}

router.post("/createSalesReport", validateOwnerToken, async (req, res) => {
  const { startDate, endDate } = req.body;
  const pdfFilePath = path.join(__dirname, "SalesReport.pdf");

  try {
    await getCategories();
    const [
      onlineSalesResult,
      instoreSalesResult,
      discountsResult,
      onlineCOGSResult,
      instoreCOGSResult,
      onlineItemCountResult,
      instoreItemCountResult,
      returnSalesResult,
      expiringProductsResult,
    ] = await getSalesData(startDate, endDate);

    totalOnlineSales = onlineSalesResult.totalOnlineSales || 0;
    totalInstoreSales = instoreSalesResult.totalInstoreSales || 0;
    totalDiscounts = discountsResult.totalDiscounts || 0;
    onlineCostOfGoodsSold = onlineCOGSResult.onlineCostOfGoodsSold || 0;
    instoreCostOfGoodsSold = instoreCOGSResult.instoreCostOfGoodsSold || 0;
    onlineItemCount = onlineItemCountResult.itemCount || 0;
    instoreItemCount = instoreItemCountResult.itemCount || 0;
    costOfReturnedProducts = returnSalesResult.totalReturnLoss || 0;
    costOfExpiredProducts = expiringProductsResult.totalExpireLoss || 0;

    totalSales = totalInstoreSales + totalOnlineSales;
    totalCostOfGoodsSold = onlineCostOfGoodsSold + instoreCostOfGoodsSold;
    totalProfit = totalSales - totalCostOfGoodsSold - totalDiscounts;
    onlineProfit = totalOnlineSales - onlineCostOfGoodsSold;
    instoreProfit = totalInstoreSales - instoreCostOfGoodsSold;

    htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Retail Store Sales Report</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 800px;
            margin: 20px auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
            background-color: #fff;
          }
          h1, h2 {
            text-align: center;
            color: #333;
          }
          h2 {
            margin-top: 30px;
            font-size: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
            text-align: left;
            font-size: 16px;
          }
          th {
            background-color: #f2f2f2;
            font-weight: bold;
          }
          .total-row td {
            font-weight: bold;
          }
          #date {
            text-align: center;
            font-size: 16px;
            color: #000000;
            margin-top: -15px;
          }
          .finalValues {
              font-weight: bold;
              text-align: right;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <img src="https://firebasestorage.googleapis.com/v0/b/kushan-electricals.appspot.com/o/logo.png?alt=media&token=73556b84-feac-467a-8c50-fdbdf44d20ef" alt="Inventory Icon" style="display: block; margin: 0 auto; width: 100px;margin-bottom: -20px;">
          <h1>Sales Report</h1>
          <p id="date"></p>
          <h2>Overview:</h2>
          <table>
            <tr>
              <th>Total Sales Revenue:</th>
              <td>Rs. ${totalSales}</td>
            </tr>
            <tr>
              <th>Total Units Sold:</th>
              <td>${onlineItemCount + instoreItemCount} units</td>
            </tr>
            <tr class="total-row">
              <th>Average Transaction Value:</th>
              <td>Rs. ${(totalSales / (onlineItemCount + instoreItemCount)).toFixed(2)}</td>
            </tr>
          </table>

          <h2>Expired & Returns:</h2>
          <table>
            <tr>
              <th>Category</th>
              <th>Loss</th>
            </tr>
            <tr>
              <td>Expired Products</td>
              <td>Rs. ${costOfExpiredProducts}</td>
            </tr>
            <tr>
              <td>Product Returns</td>
              <td>Rs. ${costOfReturnedProducts}</td>
            </tr>
            <tr>
              <td>Total Loss</td>
              <td>Rs. ${costOfExpiredProducts + costOfReturnedProducts}</td>
            </tr>
          </table>

          <h2>Sales Channels:</h2>
          <table>
            <tr>
              <th>Channel</th>
              <th>Total Revenue</th>
              <th>Total Orders</th>
              <th>Average Order Value</th>
            </tr>
            <tr>
              <td>Website</td>
              <td>Rs. ${totalOnlineSales}</td>
              <td>${onlineItemCount}</td>
              <td>Rs. ${(totalOnlineSales / onlineItemCount).toFixed(2)}</td>
            </tr>
            <tr>
              <td>In-Store</td>
              <td>Rs. ${totalInstoreSales}</td>
              <td>${instoreItemCount}</td>
              <td>Rs. ${(totalInstoreSales / instoreItemCount).toFixed(2)}</td>
            </tr>
          </table>

          <h2>Profits from channels:</h2>
          <table>
            <tr>
              <th>Channel</th>
              <th>Total Sales Revenue</th>
              <th>Cost of Sales</th>
              <th>Gross Profit</th>
            </tr>
            <tr>
              <td>Website</td>
              <td>Rs. ${totalOnlineSales}</td>
              <td>Rs. ${onlineCostOfGoodsSold}</td>
              <td>Rs. ${onlineProfit}</td>
            </tr>
            <tr>
              <td>In-store</td>
              <td>Rs. ${totalInstoreSales}</td>
              <td>Rs. ${instoreCostOfGoodsSold}</td>
              <td>Rs. ${instoreProfit}</td>
            </tr>
          </table>

          <h2>Summary</h2>
          <table>
            <tr>
              <td>Total Sales Revenue:</td>
              <td class="finalValues">Rs: ${totalSales}</td>
            </tr>
            <tr>
              <td>Total Cost of Goods Sold:</td>
              <td class="finalValues">Rs: ${totalCostOfGoodsSold}</td>
            </tr>  
            <tr>
              <td>Expire & Returns:</td>
              <td class="finalValues">Rs: ${costOfExpiredProducts + costOfReturnedProducts}</td>
            </tr>
            <tr>
              <td>Discounts Allowed:</td>
              <td class="finalValues">Rs. ${totalDiscounts}</td>
            </tr>
            <tr>
              <td>Net Sales Profit:</td>
              <td class="finalValues" style="border: 2px solid;">Rs. ${totalProfit}</td>
            </tr>
          </table>
        </div>
        <script>
          var fromDate = "${startDate}";
          var toDate = "${endDate}";
          document.getElementById("date").innerHTML = "Report generated for the period " + fromDate + " to " + toDate;
        </script>
      </body>
      </html>
    `;

    pdf.create(htmlContent).toFile(pdfFilePath, (err, result) => {
      if (err) {
        res.status(500).json({ message: "Server error occurred" });
      } else {
        res.status(200).download(pdfFilePath);
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error occurred", error: err });
  }
});

module.exports = router;
