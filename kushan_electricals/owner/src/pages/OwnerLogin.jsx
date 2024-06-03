import React from 'react';
import img1 from '../assets/store.jpeg';
import { Container } from 'react-bootstrap';


function OwnerLogin() {
  return (
    
    <div className='Login'>
            
        <body>
        <Container className="d-flex justify-content-center align-items-center mt-3">
        <div >
        <h1 style={{ fontWeight: 'bold',fontSize:'2.8rem' }}>Login  </h1>
        </div>    
        </Container>
        <section className="vh-90">
        <div className="container py-5 h-100">
          <div className="row d-flex align-items-center justify-content-center h-100">
            <div className="col-md-8 col-lg-7 col-xl-6 mb-3" >
              <img src={img1} className="img-fluid" alt="Phone" />
            </div>
            <div className="col-md-7 col-lg-5 col-xl-5 offset-xl-1">
              <form>

                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="form1Example13">Username</label>
                  <input type="username" id="form1Example13" className="form-control form-control-lg" placeholder='Enter your Username'/>
                </div>

                <div className="form-outline mb-4">
                  <label className="form-label" htmlFor="form1Example23">Password</label>
                  <input type="password" id="form1Example23" className="form-control form-control-lg" placeholder='Enter your Password'/>
               </div>

                <div className="d-flex justify-content-around align-items-center mb-4">
                  <div className="form-check">
                    <input className="form-check-input" type="checkbox" value="" id="form1Example3" checked />
                    <label className="form-check-label" htmlFor="form1Example3"> Remember me </label>
                  </div>
                  <a href="#">Forgot password?</a>
                </div>

                <Container className="d-flex justify-content-center align-items-center mt-4 mb-3">
                <div>
                <button type="submit" className="btn btn-primary btn-lg btn-block">Log in</button>
                </div>
                </Container>

              </form>
            </div>
          </div>
        </div>
      </section>


        </body>
    </div>
  



  )
}

export default OwnerLogin