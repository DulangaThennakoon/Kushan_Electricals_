import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import Nav from 'react-bootstrap/Nav';
import React from "react";

function TitleBar() {
  return (
    <div>
      <Navbar bg="black" data-bs-theme="dark" style={{height:'3.5rem',display:'flex',alignItems:'center',zIndex:'900'}}>
        <Container>
        <img src={require('../assets/logo.png')} alt="Logo" style={{ width: '9rem', height: 'auto', marginLeft:'-50px',zIndex:700,marginTop:'-1.75rem'}} />
        </Container>
        <div className="text" style={{display:'flex',alignItems:'baseline',color:"white",marginRight:'4rem',marginTop:'1rem'}}>
          <h4>Business </h4> <p>&nbsp;account</p>
        </div>
      </Navbar>
    </div>
  );
}

export default TitleBar;
