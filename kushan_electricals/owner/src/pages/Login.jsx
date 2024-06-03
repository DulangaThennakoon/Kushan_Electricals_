import Button from "react-bootstrap/Button";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Form from "react-bootstrap/Form";
// import bcrypt from 'bcryptjs';
import { useRef } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Link } from "react-router-dom";
import { IoEye, IoEyeOff } from "react-icons/io5";
import "./Login.css";

function Login() {
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener("popstate", function (event) {
      window.history.pushState(null, document.title, window.location.href);
    });
  }, [location]);

  function handleLoginForm(event) {
    event.preventDefault(); // Prevent the default form submission behavior

    const email = emailInputRef.current.value;
    const password = passwordInputRef.current.value;

    axios
      .post("http://localhost:5000/api/owner/accountServices/login", {
        email,
        password,
      })
      .then((res) => {
        console.log(res.data);
        console.log("Login Successful!");
        if (res.status === 200) {
          localStorage.setItem("accessToken", res.data.accessToken);
          window.location.href = "/transaction";
        } else {
          toast.error(res.data.message, {
            position: "top-right",
            autoClose: 3500,
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 3500,
        });
      });
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <div
        id="form-div"
        style={{
          display: "flex",
          width: window.innerWidth < 768 ? "100%" : "50%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Form style={{ width: "50%" }} onSubmit={handleLoginForm}>
          <h1>
            Business Account
          </h1>
          <br />
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              ref={emailInputRef}
            />
            <Form.Text className="text-muted"></Form.Text>
          </Form.Group>

          <Form.Group
            className="mb-3"
            controlId="formBasicPassword"
            style={{ position: "relative" }}
          >
            <Form.Label>Password</Form.Label>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              ref={passwordInputRef}
            />
            <IoEyeOff
              className="eye-styles"
              style={{
                display: showPassword ? "none" : "block",
              }}
              onClick={() => setShowPassword(!showPassword)}
            />
            <IoEye
              className="eye-styles"
              style={{
                display: showPassword ? "block" : "none",
              }}
              onClick={() => setShowPassword(!showPassword)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="fogotPasswordLink">
            <a href="#">Fogot password</a>
          </Form.Group>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button variant="dark" type="submit" style={{ width: "100%" }}>
              Login
            </Button>
          </div>
        </Form>
      </div>
      <div
        className="col-lg-6 d-none d-lg-block"
        style={{ position: "relative", width: "50%", height: "100%" }}
      >
        <img
          src={require("../assets/storeside.png")}
          alt="owner"
          style={{ width: "100%", height: "100%" }}
        />
        <div
          className="image-overlay"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
            textAlign: "center",
          }}
        >
          WELCOME TO
          
          <h1>
            <b>KUSHAN</b>
          </h1>
          <h2>ELECTRICLAS</h2>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
