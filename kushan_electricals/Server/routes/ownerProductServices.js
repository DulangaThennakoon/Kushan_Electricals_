const express = require("express");
const router = express.Router();
const db = require("../Server_Configuration");
const e = require("express");
const multer = require("multer");
const upload = multer();
const { validateOwnerToken } = require("../ownerJWT");
const { rename } = require("fs");


router.get("/getProductData/:productId", (req, res) => {
  const productId = req.params.productId;
  const sql = `
  SELECT 
  p.*, 
  sub_category.subCategoryName AS subCategoryName, 
  cat.* 
FROM 
  product p 
LEFT JOIN 
  sub_category ON sub_category.subCategoryID = p.subCategoryID 
LEFT JOIN 
  category cat ON cat.categoryID = sub_category.categoryID 
WHERE 
  p.productID = ?;
`;
    

  db.query(sql, [productId], (err, result) => {
    if (err) {
      res.status(500).json({ message: "Server error occurred" });
    } else {
      res.json(result);
     
    }
  });
});

router.get("/listLowStockProducts", (req, res) => {
  const sql = "SELECT * from product WHERE preorderLevel>=currentStock AND status = 1;";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error occurred" });
    res.json(result);
  });
});

router.get("/getCategories", (req, res) => {
  const sql = "SELECT * FROM category;";
  db.query(sql, (err, result) => {
    if (err) res.status(500).json({ message: "Server error occurred" });
    //res.json(result);
    res.status(200).json(result);
  });
});

router.get("/getSubCategories/:categoryID", (req, res) => {
  const categoryID = req.params.categoryID;

  const sql = "SELECT * FROM sub_category WHERE categoryID = ?;";
  db.query(sql, [categoryID], (err, result) => {
    if (err) res.json({ message: "Server error occurred" });
    res.json(result);
  });
});
router.get("/getProductsBySubCategory/:subCategoryID", (req, res) => {
  const subCategoryID = req.params.subCategoryID;

  const sql = "SELECT * FROM product WHERE subCategoryID = ? AND status = 1;";
  db.query(sql, [subCategoryID], (err, result) => {
    if (err) res.json({ message: "Server error occurred" });
    res.json(result);
  });
});

router.post("/removeExpiredProducts",validateOwnerToken, (req, res) => {
  const { productID, quantity } = req.body;
  const sql1 =
    "UPDATE product SET currentStock = currentStock - ? WHERE productID = ?;";
  const values = [quantity, productID];

  db.query(sql1, values, (err, result) => {
    if (err) {
      res.status(500).json({ message: "Server error occurred" });
    } else {
      const sql2 =
        "INSERT INTO expiredproducts (productID, date, quantity) VALUES (?, CURDATE(), ?);";
      const values2 = [productID, quantity];
      db.query(sql2, values2, (err2, result2) => {
        if (err2) {
          res.status(500).json({ message: "Server error occurred" });
        } else {
          res
            .status(200)
            .json({ message: "Expired products removed successfully" });
        }
      });
    }
  });
});

router.post("/addProduct", upload.none(),validateOwnerToken, (req, res) => {
  const {
    productName,
    brandName,
    subCategory,
    openingStock,
    reorderLevel,
    unitPrice,
    productDetails,
    supplierID,
    img1,
    img2,
    img3,
    barcode,
  } = req.body;
  console.log(req.body);
  const sql =
    "INSERT INTO product (subCategoryID, productName, brandName, details, unitPrice, preorderLevel, currentStock, supplierID, barcode,";

  // Create placeholders for images based on the number of images being passed
  const placeholders = ["image1", "image2", "image3"]
    .slice(0, [img1, img2, img3].filter(Boolean).length)
    .map((img, index) => ` ${img}`);

  // Concatenate placeholders to the SQL query
  const placeholdersString = placeholders.join(",");

  // Complete the SQL query
  const finalSql = `${sql}${placeholdersString}) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,${placeholders
    .fill("?")
    .join(",")} );`;

  // Create an array to hold the values for the SQL query
  const values = [
    subCategory,
    productName,
    brandName,
    productDetails,
    unitPrice,
    reorderLevel,
    openingStock,
    supplierID,
    barcode,
  ];

  // Add image values to the values array
  [img1, img2, img3].forEach((img) => {
    if (img) values.push(img);
  });

  db.query(finalSql, values, (err, result) => {
    if (err) {
      console.error("Error adding product", err);
      res.status(500).json({ message: "Server error occurred" });
    } else {
      // Get the current date
      const currentDate = new Date();

      // Get the year, month, and day from the current date
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-indexed, so we add 1
      const day = String(currentDate.getDate()).padStart(2, "0");

      // Concatenate the year, month, and day with hyphens to form the desired format
      const formattedDate = `${year}-${month}-${day}`;

      const sql2 =
        "INSERT INTO `inventory_purchase` (`productID`, `date`, `unitBuyingPrice`) VALUES (?, ?, ?);";
      const values2 = [result.insertId, formattedDate, unitPrice];
      db.query(sql2, values2, (err, result) => {
        if (err) {
          console.error("Error adding product", err);
          res.status(500).json({ message: "Server error occurred" });
        } else {
          console.log("Product added successfully");
          res.status(200).json({ message: "Product added successfully" });
        }
      });
    }
  });
});

router.post("/updateProductInfo", upload.none(),validateOwnerToken, (req, res) => {
  const {
    productId,
    productName,
    brandName,
    subCategory,
    openingStock,
    reorderLevel,
    unitPrice,
    productDetails,
    supplierID,
    img1,
    img2,
    img3,
  } = req.body;

  const sql =
    "UPDATE product SET productName = ?, brandName = ?, subCategoryID = ?, details = ?, unitPrice = ?, preorderLevel = ?, currentStock = ?, supplierID = ?, image1 = ?, image2 = ?, image3 = ? WHERE productID = ?";

  const values = [
    productName,
    brandName,
    subCategory,
    productDetails,
    unitPrice,
    reorderLevel,
    openingStock,
    supplierID,
    img1,
    img2,
    img3,
    productId,
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error updating product", err);
      res.status(500).json({ message: "Server error occurred" });
    } else {
      console.log("Product updated successfully");
      res.status(200).json({ message: "Product updated successfully" });
    }
  });
});

router.delete("/deleteProduct/:productId", validateOwnerToken,(req, res) => {
  const productId = req.params.productId;
  const sql = "UPDATE product SET status = 0 WHERE productID = ?;";
  db.query(sql, [productId], (err, result) => {
    if (err) {
      // If an error occurs, respond with a server error status code
      return res.status(500).json({ message: "Server error occurred" });
    }
  });

  res.status(200).json({ message: "Product deleted successfully" });
});

router.post("/transaction",validateOwnerToken, (req, res) => {
  const { total, discount, subtotal, items } = req.body;
  const transactionItems = items;
  const sub_total = total - discount;
  // Get the current date and time
  const currentDateTime = new Date();

  // Format the date and time to match MySQL dateTime format ('YYYY-MM-DD HH:MM:SS')
  const formattedDateTime = currentDateTime
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  // Now you can use formattedDateTime in your MySQL query
  console.log(formattedDateTime);
  // Logic to save the transaction to your database
  const sql1 =
    "INSERT INTO transactions (dateTime,total, discount, subTotal) VALUES (?, ?,?, ?)";
  const values = [formattedDateTime, total, discount, sub_total];
  db.query(sql1, values, (err, result) => {
    if (err) {
      console.error("Error updating product", err);
      res.status(500).json({ message: "Server error occurred" });
    } else {
      console.log("Transaction added successfully");
      // Get the last inserted transactionID
      db.query("SELECT LAST_INSERT_ID() AS transactionID", (err, result) => {
        if (err) {
          console.error("Error fetching transactionID", err);
          res.status(500).json({ message: "Server error occurred" });
        } else {
          const transactionID = result[0].transactionID;
          console.log("Transaction ID:", transactionID);
          // Use transactionID to insert transaction items
          transactionItems.forEach((item) => {
            const sql2 =
              "INSERT INTO transaction_items (transactionID, productID, quantity, unitPrice) VALUES (?, ?, ?, ?)";
            const values = [transactionID, item.id, item.quantity, item.price];
            db.query(sql2, values, (err, result) => {
              if (err) {
                console.error("Error updating product", err);
                // Handle error properly
              } else {
                console.log("Transaction item added successfully");
                // Handle success properly
              }
            });
            const sql3 =
              "UPDATE product SET currentStock = currentStock - ? WHERE productID = ?";
            const values3 = [item.quantity, item.id];
            db.query(sql3, values3, (err, result) => {
              if (err) {
                console.error("Error updating product", err);
                // Handle error properly
              } else {
                console.log("Product stock updated successfully");
                // Handle success properly
              }
            });
          });
          res.status(200).json({ message: "Transaction added successfully" });
        }
      });
    }
  });
});

router.post("/newInventory",validateOwnerToken, (req, res) => {
  const { productId, stock, buyingPrice, supplierId } = req.body;
  // Get the current date
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  // Concatenate the year, month, and day with hyphens to form the desired format
  const formattedDate = `${year}-${month}-${day}`;

  const sql1 =
    "UPDATE product SET currentStock = currentStock + ? WHERE productID = ?";
  const values1 = [stock, productId];

  db.query(sql1, values1, (err1, result) => {
    if (err1) {
      console.error("Error updating product", err1);
      res.status(500).json({ message: "Server error occurred" });
    } else {
      const sql2 =
        "INSERT INTO `inventory_purchase` (`productID`, `date`, `unitBuyingPrice`, `itemCount`, `supplierID`) VALUES (?, ?, ?, ?, ?)";
      const values2 = [
        productId,
        formattedDate,
        buyingPrice,
        stock,
        supplierId,
      ];
      db.query(sql2, values2, (err2, result2) => {
        if (err2) {
          console.error("Error inserting into inventory_purchase", err2);
          res.status(500).json({ message: "Server error occurred" });
        } else {
          console.log("Inventory added successfully");
          res.status(200).json({ message: "success" });
        }
      });
    }
  });
});

//get all purchase history
router.get("/purchaseHistory", (req, res) => {
  const sql =
    "SELECT i.*,p.productName,p.brandName,CASE WHEN DATEDIFF(CURRENT_DATE(), i.date) <= 5 THEN true ELSE false END AS ableToCancel,s.name FROM inventory_purchase i INNER JOIN product p ON i.productID = p.productID INNER JOIN supplier s on p.supplierID = s.supplierID;";
  db.query(sql, (err, result) => {
    if (err) res.json({ message: "Server error occurred" });
    res.json(result);
  });
});


//cancel purchase done by owner
router.post("/cancelPurchase", (req, res) => {
  const purchaseID = req.body.purchaseID;

  // Query to select productID from inventory_purchase table
  const sql =
    "SELECT productID,itemCount FROM inventory_purchase WHERE purchaseID = ?;";
  db.query(sql, [purchaseID], (err, result) => {
    if (err) {
      res.status(500).json({ message: "Server error occurred" });
    } else {
      if (result.length === 0) {
        res.status(404).json({ message: "Purchase not found" });
      } else {
        const productID = result[0].productID;
        const itemCount = result[0].itemCount;
        const sql2 =
          "UPDATE product SET currentStock = currentStock - ? WHERE productID = ?";
        const values = [itemCount, productID];
        db.query(sql2, values, (err2, result2) => {
          if (err2) {
            res.status(500).json({ message: "Server error occurred" });
          } else {
            const sql3 = "DELETE FROM inventory_purchase WHERE purchaseID = ?";
            db.query(sql3, [purchaseID], (err3, result3) => {
              if (err3) {
                res.status(500).json({ message: "Server error occurred" });
              } else {
                res
                  .status(200)
                  .json({ message: "Purchase cancelled successfully" });
                  console.log("Purchase cancelled successfully");
              }
            });
          }
        });
      }
    }
  });
});

router.post("/addNewCategory",validateOwnerToken, (req, res) => {
  const { categoryName } = req.body;
  const sql = "INSERT INTO category (categoryName) VALUES (?);";
  db.query(sql, [categoryName], (err, result) => {
    if (err) {
      console.error("Error adding category", err);
      res.status(500).json({ message: "Server error occurred" });
    } else {
      console.log("Category added successfully");
      res.status(200).json({ message: "Category added successfully" });
    }
  });
});

router.post("/renameCategory",validateOwnerToken, (req, res) => {
  const { categoryNewName, categoryID } = req.body;
  const sql = "UPDATE category SET categoryName = ? WHERE categoryID=?;";
  const values = [categoryNewName, categoryID];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error renaming category", err);
      res.status(500).json({ message: "Server error occurred" });
    } else {
      console.log("Category renamed successfully");
      res.status(200).json({ message: "Category renamed successfully" });
    }
  });
});

router.post("/renameSubCategory", (req, res) => {
  const { subCategoryNewName, subCategoryID } = req.body;
  const sql =
    "UPDATE sub_category SET subCategoryName = ? WHERE subCategoryID=?;";
  const values = [subCategoryNewName, subCategoryID];
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error renaming category", err);
      res.status(500).json({ message: "Server error occurred" });
    } else {
      console.log("Sub-Category renamed successfully");
      res.status(200).json({ message: "Sub-Category renamed successfully" });
    }
  });
});

router.post("/addNewSubCategory", (req, res) => {
  const { subCategoryName, categoryID } = req.body;
  const sql =
    "INSERT INTO sub_category (subCategoryName,categoryID) VALUES (?,?);";
  db.query(sql, [subCategoryName, categoryID], (err, result) => {
    if (err) {
      console.error("Error adding category", err);
      res.status(500).json({ message: "Server error occurred" });
    } else {
      console.log("Sub-Category added successfully");
      res.status(200).json({ message: "Sub-Category added successfully" });
    }
  });
});

router.post("/returnProduct", validateOwnerToken,(req, res) => {
  const { productID, quantity, supplierID, notExchanging } = req.body;
  const sql1 =
    "INSERT INTO product_return (productID, quantity,date, supplierID, notExchanging) VALUES (?,?, CURDATE(), ?, ?);";
    const values1 = [productID, quantity, supplierID, notExchanging];
    db.query(sql1, values1, (err, result) => {
      if (err) {
        res.status(500).json({ message: "Server error occurred" });
      } else {
        if(!notExchanging){
          const sql2 = "UPDATE product SET currentStock = currentStock - ? WHERE productID = ?;";
          const values2 = [quantity, productID];
          db.query(sql2, values2, (err2, result2) => {
            if (err2) {
              res.status(500).json({ message: "Server error occurred" });
            } else {
              res.status(200).json({ message: "Product returned successfully" });
            }
          });	
      }else{
        res.status(200).json({ message: "success" });
      }
    }
  });
});

router.get("/getBarcodes", (req, res) => {
  const sql = "SELECT barcode FROM product WHERE barcode IS NOT NULL AND barcode <> 'null'AND status=1;";
  db.query(sql, (err, result) => {
    if (err) {
      res.status(500).json({ message: "Server error occurred" });
    } else {
      const barcodes = result.map((product) => product.barcode);
      res.json(barcodes);
    }
  });
});


module.exports = router;
