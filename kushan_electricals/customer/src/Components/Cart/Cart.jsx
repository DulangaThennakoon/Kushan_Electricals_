import React from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput,
} from "mdb-react-ui-kit";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { useEffect, useState } from "react";
import { CiTrash } from "react-icons/ci";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PaymentModal from "./PaymentModal";
import TextField from "@mui/material/TextField";
import {
  validateName,
  validatePhoneNumber,
  validateAddress,
} from "../Validation";
import {
  getCart,
  changeDeliveryInfo,
  changeCartItemQuantity,
  removeCartItem,
} from "../Services/cartServices";
import { getCustomerDetails } from "../Services/userServices";
import "./Cart.css";

function Cart() {
  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("logged") || false
  );
  const customerID = localStorage.getItem("customerID") || "";
  const total = 1564;
  const deliveryCharge = 250;
  const [editable, setEditable] = useState(false);
  const [cartID, setCartID] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [cart_Items, setCart_Items] = useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  useEffect(() => {
    getCartDetails();
  }, []);

  function getCartDetails() {
    if (loggedIn) {
      getCart(customerID)
        .then((data) => {
          setCart_Items(data);
          setCartID(data[0].cartID);
        })
        .catch((err) => {
          console.error("Error fetching cart details:", err);
        });
    } else {
      toast.error("Please login to view cart items");
    }
  }

  useEffect(() => {
    if (loggedIn) {
      getCustomerDetails()
        .then((response) => {
          setReceiverName(
            response.data.firstName + " " + response.data.lastName
          );
          setAddress(response.data.address);
          setMobile(response.data.telephone);
        })
        .catch((err) => {
          console.error("Error fetching customer details:", err);
        });
    }
  }, []);

  /////add to cart handle krpn

  const changeQuantityInDb = async (id, quantity) => {
    try {
      console.log(quantity,"Quantity ")
      const response = await changeCartItemQuantity(id, quantity);
      console.log("asdasdadqwe d asd asd asd ",response)
      if (response && response.status === 200) {
        getCartDetails();
      } else {
        toast.error(response.message, {
          position: "top-right",
          autoClose: 3500,
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating quantity", {
        position: "top-right",
        autoClose: 3500,
      });
    }
  };

  const handleQuantityChange = (id, change) => {
    setCart_Items((prevItems) => {
      return prevItems.map((item) => {
        if (item.cart_itemID === id) {
          item.quantity += change;
          changeQuantityInDb(id, change);

          if (item.quantity < 1) {
            item.quantity = 1;
            changeQuantityInDb(id, 0);
          }
        }
        return item;
      });
    });
  };

  const handleRemove = (id) => {
    removeCartItem(id)
      .then((response) => {
        if (response.status === 200) {
          setCart_Items((prevItems) => {
            console.log("Item removed from cart");
            return prevItems.filter((item) => item.cart_itemID !== id);
          });
        } else {
          alert("Error removing item");
          toast.error(response.message, {
            position: "top-right",
            autoClose: 3500,
          });
        }
      })
      .catch((error) => {
        alert("Error removing item from cart");
        console.error("Error removing item from cart:", error);
        toast.error("Error removing item from cart", {
          position: "top-right",
          autoClose: 3500,
        });
      });
    getCartDetails();
  };

  const handleDeliveryDataChange = async () => {
    try {
      setEditable(false);
      const response = await changeDeliveryInfo(receiverName, mobile, address);
      if (response.status === 200) {
        toast.success(response.message, {
          position: "top-right",
          autoClose: 3500,
        });
      } else {
        toast.error(response.message, {
          position: "top-right",
          autoClose: 3500,
        });
      }
    } catch (error) {
      console.error("Error updating delivery information:", error);
      toast.error("Error updating delivery information", {
        position: "top-right",
        autoClose: 3500,
      });
    }
  };
  useEffect(() => {
    let subTotal = 0;
    cart_Items.forEach((item) => {
      subTotal += item.unitPrice * item.quantity;
    });
    setSubTotal(subTotal);
  }, [cart_Items]);

  return (
    <MDBContainer fluid className="p-3 my-5">
      <MDBRow className="row">
        <div col="10" className="itemsColumn">
          <h1>Cart</h1>
          <div className="cartItems">
            {cart_Items.map((item) => (
              <MDBCard className="itemCard" key={item.cart_itemID}>
                <MDBCardBody className="cardBody">
                  <div className="itemName">{item.productName}</div>
                  <div className="itemDataNControls">
                    <div className="itemPrice">{item.unitPrice} p.p</div>
                    <div className="itemQuantity">
                      <MDBBtn
                        className="qtyChangeBtn"
                        color="dark"
                        onClick={() =>
                          handleQuantityChange(item.cart_itemID, -1)
                        }
                      >
                        -
                      </MDBBtn>

                      {item.quantity}
                      <MDBBtn
                        className="qtyChangeBtn"
                        color="dark"
                        onClick={() =>
                          handleQuantityChange(item.cart_itemID, 1)
                        }
                      >
                        +
                      </MDBBtn>
                    </div>
                    <MDBBtn
                      color="dark"
                      id="removeTextButton"
                      onClick={() => handleRemove(item.cart_itemID)}
                    >
                      Remove
                    </MDBBtn>
                    <MDBBtn
                      color="dark"
                      id="removeIconButton"
                      onClick={() => handleRemove(item.cart_itemID)}
                    >
                      <CiTrash />
                    </MDBBtn>
                  </div>
                </MDBCardBody>
              </MDBCard>
            ))}
          </div>
        </div>

        <div col="10" className="detailsColumn">
          <h2>Order details</h2>

          <div>
            <MDBCard className="detailCard">
              <MDBCardBody className="detailCardBody">
                <div className="receiverDatailNBtn">
                  <h5>Receiver Details</h5>
                  {!editable ? (
                    <MDBBtn onClick={(e) => setEditable(true)}>Edit</MDBBtn>
                  ) : (
                    <MDBBtn onClick={handleDeliveryDataChange}>Change</MDBBtn>
                  )}
                </div>
                <div className="detailItem">
                  <TextField
                    label="Receiver Name"
                    variant="standard"
                    color="success"
                    className="detailField"
                    value={receiverName}
                    focused
                    disabled={!editable}
                    onChange={(e) => setReceiverName(e.target.value)}
                  />
                </div>
                <div className="detailItem">
                  <TextField
                    label="Mobile"
                    variant="standard"
                    color="success"
                    value={mobile}
                    focused
                    className="detailField"
                    disabled={!editable}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>
                <div className="detailItem">
                  <TextField
                    label="Receiver Address"
                    variant="standard"
                    color="success"
                    className="detailField"
                    value={address}
                    focused
                    disabled={!editable}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </MDBCardBody>
            </MDBCard>
          </div>
          <div>
            <MDBCard className="detailCard">
              {cart_Items.length !== 0 ? (
                <MDBCardBody className="detailCardBody">
                  <h5>Order Details</h5>
                  <MDBContainer>
                    <MDBRow>
                      <MDBCol md="8" className="text-end">
                        <h5>Subtotal:</h5>
                      </MDBCol>
                      <MDBCol md="4" className="text-end">
                        <h4>Rs. {subTotal}</h4>
                      </MDBCol>
                    </MDBRow>
                    <MDBRow>
                      <MDBCol md="8" className="text-end">
                        <h5>Delivery charge:</h5>
                      </MDBCol>
                      <MDBCol md="4" className="text-end">
                        <h4>Rs. {deliveryCharge}</h4>
                      </MDBCol>
                    </MDBRow>
                    <MDBRow>
                      <MDBCol md="8" className="text-end">
                        <h3>Net total:</h3>
                      </MDBCol>
                      <MDBCol md="4" className="text-end">
                        <h4 style={{ display: "flex" }}>
                          Rs.{" "}
                          <h1 style={{ fontWeight: "bold" }}>
                            {subTotal + 250}
                          </h1>
                          .00
                        </h4>
                      </MDBCol>
                    </MDBRow>
                    <MDBRow>
                      <MDBCol className="text-end">
                        <div id="proceedBTNdiv">
                          <PaymentModal
                            cartID={cartID}
                            subtotal={subTotal}
                            deliveryCharge={deliveryCharge}
                          />
                        </div>
                      </MDBCol>
                    </MDBRow>
                  </MDBContainer>
                </MDBCardBody>
              ):
              <MDBCardBody className="detailCardBody">
                <h5>Order Details</h5>
                <h4>No items in cart</h4>
              </MDBCardBody>
              }
            </MDBCard>
          </div>
        </div>
      </MDBRow>
      <ToastContainer />
    </MDBContainer>
  );
}

export default Cart;
