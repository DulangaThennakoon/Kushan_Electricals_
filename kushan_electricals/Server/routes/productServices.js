const express = require("express");
const router = express.Router();
const db = require("../Server_Configuration");
const { validateToken } = require("../JWT");

// Function to call the stored procedure
function callStoredProcedure(res) {
  const callProcedureQuery = "CALL GetProducts()";
  db.query(callProcedureQuery, (err, result) => {
    if (err) {
      console.error("Error executing stored procedure:", err);
      return res.json({ message: "Error executing stored procedure" });
    }
    if (!result || result[0].length === 0) {
      console.log("No products found");
      return res.json({ message: "No products found" });
    }
    console.log("Stored procedure result:", result[0]);
    res.json(result[0]);
  });
}

// Route to get products
router.get("/getProducts", (req, res) => {
  const checkProcedureExistsQuery =
    "SELECT COUNT(*) AS procedureExists FROM information_schema.ROUTINES WHERE ROUTINE_SCHEMA = 'kushan_electricals' AND ROUTINE_NAME = 'GetProducts' AND ROUTINE_TYPE = 'PROCEDURE'";

  db.query(checkProcedureExistsQuery, (err, result) => {
    if (err) {
      console.error("Error checking stored procedure existence:", err);
      return res.json({ message: "Error checking stored procedure existence" });
    }

    const procedureExists = result[0].procedureExists;
    console.log("Procedure exists:", procedureExists);

    if (procedureExists === 0) {
      const createProcedureQuery = `
        CREATE PROCEDURE GetProducts()
        BEGIN
            SELECT p.*, s_c.subCategoryName, c.categoryName
            FROM product p
            INNER JOIN sub_category s_c ON p.subCategoryID = s_c.subCategoryID
            INNER JOIN category c ON s_c.categoryID = c.categoryID
            WHERE p.status =1;
        END`;

      db.query(createProcedureQuery, (err) => {
        if (err) {
          console.error("Error creating stored procedure:", err);
          return res.json({ message: "Error creating stored procedure" });
        }
        console.log("Stored procedure created successfully");
        callStoredProcedure(res);
      });
    } else {
      callStoredProcedure(res);
    }
  });
});

// Route to get product details by ID
router.get("/getProductDetails/:productID", (req, res) => {
  const productID = req.params.productID;
  const sql = `SELECT p.*, s_c.subCategoryName
        FROM product p 
        INNER JOIN sub_category s_c ON p.subCategoryID = s_c.subCategoryID 
        WHERE productID = ?`; // Use parameterized query to prevent SQL injection

  db.query(sql, [productID], (err, result) => {
    if (err) {
      console.error("Server error occurred:", err);
      return res.json({ message: "Server error occurred" });
    }
    if (result.length === 0) {
      console.log("Product not found");
      return res.json({ message: "Product not found" });
    }
    console.log("Product details result:", result);
    res.json(result);
  });
});

module.exports = router;
