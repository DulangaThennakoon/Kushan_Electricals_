import React, { useState } from "react";
import {
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBBtn,
  MDBInput,
  MDBCard,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { PiContactlessPayment } from "react-icons/pi";
import Cards from "react-credit-cards-2";
import "react-credit-cards-2/dist/es/styles-compiled.css";
import "./PaymentModal.css";
import {
  validateCardHolderName,
  validateCVC,
  validateExpiryDate,
  validateCardNumber,
} from "../Validation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CompletePayment } from "../Services/cartServices";

var creditCardType = require("credit-card-type");

export default function PaymentModal({ cartID , subtotal = 0, deliveryCharge = 0 }) {
  const [centredModal, setCentredModal] = useState(false);
  const toggleOpen = () => {
    let currentState = centredModal;
    setCentredModal(!currentState);
  };

  const [state, setState] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: "",
    focus: "",
  });

  const handleInputChange = (evt) => {
    const { name, value } = evt.target;

    setState((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputFocus = (evt) => {
    setState((prev) => ({ ...prev, focus: evt.target.name }));
  };

  const handlePayment = async(evt) => {
    evt.preventDefault();
    const cardType = creditCardType(state.number);
    if (cardType.length === 0) {
      toast.error("Invalid card number. Please enter a valid card number.");
      return;
    } else if (!validateCardNumber(state.number).status) {
      toast.error(validateCardNumber(state.number).message);
      return;
    } else if (!validateCardHolderName(state.name).status) {
      toast.error(validateCardHolderName(state.name).message);
      return;
    } else if (!validateExpiryDate(reorderExpiryDate(state.expiry)).status) {
      toast.error(validateExpiryDate(state.expiry).message);
      return;
    } else if (!validateCVC(state.cvc, cardType[0].type)) {
      toast.error("Invalid CVC. Please enter a valid CVC.");
      return;
    }
    
    try {
      const response = await CompletePayment(
      cartID,
      state.number,
      reorderExpiryDate(state.expiry),
      state.cvc
      );
      if (response.status === 200) {

      toast.success(response.message);
      setTimeout(() => {
       window.location.href = "/";
      }, 2000);
      } else {
      toast.error(response.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    }

  };

  const reorderCreditCardNumber = (cardNumber) => {
    // Remove any existing spaces from the card number
    const strippedNumber = cardNumber.replace(/\s/g, "");

    // Insert a space after every 4 digits
    const reorderedNumber = strippedNumber.replace(/(.{4})/g, "$1 ");

    return reorderedNumber.trim(); // Trim any leading/trailing spaces
  };

  const reorderExpiryDate = (expiryDate) => {
    // Check if expiryDate is a string
    if (typeof expiryDate !== "string") {
      // If not a string, convert it to a string
      expiryDate = String(expiryDate);
    }

    // Remove any non-numeric characters
    const numericExpiry = expiryDate.replace(/\D/g, "");

    // Take the first 4 digits (MMYY format)
    const mmYY = numericExpiry.slice(0, 4);

    // Format as MM/YY
    const reorderedExpiry = mmYY.replace(/(.{2})/, "$1/");

    return reorderedExpiry.trim(); // Trim any leading/trailing spaces
  };

  return (
    <>
      <Stack direction="row" spacing={2}>
        <Button
          style={{ backgroundColor: "green" }}
          variant="contained"
          endIcon={<PiContactlessPayment />}
          onClick={toggleOpen}
        >
          Proceed To Checkout
        </Button>
      </Stack>

      <MDBModal
        tabIndex="-1"
        open={centredModal}
        onClose={() => setCentredModal(false)}
      >
        <MDBModalDialog centered>
          <form onSubmit={handlePayment}>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Pay Via Stripe</MDBModalTitle>
                <MDBBtn
                  className="btn-close"
                  color="none"
                  onClick={toggleOpen}
                ></MDBBtn>
              </MDBModalHeader>
              <MDBCard className="priceCard">
                <MDBRow className="priceCardheading">
                  <MDBCol>
                    <p>Subtotal</p>
                  </MDBCol>
                  <MDBCol>
                    <>+</>
                  </MDBCol>
                  <MDBCol>
                    <>Delivery</>
                  </MDBCol>
                </MDBRow>
                <MDBRow className="mb-3" style={{ marginTop: "-1rem" }}>
                  <MDBCol>
                    <h5>{subtotal}.00</h5>
                  </MDBCol>
                  <MDBCol>
                    <h5>+</h5>
                  </MDBCol>
                  <MDBCol>
                    <h5>{deliveryCharge}.00</h5>
                  </MDBCol>
                </MDBRow>
                <MDBCol>
                  <MDBRow>
                    <h4>
                      <b>Total : RS.{subtotal + deliveryCharge}.00</b>
                    </h4>
                  </MDBRow>
                </MDBCol>
              </MDBCard>
              <MDBModalBody>
                <MDBCard>
                  <MDBRow className="gridRow">
                    <MDBCol>
                      <Cards
                        number={state.number}
                        expiry={state.expiry}
                        cvc={state.cvc}
                        name={state.name}
                        focused={state.focus}
                      />
                    </MDBCol>
                  </MDBRow>

                  <MDBRow className="gridRow">
                    <MDBCol>
                      <MDBInput
                        label="Card Number"
                        type="text"
                        name="number"
                        value={reorderCreditCardNumber(state.number)}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        required
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="gridRow">
                    <MDBCol>
                      <MDBInput
                        label="Card Holder"
                        type="text"
                        name="name"
                        value={state.name}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        required
                      />
                    </MDBCol>
                  </MDBRow>
                  <MDBRow className="gridRow">
                    <MDBCol size="md">
                      <MDBInput
                        label="Expiry Date"
                        type="text"
                        name="expiry"
                        value={reorderExpiryDate(state.expiry)}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        required
                      />
                    </MDBCol>

                    <MDBCol size="md">
                      <MDBInput
                        label="CVC"
                        type="number"
                        name="cvc"
                        value={state.cvc}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        required
                      />
                    </MDBCol>
                  </MDBRow>
                </MDBCard>
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn color="secondary" type="button" onClick={toggleOpen}>
                  Close
                </MDBBtn>
                <Stack direction="row" spacing={2}>
                  <Button
                    style={{ backgroundColor: "green" }}
                    type="submit"
                    variant="contained"
                    endIcon={<PiContactlessPayment />}
                  >
                    Pay
                  </Button>
                </Stack>
              </MDBModalFooter>
            </MDBModalContent>
          </form>
        </MDBModalDialog>
      </MDBModal>
      <ToastContainer />
    </>
  );
}
