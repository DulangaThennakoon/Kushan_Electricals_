import React, { useState } from "react";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import storeIMG from "../Assets/store.png";
import { IoMdEyeOff } from "react-icons/io";
import { IoMdEye } from "react-icons/io";
import EYEicon from "../Assets/eye.png";
import { signUpUser } from "../Services/userServices";
import Swal from 'sweetalert2';
import Confetti from "react-confetti";
import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import {
  validateName,
  validateEmail,
  validatePhoneNumber,
  validateAddress,
  validatePassword,
} from "../Validation";
import { Link } from "react-router-dom";
import "./Login.css";


function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [firstNameError, setFirstNameError] = useState(false);
  const [lastName, setLastName] = useState("");
  const [lastNameError, setLastNameError] = useState(false);
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState(false);
  const [address, setAddress] = useState("");
  const [addressError, setAddressError] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  
  const handleSignUp = async (event) => {
    event.preventDefault();
    const firstNameValidation = validateName(firstName);
    const lastNameValidation = validateName(lastName);
    const phoneNumberValidation = validatePhoneNumber(PhoneNumber);
    const addressValidation = validateAddress(address);
    const emailValidation = validateEmail(email);
    const passwordValidation = validatePassword(password);
  
    if (!firstNameValidation.isValid) {
      setFirstNameError(true);
      alert(firstNameValidation.errorMessage);
      return;
    }
    if (!lastNameValidation.isValid) {
      setLastNameError(true);
      alert(lastNameValidation.errorMessage);
      return;
    }
    if (!phoneNumberValidation.isValid) {
      setPhoneNumberError(true);
      alert(phoneNumberValidation.errorMessage);
      return;
    }
    if (!addressValidation.isValid) {
      setAddressError(true);
      alert(addressValidation.errorMessage);
      return;
    }
    if (!emailValidation.isValid) {
      setEmailError(true);
      alert(emailValidation.errorMessage);
      return;
    }
    if (!passwordValidation.isValid) {
      setPasswordError(true);
      alert(passwordValidation.errorMessage);
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError(true);
      setPasswordError(true);
      alert("Passwords do not match");
      return;
    }
  
    const userData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      address: address,
      phoneNumber: PhoneNumber,
      password: password,
    };
  
    try {
      const response = await signUpUser(userData);
      // Handle success response
      if(response === 200){
        setShowConfetti(true);
        Swal.fire({
          title: 'Success!',
          text: 'You have registered successfully!',
          icon: 'success',
          confirmButtonText: 'Ok'
        })
      }
    } catch (error) {
      // Handle error response
      console.error('Error during signup:', error.message);
      if(error.message === "Request failed with status code 409"){
        toast.error("User already exists!", {
          position: "top-left",
          autoClose: 5000,
        });
    }
  };
  
  }
 

  return (
    <MDBContainer fluid className="p-3 my-5" id="signupPage">
      <MDBRow>
        <MDBCol col="10" md="6">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/kushan-electricals.appspot.com/o/signup.png?alt=media&token=742109fc-c7cf-4558-9d14-699c7f8f5b79"
            className="img-fluid"
            alt="Phone image"
          />
        </MDBCol>

        <MDBCol col="4" md="6" className="signupColumn">
          <div className="signupFormDiv">
            <div id="signupHeader">
              <h1>Sign Up</h1>
            </div>
            <form className="signupForm" onSubmit={handleSignUp}>
              <div className="userNameDiv">
                <MDBInput
                  wrapperClass="mb-4"
                  className="firstNameInput"
                  label="First name"
                  id="formControlLg"
                  type="text"
                  size="lg"
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{
                    backgroundColor: firstNameError
                      ? "rgb(255,0,0,.15)"
                      : "none",
                  }}
                />

                <MDBInput
                  wrapperClass="mb-4"
                  label="Last name"
                  id="formControlLg"
                  type="text"
                  size="lg"
                  onChange={(e) => setLastName(e.target.value)}
                  style={{
                    backgroundColor: lastNameError
                      ? "rgb(255,0,0,.15)"
                      : "none",
                  }}
                />
              </div>
              <MDBInput
                wrapperClass="mb-4"
                label="Email address"
                id="formControlLg"
                type="email"
                size="lg"
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  backgroundColor: emailError ? "rgb(255,0,0,.15)" : "none",
                }}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Home address"
                id="formControlLg"
                type="text"
                size="lg"
                onChange={(e) => setAddress(e.target.value)}
                style={{
                  backgroundColor: addressError ? "rgb(255,0,0,.15)" : "none",
                }}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Phone number"
                id="formControlLg"
                type="text"
                size="lg"
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{
                  backgroundColor: phoneNumberError
                    ? "rgb(255,0,0,.15)"
                    : "none",
                }}
              />
              <div className="userPasswordDiv">
                <div style={{ position: "relative", width: "100%" }}>
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Password"
                    id="formControlLg"
                    type={showPassword ? "text" : "password"}
                    size="lg"
                    onChange={(e) => setPassword(e.target.value)}
                    style={{
                      backgroundColor: passwordError
                        ? "rgb(255,0,0,.15)"
                        : "none",
                    }}
                  />
                  <div
                    className="showPasswordIcon"
                    onClick={(e) => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <IoMdEye /> : <IoMdEyeOff />}
                  </div>
                </div>

                <div style={{ position: "relative", width: "100%" }}>
                  <MDBInput
                    wrapperClass="mb-4"
                    label="Confirm password"
                    id="formControlLg"
                    type={showConfirmPassword ? "text" : "password"}
                    size="lg"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <div
                    className="showPasswordIcon"
                    onClick={(e) =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                  >
                    {showConfirmPassword ? <IoMdEye /> : <IoMdEyeOff />}
                  </div>
                </div>
              </div>

              <MDBBtn
                type="submit"
                rounded
                className="mb-4 w-100"
                size="lg"
                id="signupBtn"
              >
                Create account
              </MDBBtn>
              <div className="d-flex justify-content-between mx-4 mb-4">
                <div></div>
                <div>
                  Already have an account?&nbsp;<Link to="/login"> Log in</Link>
                </div>
              </div>
            </form>
          </div>
        </MDBCol>
      </MDBRow>
      {showConfetti && <Confetti/>}
      <ToastContainer />
    </MDBContainer>
  );
}

export default SignUp;
