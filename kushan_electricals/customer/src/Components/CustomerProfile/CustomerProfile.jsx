import React, { useState,useEffect } from "react";
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBIcon,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";
import { FaCircleUser } from "react-icons/fa6";
import TextField from "@mui/material/TextField";
import {changeCustomerDetails,getCustomerDetails} from "../Services/userServices";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import './CustomerProfile.css';

function CustomerProfile({customerName="User", customerEmail=""}) {
  const [enableEdit, setEnableEdit] = useState(false);
  const [customerDetails, setCustomerDetails] = useState({});
  const [newDetails, setNewDetails] = useState({
    firstName: "",
    lastName: "",
    telephone: "",
    address: "",
  });

  const handleEdit = () => {
    setEnableEdit(!enableEdit);
  };

  useEffect(() => {
    fetchCustomerDetails();
  }, []);

  function fetchCustomerDetails() {
    getCustomerDetails()
      .then((response) => {
        setCustomerDetails(response.data);
        setNewDetails({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          telephone: response.data.telephone,
          address: response.data.address
        });
      })
      .catch((error) => {
        
        console.log(error);
      });
  }

  function handleCustomerInfoChange() {
    changeCustomerDetails(newDetails)
      .then((response) => {
        fetchCustomerDetails();
        setEnableEdit(false);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <MDBContainer fluid className="p-3 my-5">
      <MDBRow>
        <MDBCol col="10" md="6">
          <h1 className="text-center">Customer Profile</h1>
          <div>
            <div className="d-flex justify-content-center">
              <FaCircleUser size="8em" />
            </div>
            <br />
            <div className="d-flex justify-content-center">
              <h4>{customerName}</h4>
            </div>
            <div className="d-flex justify-content-center">
              {customerEmail}
            </div>
          </div>
        </MDBCol>

        <MDBCol col="4" md="6">
          <div>
            <div>
              <h1>You Info</h1>
            </div>
            <form>
              
                <div className="receiverDatailNBtn">
                  <h5>Receiver Details</h5>
                  {!enableEdit ? (
                    <MDBBtn type="button"  onClick={handleEdit}>Edit</MDBBtn>
                  ) : (
                    <div>
                      <MDBBtn type="button" onClick={handleCustomerInfoChange}>Save</MDBBtn>&nbsp;&nbsp;
                      <MDBBtn type="button" onClick={handleEdit}>Cancel</MDBBtn>
                    </div>
                  )}
                </div>
                <div className="detailItem">
                  <TextField
                    label="First Name"
                    variant="standard"
                    color="success"
                    className="detailField"
                    value={newDetails.firstName}
                    focused
                    onChange={(e) => setNewDetails({...newDetails,firstName:e.target.value})}
                    disabled={!enableEdit}
                  />
                </div>
                <div className="detailItem">
                  <TextField
                    label="Last Name"
                    variant="standard"
                    color="success"
                    className="detailField"
                    value={newDetails.lastName}
                    onChange={(e) => setNewDetails({...newDetails,lastName:e.target.value})}
                    focused
                    disabled={!enableEdit}
                  />
                </div>
                <div className="detailItem">
                  <TextField
                    label="Phone"
                    variant="standard"
                    color="success"
                    value={newDetails.telephone}
                    onChange={(e) => setNewDetails({...newDetails,telephone:e.target.value})}
                    focused
                    className="detailField"
                    disabled={!enableEdit}
                  />
                </div>
                <div className="detailItem">
                  <TextField
                    label="Receiver Address"
                    variant="standard"
                    color="success"
                    className="detailField"
                    value={newDetails.address}
                    onChange={(e) => setNewDetails({...newDetails,address:e.target.value})}
                    focused
                    disabled={!enableEdit}
                  />
                </div>
            </form>
          </div>
        </MDBCol>
      </MDBRow>
      <ToastContainer/>
    </MDBContainer>
  );
}

export default CustomerProfile;
