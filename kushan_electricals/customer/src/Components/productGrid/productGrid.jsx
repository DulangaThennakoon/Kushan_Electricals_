import * as React from "react";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { getProducts } from "../Services/productServices";
import "./productGrid.css";
import { toast } from "react-toastify";

const noImage =
  "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg";

export default function ProductGrid({ searchTerm, minPrice, maxPrice }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts()
      .then((data) => {
        console.log(data)
        if (Array.isArray(data)) {  
          setProducts(data);
        } else {
          console.error("Expected array but got:", data);
          setProducts([]);
        }
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setProducts([]);
      });
  }, []);

  useEffect(() => {
    console.log(searchTerm, minPrice, maxPrice);
    toast.info("Filtering products based on search query and price range");
  }, [searchTerm, minPrice, maxPrice]);

  // Filter products based on searchQuery and price range
  const filteredProducts = products.filter((product) => 
    (product.productName?.toLowerCase().includes(searchTerm?.toLowerCase()) ||
      product.categoryName?.toLowerCase().includes(searchTerm?.toLowerCase())) &&
    product.unitPrice >= minPrice && product.unitPrice <= maxPrice
  );

  return (
    <div>
      <Box sx={{ flexGrow: 1, p: 2 }} className="productBox">
        <Grid
          className="productGrid"
          container
          spacing={2}
          sx={{
            "--Grid-borderWidth": "1px",
            borderTop: "var(--Grid-borderWidth) ",
            borderLeft: "var(--Grid-borderWidth) ",
            borderColor: "divider",
            "& > div": {
              borderRight: "var(--Grid-borderWidth) ",
              borderBottom: "var(--Grid-borderWidth) ",
              borderColor: "divider",
            },
          }}
        >
          {filteredProducts.map((product) => (
            <Grid key={product.productID} item xs={12} sm={6} md={4} lg={2}>
              <div className="card">
                <img
                  src={product.image1 || noImage}
                  className="card-img-top"
                  alt="Product"
                />
                <div className="card-body">
                  <h6 className="card-productName">{product.productName}</h6>
                  <p className="card-productPrice">
                    <b>Rs. {product.unitPrice}.00</b>
                  </p>
                  <div className="card-button-status">
                    <Link to={`/product/${product.productID}`}>
                      <Button variant="contained">View</Button>
                    </Link>
                    {product.currentStock >= 10 ? (
                      <p style={{ color: "green" }}>Available</p>
                    ) : (
                      <p style={{ color: "red" }}>
                        Not
                        <br />
                        Available
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  );
}
