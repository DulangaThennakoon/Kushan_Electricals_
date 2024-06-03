import React from "react";
import InventoryNavBar from "../Components/InventoryNavBar";
import SideNavbar from "../Components/SideNavbar";
import "../Components/productlist.css";
import { Form, Row, Col, Button, InputGroup } from "react-bootstrap";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Popper from "@mui/material/Popper";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { convertToPriceFormat } from "../functionality/validation";
import TitleBar from "../Components/TitleBar";
import "./Inventory.css";

function Inventory() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popperOpen, setPopperOpen] = useState(false);
  const [popperContent, setPopperContent] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/listProducts")
      .then((res) => {
        setItems(res.data);
        setSearchResults(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const results = items.filter((item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, items]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleMouseOver = (event) => {
    // Add blur effect to the tile when mouse is over
    event.target.closest(".box").style.filter = "blur(0px)";

    // Show the popup banner
    event.target.closest(".box").querySelector(".popup").style.display =
      "block";
  };

  const handleMouseOut = (event) => {
    // Remove blur effect when mouse leaves the tile
    event.target.closest(".box").style.filter = "none";

    // Hide the popup banner
    event.target.closest(".box").querySelector(".popup").style.display = "none";
  };
  const handlePopoverOpen = (event, productName) => {
    setAnchorEl(event.currentTarget);
    setPopperContent(productName);
    setPopperOpen(true);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
    setPopperOpen(false);
  };

  const quicksearch = ["Bulb", "Cable", "Wire", "Electric"];

  return (
    <div>
      <InventoryNavBar />
      <SideNavbar selected="Inventory" />

      <div
        style={{
          paddingTop: "1rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "90%",
            justifyContent: "center",
          }}
        >
          
          {quicksearch.map((item) => (
            <Button
              key={item}
              variant="outline-dark"
              size="sm"
              style={{ marginLeft: "0.3rem", zIndex: "777" }}
            >
              {item}
            </Button>
          ))} 
          
        </div>
      </div>
      <div className="flex-container" style={{display:'flex',justifyContent:'center'}}>
            <div className="searchDiv" style={{marginLeft:"",marginTop:'-5.9rem',zIndex:'905'}}>
              <Form inline style={{ zIndex: "777" }}>
                <Row>
                  <Col xs="auto">
                    <Form.Control
                      type="text"
                      placeholder="Search"
                      className="mr-sm-2"
                      onChange={handleSearch}
                    />
                  </Col>
                  <Col xs="auto" style={{ marginLeft: "-15px" }}>
                    <Button type="submit">Submit</Button>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div className="productGrid">
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {searchResults.map((product) => (
                <Grid key={product.productID} item style={{ zIndex: "888" }}>
                  <Link
                    to={`/editproduct/${product.productID}`}
                    key={product.productID}
                  >
                    <Card
                      sx={{ width: 130, height: 190 }}
                      onMouseEnter={(e) =>
                        handlePopoverOpen(e, product.productName)
                      }
                      onMouseLeave={handlePopoverClose}
                      style={{
                        cursor: "pointer",
                        boxShadow: "0 0 10px 0 rgba(0,0,0,0.1)",
                      }}
                    >
                      <CardMedia
                        sx={{ height: 120 }}
                        image={product.image1}
                        title="Product"
                      />
                      <CardContent className="cardDetails">
                        <Typography variant="body2" className="two-line-text">
                          {product.productName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          className="cardPrice"
                        >
                          Rs. {convertToPriceFormat(product.unitPrice)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Link>
                </Grid>
              ))}
            </Grid>
            <Popper
              open={popperOpen}
              anchorEl={anchorEl}
              placement="top-start"
              style={{
                zIndex: 910,
                width: "120px",
              }}
              modifiers={[
                {
                  name: "flip",
                  enabled: false,
                },
                {
                  name: "preventOverflow",
                  options: {
                    altAxis: true,
                    tether: false,
                    altBoundary: true,
                    rootBoundary: "viewport",
                    padding: 8,
                  },
                },
                {
                  name: "offset",
                  options: {
                    offset: [0, 0],
                  },
                },
              ]}
            >
              <Paper
                sx={{
                  padding: 1,
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  color: "white",
                  transformOrigin: "top left",
                }}
              >
                <Typography variant="body2">{popperContent}</Typography>
              </Paper>
            </Popper>
          </Grid>
        </div>
      </div>
    </div>
  );
}

export default Inventory;
