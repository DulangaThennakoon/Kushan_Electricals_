// AccountSetings.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Modal, Button, Toast } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import SideNavbar from "../Components/SideNavbar";
import { validateIntegers } from "../functionality/validation";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import FilledInput from "@mui/material/FilledInput";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import { MdVisibility } from "react-icons/md";
import { MdVisibilityOff } from "react-icons/md";
import {
  getEmail,
  ChangeEmail,
  verifyPassword,
  changePassword,
} from "../Services/AccountServices";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { validateEmail, validatePassword } from "../functionality/validation";
import Swal from "sweetalert2";
import "./AccountSettings.css";

function AccountSetings() {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isNotExchanging, setIsNotExchanging] = useState(false);
  const [showMailChange, setShowMailChange] = useState(false);
  const [currentMail, setCurrentMail] = useState("");
  const [newMail, setNewMail] = useState("");
  const [verified, setVerified] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchEmail = async () => {
      try {
        const email = await getEmail();
        if (email) {
          console.log(email);
          setCurrentMail(email); // Only setting the email string to the state
        } else {
          console.log("email is undefined");
        }
      } catch (err) {
        console.error("Failed to fetch email:", err);
      }
    };

    fetchEmail();
  }, []);

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleEmailChange = () => {
    if (newMail === "") {
      toast.error("Please enter a valid email address", {
        position: "top-right",
        autoClose: 3500,
      });
      return;
    } else if (!validateEmail(newMail)) {
      toast.error("Please enter a valid email address", {
        position: "top-right",
        autoClose: 3500,
      });
      return;
    } else if (newMail === currentMail) {
      toast.error("Please enter a different email address", {
        position: "top-right",
        autoClose: 3500,
      });
      return;
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "Your logging email will be changed!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#050505",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, change it!",
      }).then((result) => {
        if (result.isConfirmed) {
          ChangeEmail(newMail)
            .then((res) => {
              if (res.status === 200) {
                toast.success("Email Updated", {
                  position: "top-right",
                  autoClose: 3500,
                });
                setCurrentMail(newMail);
                setNewMail("");
                setShowMailChange(false);
              } else {
                toast.error(res.message, {
                  position: "top-right",
                  autoClose: 3500,
                });
              }
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          setNewMail("");
          setShowMailChange(false);
        }
      });
    }
  };
  const verifyCurrentPassword = () => {
    if (currentPassword === "") {
      toast.error("Please enter your password", {
        position: "top-right",
        autoClose: 3500,
      });
      return;
    } else {
      verifyPassword(currentPassword)
        .then((res) => {
          if (res.status === 200) {
            toast.success("Password Verified", {
              position: "top-right",
              autoClose: 3500,
            });
            setVerified(true);
            setCurrentPassword("");
          } else {
            toast.error(res.message, {
              position: "top-right",
              autoClose: 3500,
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const changeOwnerPassword = () => {
    if (newPassword === "" || confirmPassword === "") {
      toast.error("Please enter your new password", {
        position: "top-right",
        autoClose: 3500,
      });
      return;
    } else if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 3500,
      });
      return;
    } else if (!validatePassword(newPassword)) {
      toast.error(
        "Password must contain at least 7 characters, including 1 letter, 1 number and 1 Symbol",
        {
          position: "top-right",
          autoClose: 3500,
        }
      );
      return;
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "Your logging password will be changed!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#050505",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, change it!",
      }).then((result) => {
        if (result.isConfirmed) {
          changePassword(newPassword)
            .then((res) => {
              if (res.status === 200) {
                toast.success("Password Changed Successfully!", {
                  position: "top-right",
                  autoClose: 3500,
                });
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
                setVerified(false);
              } else {
                toast.error(res.message, {
                  position: "top-right",
                  autoClose: 3500,
                });
              }
            })
            .catch((err) => {
              console.error(err);
            });
        }
      });
    }
  };

  return (
    <>
      <SideNavbar selected="AccountSettings" />
      <div
        style={{
          height: "100vh",
        }}
      >
        <div
          style={{
            marginLeft: "7%",
            width: "50%",
            marginTop: "1rem",
          }}
        >
          <h1>Account Settings</h1>
        </div>
        <div
          style={{
            height: "80vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card
            style={{
              width: "55%",
              Index: "888"
            }}
          >
            <Card.Body className="d-flex justify-content-center align-items-center">
              <div style={{ width: "85%" }}>
                <Card.Title>
                  <h4>Change Credentials</h4>
                </Card.Title>
                <div
                  style={{ display: "flex", justifyContent: "center" }}
                ></div>
                <Form style={{}}>
                  <Form.Group className="mb-3">
                    <div className="currentMail">
                      {" "}
                      Current E-mail : &nbsp;&nbsp;
                      <h5>{currentMail}</h5>&nbsp;
                      {!showMailChange ? (
                        <Button
                          style={{ width: "6rem", marginLeft: "0.75rem" }}
                          variant="outline-dark"
                          type="button"
                          onClick={() => setShowMailChange(true)}
                        >
                          Change
                        </Button>
                      ) : (
                        <Button
                          style={{ width: "6rem", marginLeft: "0.75rem" }}
                          variant="dark"
                          type="button"
                          onClick={() => setShowMailChange(false)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                    <div
                      className="ChageMail"
                      style={{ display: !showMailChange ? "none" : "" }}
                    >
                      <Box
                        component="form"
                        sx={{
                          "& > :not(style)": { m: 1, width: "100%" },
                        }}
                        noValidate
                        autoComplete="off"
                      >
                        <TextField
                          id="filled-basic"
                          label="New E-mail"
                          variant="filled"
                          value={newMail}
                          onChange={(e) => setNewMail(e.target.value)}
                        />
                      </Box>
                      <div style={{ display: "flex", justifyContent: "right" }}>
                        <Button
                          style={{ width: "6rem", marginLeft: "0.75rem" }}
                          variant="dark"
                          type="button"
                          onClick={handleEmailChange}
                        >
                          Set
                        </Button>
                      </div>
                    </div>
                  </Form.Group>
                </Form>
                <Form style={{}}>
                  <Form.Group className="mb-3">
                    <div className="currentPassword">
                      {" "}
                      <h5>Change Password</h5>
                      <div style={{ display: verified ? "none" : "" }}>
                        <p>Please verify your current password to change it.</p>
                        <FormControl
                          sx={{ m: 1, width: "60%" }}
                          variant="filled"
                        >
                          <InputLabel htmlFor="filled-adornment-password">
                            Password
                          </InputLabel>
                          <FilledInput
                            id="filled-adornment-password"
                            type={showPassword ? "text" : "password"}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <MdVisibilityOff />
                                  ) : (
                                    <MdVisibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            }
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                        </FormControl>
                        <div className="verifyBTN">
                          <Button
                            style={{ width: "6rem", marginLeft: "0.75rem" }}
                            variant="outline-dark"
                            type="button"
                            onClick={verifyCurrentPassword}
                          >
                            Verify Me
                          </Button>
                        </div>
                      </div>
                      {/* -----------------------------------------------------------------------     */}
                      <div
                        className="changePassword"
                        style={{ display: !verified ? "none" : "" }}
                      >
                        <FormControl
                          sx={{ m: 1, width: "60%" }}
                          variant="filled"
                        >
                          <InputLabel htmlFor="filled-adornment-password">
                            New Password
                          </InputLabel>
                          <FilledInput
                            id="filled-adornment-password"
                            type={showPassword ? "text" : "password"}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <MdVisibilityOff />
                                  ) : (
                                    <MdVisibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            }
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </FormControl>
                        <FormControl
                          sx={{ m: 1, width: "60%" }}
                          variant="filled"
                        >
                          <InputLabel htmlFor="filled-adornment-password">
                            Confirm Password
                          </InputLabel>
                          <FilledInput
                            id="filled-adornment-password"
                            type={showPassword ? "text" : "password"}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton
                                  aria-label="toggle password visibility"
                                  onClick={handleClickShowPassword}
                                  onMouseDown={handleMouseDownPassword}
                                  edge="end"
                                >
                                  {showPassword ? (
                                    <MdVisibilityOff />
                                  ) : (
                                    <MdVisibility />
                                  )}
                                </IconButton>
                              </InputAdornment>
                            }
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                          />
                        </FormControl>
                        <div className="changePwdBtn">
                          <Button
                            style={{ width: "6rem", marginLeft: "0.75rem" }}
                            variant="dark"
                            type="button"
                            onClick={changeOwnerPassword}
                          >
                            Change
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Form.Group>
                </Form>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Rest of your component */}
      <Modal show={showConfirmation} onHide={handleCloseConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to proceed?
          <br />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmation}>
            Close
          </Button>
          <Button variant="primary">Confirm</Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
}

export default AccountSetings;
