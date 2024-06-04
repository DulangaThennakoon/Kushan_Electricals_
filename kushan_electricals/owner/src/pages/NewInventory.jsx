import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import SideNavbar from "../Components/SideNavbar";
import InventoryNavBar from "../Components/InventoryNavBar";
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBRadio,
} from "mdb-react-ui-kit";
import { validatePrice, validateIntegers } from "../functionality/validation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

function NewInventory() {
  const { productId } = useParams();
  const [product, setProduct] = useState({});
  const [buyingPrice, setBuyingPrice] = useState("");
  const [stock, setStock] = useState("");
  const [showModal, setShowModal] = useState(false);
  console.log(productId);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/api/owner/productServices/getProductData/${productId}`
      )
      .then((res) => {
        console.log(res.data);
        setProduct(res.data[0]);
        console.log(product);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [productId]);

  const handleSubmit = () => {
    if (!validateIntegers(stock) || stock === 0) {
      toast.error("Invalid stock", {
        position: "top-right",
        autoClose: 3500,
      });
      return;
    } else if (!validatePrice(buyingPrice) || buyingPrice === 0) {
      toast.error("Invalid buying price", {
        position: "top-right",
        autoClose: 3500,
      });
      return;
    } else {
      const accessToken = localStorage.getItem("accessToken");
      axios
        .post(
          "http://localhost:5000/api/owner/productServices/newInventory",
          {
            productId: productId,
            stock: stock,
            buyingPrice: buyingPrice,
            // supplierId: product.supplierID,
          },
          {
            headers: {
              "x-access-token": accessToken,
            },
          }
        )
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            Swal.fire({
              icon: "success",
              title: "New supplies added successfully!!",
              showConfirmButton: true,
              confirmButtonColor: "#000000",
            }).then(() => {
              navigate("/inventory");
            });
          } else {
            toast.error("Failed to add new supplies", {
              position: "top-right",
              autoClose: 3500,
            });
            return;
          }
        })
        .catch((err) => {
          console.log(err);
          if (err.response.status === 402) {
            toast.error("Authentication failed", {
              position: "top-right",
              autoClose: 3500,
            });
            return;
          } else {
          }
          toast.error("Failed to add new supplies", {
            position: "top-right",
            autoClose: 3500,
          });
        });
    }
  };

  return (
    <>
      <InventoryNavBar/>
      <SideNavbar selected="Inventory" />
      <Form>
        <MDBContainer fluid className="bg-white" style={{ height: "100vh" }}>
          <MDBRow className="d-flex justify-content-center align-items-center h-100">
            <MDBCol style={{display:'flex',justifyContent:'center',marginRight:'1rem'}}>
              <MDBCard className="my-4" style={{zIndex: "888",width:'91%'}}>
                <MDBRow
                  className="g-0"
                  style={{ display: "flex", justifyContent: "center" }}
                >
                  <MDBCol md="6">
                    <MDBCardBody className="text-black d-flex flex-column justify-content-center">
                      <div style={{ display: "flex" }}>
                        <h3 className="mb-5 text-uppercase fw-bold">
                          New Inventory
                        </h3>
                      </div>

                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          <Form.Label>Product Name</Form.Label>
                          <Form.Control
                            type="text"
                            value={product.productName}
                            disabled
                          />
                        </MDBCol>

                        <MDBCol md="6">
                          <Form.Label>Brand</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="brand name"
                            value={product.brandName}
                            disabled
                          />
                        </MDBCol>
                      </MDBRow>

                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          <Form.Label htmlFor="disabledSelect">
                            Current stock
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Current stock"
                            value={product.currentStock}
                            disabled
                          />
                        </MDBCol>

                        <MDBCol md="6">
                          <Form.Label htmlFor="disabledSelect">
                            Reorder level
                          </Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="reorder level"
                            value={product.preorderLevel}
                            disabled
                          />
                        </MDBCol>
                      </MDBRow>

                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          <Form.Label>Selling price</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="product buying price per unit"
                            value={product.unitPrice}
                            disabled
                          />
                        </MDBCol>
                        {/* <MDBCol md="6">
                          <Form.Label>Supplier</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Supplier name"
                            value={product.supplierName}
                            disabled
                          />
                        </MDBCol> */}
                      </MDBRow>

                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          <Form.Label>Stock</Form.Label>
                          <Form.Control
                            id="inputStock"
                            type="number"
                            placeholder="number of pieces adding to the stock"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                          />
                        </MDBCol>

                        {/* <MDBCol md="6">
                          <Form.Label>Buying price</Form.Label>
                          <Form.Control
                            id="inputBuyingPrice"
                            type="number"
                            placeholder="product buying price per unit"
                            value={buyingPrice}
                            onChange={(e) => setBuyingPrice(e.target.value)}
                          />
                        </MDBCol> */}
                      </MDBRow>

                      <div className="d-flex justify-content-end pt-3">
                        <Button
                          variant="outline-dark"
                          type="reset"
                          style={{ width: "5rem" }}
                        >
                          Clear
                        </Button>
                        &nbsp;
                        <Button
                          type="button"
                          variant="dark"
                          onClick={handleSubmit}
                          value="Done"
                          style={{ width: "5rem" }}
                        >
                          Done
                        </Button>
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
    </>
  );
}

export default NewInventory;
