import React, { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { validateIntegers } from "../functionality/validation";
import SideNavbar from "../Components/SideNavbar";
import InventoryNavBar from "../Components/InventoryNavBar";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

function HandleExpiredProducts() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/owner/productServices/getCategories")
      .then((res) => {
        console.log(res.data);
        setCategories(res.data);
        setSelectedCategory(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Error fetching data", {
          position: "top-right",
          autoClose: 2500,
        });
      });
  }, []);

  useEffect(() => {
    if (selectedCategory !== "") {
      axios
        .get(
          `http://localhost:5000/api/owner/productServices/getSubCategories/${selectedCategory.categoryID}`
        )
        .then((res) => {
          setSubCategories(res.data);
          if (res.data.length > 0) {
            setSelectedSubCategory(res.data[0]);
          } else {
            setSelectedSubCategory("");
          }
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error fetching data", {
            position: "top-right",
            autoClose: 2500,
          });
        });
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSubCategory !== "") {
      axios
        .get(
          `http://localhost:5000/api/owner/productServices/getProductsBySubCategory/${selectedSubCategory.subCategoryID}`
        )
        .then((res) => {
          setProducts(res.data);
          setSelectedProduct(res.data[0]);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Error fetching data", {
            position: "top-right",
            autoClose: 2500,
          });
        });
    } else {
      setProducts([selectedSubCategory]);
    }
  }, [selectedSubCategory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const productID = selectedProduct.productID;
    if (!validateIntegers(quantity)) {
      toast.error("Quantity should be an integer");
      return;
    } else if (quantity <= 0) {
      toast.error("Quantity should be greater than 0");
      return;
    } else if (quantity > selectedProduct.currentStock) {
      toast.error("Quantity should be less than or equal to current stock");
      return;
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#000000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, remove stock!",
        focusCancel: true,
      }).then((result) => {
        if (result.isConfirmed) {
          const accessToken = localStorage.getItem("accessToken");
          axios
            .post(
              "http://localhost:5000/api/owner/productServices/removeExpiredProducts",
              {
                productID: productID,
                quantity: quantity,
              },
              {
                headers: {
                  "x-access-token": accessToken,
                },
              }
            )
            .then((res) => {
              console.log(res.data);
              toast.success("Expired products removed successfully");
            })
            .catch((err) => {
              console.log(err);
              if (err.response.status === 402) {
                toast.error("User not authenticated");
                return;
              } else {
                toast.error("Error removing expired products");
              }
            });
        }
      });
    }
  };

  return (
    <div>
      <InventoryNavBar selected="handleexpiredproducts"/>
      <SideNavbar selected="Inventory" />
      <Form onSubmit={handleSubmit}>
        <MDBContainer fluid className="bg-white" style={{ height: "100vh" }}>
          <MDBRow className="d-flex justify-content-center align-items-center h-100">
            <MDBCol style={{ paddingRight: "1rem" }}>
              <MDBCard
                className="my-4"
                style={{
                  display: "flex",
                  width: "91%",
                  marginLeft: "auto",
                  marginRight: "auto",
                  zIndex: "800",
                }}
              >
                <MDBRow className="g-0 justify-content-center">
                  {" "}
                  <MDBCol md="6">
                    <MDBCardBody className="text-black d-flex flex-column justify-content-center">
                      <h3 className="mb-5 text-uppercase fw-bold">
                        Expired products
                      </h3>

                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          <Form.Label>Select category</Form.Label>
                          <Form.Select
                            id="categorySelect"
                            onChange={(e) => {
                              setSelectedCategory(
                                categories.find(
                                  (category) =>
                                    category.categoryID ===
                                    parseInt(e.target.value)
                                )
                              );
                            }}
                            value={selectedCategory.categoryID}
                          >
                            {categories.map((category) => (
                              <option
                                key={category.categoryID}
                                value={category.categoryID}
                              >
                                {category.categoryName}
                              </option>
                            ))}
                          </Form.Select>
                        </MDBCol>

                        <MDBCol md="6">
                          <Form.Label>Select sub-category</Form.Label>
                          {subCategories.length > 0 ? (
                            <Form.Select
                              id="subCategorySelect"
                              onChange={(e) => {
                                setSelectedSubCategory(
                                  subCategories.find(
                                    (subcategory) =>
                                      subcategory.subCategoryID ===
                                      parseInt(e.target.value)
                                  )
                                );
                              }}
                              value={selectedSubCategory.subCategoryID}
                            >
                              {subCategories.map((subcategory) => (
                                <option
                                  key={subcategory.subCategoryID}
                                  value={subcategory.subCategoryID}
                                >
                                  {subcategory.subCategoryName}
                                </option>
                              ))}
                            </Form.Select>
                          ) : (
                            <Form.Select disabled>
                              <option>No sub-categories available</option>
                              setSelectedSubCategory("");
                            </Form.Select>
                          )}
                        </MDBCol>
                      </MDBRow>
                      <MDBRow style={{ marginBottom: "1rem" }}>
                        {/* <MDBCol md="6"> */}
                        <Form.Label>Select product</Form.Label>
                        {products.length > 0 && subCategories.length !== 0 ? (
                          <Form.Select
                            id="productSelect"
                            onChange={(e) => {
                              setSelectedProduct(
                                products.find(
                                  (product) =>
                                    product.productID ===
                                    parseInt(e.target.value)
                                )
                              );
                            }}
                            value={selectedProduct.productID}
                          >
                            {products.map((product) => (
                              <option
                                key={product.productID}
                                value={product.productID}
                              >
                                {product.productName}
                              </option>
                            ))}
                          </Form.Select>
                        ) : (
                          <Form.Select disabled>
                            <option>No products available</option>
                          </Form.Select>
                        )}
                        {/* </MDBCol> */}
                      </MDBRow>

                      <Form.Label>Quantity</Form.Label>
                      <Form.Control
                        id="productQuantity"
                        type="number"
                        value={quantity}
                        onChange={(e) => {
                          setQuantity(e.target.value);
                        }}
                        placeholder="number of expired units....."
                      />

                      <div className="d-flex justify-content-end pt-3">
                        <Button variant="outline-dark" type="reset">
                          Clear all
                        </Button>
                        &nbsp;
                        <Button
                          as="input"
                          variant="dark"
                          type="submit"
                          value="Remove items"
                        />
                      </div>
                    </MDBCardBody>
                  </MDBCol>
                </MDBRow>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </Form>
      <ToastContainer />
    </div>
  );
}

export default HandleExpiredProducts;
