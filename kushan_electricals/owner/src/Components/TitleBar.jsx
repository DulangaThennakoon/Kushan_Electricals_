import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import React from "react";
import './TitleBar.css';

function TitleBar() {
  return (
    <div>
      <Navbar bg="#001226" data-bs-theme="dark" style={{ height:'3.5rem', display:'flex', alignItems:'center', zIndex:'900' }}>
        <Container>
          <img src={require('../assets/logo.png')} alt="Logo" style={{ width: '9rem', height: 'auto', marginLeft:'-50px', zIndex:700, marginTop:'-1.75rem' }} />
        </Container>
        <div className="text" style={{ display:'flex', alignItems:'baseline', color:"#35b4ff", marginRight:'4rem', marginTop:'1rem' }}>
          <h4>Business </h4> <p>&nbsp;account</p>
        </div>
      </Navbar>
    </div>
  );
}

export default TitleBar;
