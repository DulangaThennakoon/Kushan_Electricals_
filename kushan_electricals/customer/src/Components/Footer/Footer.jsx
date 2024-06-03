import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import React from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import Logo from '../Assets/logo.png';
import { FaFacebookSquare,FaTiktok,FaInstagram,FaWhatsapp,FaPhone } from "react-icons/fa";
import { FaSquareXTwitter,FaMapLocationDot } from "react-icons/fa6";
import { MdMail } from "react-icons/md";
import './Footer.css';


export default function Footer() {
  return (
    <MDBFooter bgColor='light' className='text-center text-lg-start text-muted'>

      <div className='text-center p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        <a className='text-reset fw-bold' href='Homepage.jsx'>
          Kushan Electricals
        </a>
      </div>
    </MDBFooter>
  );
}