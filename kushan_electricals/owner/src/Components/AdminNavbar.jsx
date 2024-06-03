import React from 'react';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import './adminNavbar.css';

import 'primeicons/primeicons.css';

function AdminNavbar() {
  return (
    <Navbar expand="lg" className="custom-navbar" id='navbar' style={{ height:'3.5rem',zIndex:'999'}}>
      <img src={require('../assets/logo.png')} alt="Logo" style={{ width: '6rem', height: 'auto', marginLeft:'20px'}} />
      <Container>
        <Navbar.Brand href="#home"> </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
        </Navbar.Collapse>
      </Container>
      <span className="pi pi-user" style={{ color: 'white' ,fontSize: '1.5rem'}}></span>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <div className='user'>
        <div className='businessAccount'><b>Business</b></div>
        <div className='businessAccount'>Account</div>
      </div>
    </Navbar>
  );
}

export default AdminNavbar;
