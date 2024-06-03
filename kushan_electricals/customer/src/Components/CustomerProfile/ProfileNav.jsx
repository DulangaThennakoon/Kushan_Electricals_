import React,{useEffect, useState} from 'react';
import { MDBDropdown, MDBDropdownMenu, MDBDropdownToggle, MDBDropdownItem } from 'mdb-react-ui-kit';
import { Link } from 'react-router-dom';
import CustomerProfile from './CustomerProfile';
import OrderHistory from './OrderHistory';
import ChangePassword from './ChangePassword';
import { getCustomerDetails } from '../Services/userServices';
import { IoMenu } from "react-icons/io5";

export default function ProfileNav() {
  const [display, setDisplay] = useState("CustomerProfile");
  const [customerName, setCustomerName] = useState("User");
  const [customerEmail, setCustomerEmail] = useState("Emil not found");

  useEffect(() => {
    fetchCustomerDetails();
  }, []);

  function fetchCustomerDetails() {
    
    getCustomerDetails()
      .then((response) => {
        console.log(response.data);
        setCustomerName(response.data.firstName + " " + response.data.lastName);
        setCustomerEmail(response.data.email);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
    <MDBDropdown style={{position:'fixed',padding:'2rem'}}>
      <MDBDropdownToggle tag='a' className='btn btn-dark'>
        <IoMenu style={{fontSize:'24'}}/>
      </MDBDropdownToggle>
      <MDBDropdownMenu>
        <MDBDropdownItem link onClick={()=>setDisplay("CustomerProfile")}>Delivery Info</MDBDropdownItem>
        <MDBDropdownItem link onClick={()=>setDisplay("OrderHistory")}>Order History</MDBDropdownItem>
        <MDBDropdownItem link onClick={()=>setDisplay("ChangePassword")}>Change Password</MDBDropdownItem>
      </MDBDropdownMenu>
    </MDBDropdown>
    {display === "CustomerProfile" && <CustomerProfile customerName={customerName} customerEmail={customerEmail} />}
    {display === "OrderHistory" && <OrderHistory customerName={customerName} customerEmail={customerEmail}/>}
    {display === "ChangePassword" && <ChangePassword customerName={customerName} customerEmail={customerEmail}/>}
    
    </>
  );
}