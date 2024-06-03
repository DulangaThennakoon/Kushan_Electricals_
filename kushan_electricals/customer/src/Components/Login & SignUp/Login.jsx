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
import { ToastContainer, toast } from "react-toastify";
import { Link,useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { loginUser } from "../Services/userServices";
import { Navigate } from "react-router-dom";
import "./Login.css";

function Login({ setIsAuthenticated }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (event) => {
    event.preventDefault();
    loginUser({ email, password })
      .then((status) => {
        if (status === 200) {
          console.log();
          toast.success("Login successful!", {
            position: "top-right",
            autoClose: 3500,
          });
          setIsAuthenticated(true);
          navigate("/");
          //window.location.href = "/";

        } else {
          toast.error("Invalid credentials!", {
            position: "top-right",
            autoClose: 3500,
          });
        }
      })
      .catch((error) => {
        if(error.response.status === 401){
          toast.error("Invalid credentials!", {
            position: "top-right",
            autoClose: 3500,
          });}
        console.log(error);
      });
  };

  return (
    <MDBContainer fluid className="p-3 my-5" id="loginPage">
      <MDBRow>
        <MDBCol col="10" md="6">
          <img
            src="https://firebasestorage.googleapis.com/v0/b/kushan-electricals.appspot.com/o/login.png?alt=media&token=1fefb060-2cc8-4f37-840a-a04541901a45"
            class="img-fluid"
            alt="Phone image"
          />
        </MDBCol>

        <MDBCol col="4" md="6" className="loginColumn">
          <div className="loginFormDiv">
            <div id="loginHeader">
              <h1>Log in</h1>
            </div>
            <form className="loginForm" onSubmit={handleLogin}>

              <MDBInput
                wrapperClass="mb-4"
                label="Email address"
                id="formControlLg"
                type="email"
                size="lg"
                onChange={(e) => setEmail(e.target.value)}
              />
              <MDBInput
                wrapperClass="mb-4"
                label="Password"
                id="formControlLg"
                type="password"
                size="lg"
                onChange={(e) => setPassword(e.target.value)}
              />

              <div className="d-flex justify-content-between mx-4 mb-4">
                <a href="!#">Forgot password?</a>
              </div>

              <MDBBtn
                type="submit"
                rounded
                className="mb-4 w-100"
                size="lg"
                id="signInBtn"
              >
                Sign in
              </MDBBtn>
              <div className="d-flex justify-content-between mx-4 mb-4">
                <div></div>
                <div>
                  Don't have an account?&nbsp;<Link to="/signup"> Sign up</Link>
                </div>
              </div>
            </form>
          </div>
        </MDBCol>
      </MDBRow>
      <ToastContainer />
    </MDBContainer>
  );
}

export default Login;
