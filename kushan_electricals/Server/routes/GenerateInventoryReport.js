const bodyParser = require("body-parser");
const pdf = require("html-pdf");
const path = require("path");
const fs = require("fs");
const db = require("../Server_Configuration");
const { validateOwnerToken } = require("../ownerJWT");
// routes/customerServices.js

const express = require("express");
const router = express.Router();

const getCategorySQL = "SELECT categoryID,categoryName from category";
const getProductSQL =
  "SELECT product.productID,product.subCategoryID,product.productName,product.unitPrice,product.preorderLevel,product.currentStock,sub_category.categoryID,sub_category.subCategoryName from product INNER JOIN sub_category on sub_category.subCategoryID = product.subCategoryID WHERE product.status = 1;";
const productData = [];
const dbCategories = [];
const transformedDbCategories = [];
const transformedProductData = [];
var totalValue = 0;
var htmlContent = ``;

function getCategories() {
  return new Promise((resolve, reject) => {
    db.query(getCategorySQL, (err, result) => {
      if (err) {
        reject(err);
      } else {
        dbCategories.push(result);
        resolve(dbCategories);
      }
    });
  });
}

function getProducts() {
  return new Promise((resolve, reject) => {
    db.query(getProductSQL, (err, result) => {
      if (err) {
        console.log("Failed to get Product Data.", err);
        reject(err);
      } else {
        productData.push(result);
        resolve(productData);
      }
    });
  });
}

router.post("/createInventoryReport",validateOwnerToken, (req, res) => {
  //res.send('Inventory report created');
  const pdfFilePath = path.join(__dirname, "InventoryReport.pdf");
  getCategories()
    .then(() => {
      transformedDbCategories.push(
        dbCategories[0].map((rowDataPacket) => {
          return {
            categoryID: rowDataPacket.categoryID,
            CategoryName: rowDataPacket.categoryName,
          };
        })
      );
      getProducts().then(() => {
        transformedProductData.push(
          productData[0].map((rowDataPacket) => {
            return {
              productID: rowDataPacket.productID,
              productName: rowDataPacket.productName,
              unitPrice: rowDataPacket.unitPrice,
              currentStock: rowDataPacket.currentStock,
              categoryID: rowDataPacket.categoryID,
              subCategoryName: rowDataPacket.subCategoryName,
            };
          })
        );
        htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Inventory Report</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
}
.container {
        max-width: 800px;
        margin: 20px auto;
        padding: 20px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}
h1 {
        text-align: center;
        color: #333;
}
table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
}
th, td {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        text-align: left;
}
th {
        background-color: #f2f2f2;
}
.category-heading {
        background-color: "#ccc";
        font-weight: bold;
}
.centerTD {
        text-align: center;
}
#totalCalc{
        display:none;

}

#currentDate{
text-align:center;
}
    </style>
    </head>
    <body>
    <div class="container">
    <img src="https://firebasestorage.googleapis.com/v0/b/kushan-electricals.appspot.com/o/logo.png?alt=media&token=73556b84-feac-467a-8c50-fdbdf44d20ef" alt="Inventory Icon" style="display: block; margin: 0 auto; width: 100px;margin-bottom: -20px;">
                    <h1>Inventory Report</h1>
            <p id = "currentDate"></p>
                    <table>
                            <thead>
                                    <tr>
                                            <th>Product Name</th>
                                            <th>Sub Category</th>
                                            <th>Quantity</th>
                                            <th>Unit Price (LKR)</th>
                                            <th>Total Value (LKR)</th>
                                    </tr>
                            </thead>
                            <tbody>
                                    ${transformedDbCategories[0]
                                      .map((category) => {
                                        return `
                                            <tr class="category-heading">
                                                    <td colspan="5">${
                                                      category.CategoryName
                                                    }</td>
                                            </tr>
                                            ${transformedProductData[0]
                                              .filter(
                                                (product) =>
                                                  product.categoryID ===
                                                  category.categoryID
                                              )
                                              .map((product) => {
                                                return `
                                                    <tr>
                                                            <td>${
                                                              product.productName
                                                            }</td>
                                                            <td>${
                                                              product.subCategoryName
                                                            }</td>
                                                            <td class="centerTD">${
                                                              product.currentStock
                                                            }</td>
                                                            <td class="centerTD">${
                                                              product.unitPrice
                                                            }</td>
                                                            <td class="centerTD">${
                                                              product.currentStock *
                                                              product.unitPrice
                                                            }</td>
                                                            <div id='totalCalc'>${(totalValue +=
                                                              product.currentStock *
                                                              product.unitPrice)}
                                                                <div>
                                                    </tr>
                                                    `;
                                              })
                                              .join("")}
                                              
                                            `;
                                      })
                                      .join("")}
                                    <tr class="category-heading">
                                            <td colspan="3">Total Value</td>
                                            <td>LKR.</td>
                                            <td>${totalValue}</td>
                                            
                            </tbody>
                    </table>
            </div>
            <script>
// Get current date and time
var now = new Date();
var datetime = now.toLocaleDateString();

// Insert date and time into HTML
document.getElementById("currentDate").innerHTML = "As at "+datetime;
</script>
    </body>
    </html>
    `;

        // Generate PDF
        pdf.create(htmlContent, {}).toFile(pdfFilePath, (err) => {
          if (err) {
            res.status(500).send("Error generating PDF");
          } else {
            totalValue = 0;
            res.download(pdfFilePath, () => {
              fs.unlinkSync(pdfFilePath);
            });
          }
        });
      });
    })
    .catch((err) => {
      console.log("Error getting data", err);
      res.status(500).send("Error getting data");
    });
});

module.exports = router;

function getHTMLContent(categoryArray, productArray) {
  return new Promise((resolve, reject) => {
    getCategories().then(() => {
      console.log("transformedDbCategories", transformedDbCategories);
      resolve(transformedDbCategories);
    });
  });
}
