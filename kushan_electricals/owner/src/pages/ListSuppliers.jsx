import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
} from 'mdb-react-ui-kit';
import SideNavbar from "../Components/SideNavbar";
import InventoryNavBar from "../Components/InventoryNavBar";
import { Link } from 'react-router-dom';

function ListSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState('');

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/owner/supplierServices/getSuppliers") // Assuming this endpoint fetches suppliers
      .then((res) => {
        setSuppliers(res.data);
        setSelectedSupplier(res.data[0]);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleSupplierChange = (event) => {
    const selectedSupplierID = parseInt(event.target.value); 
    const foundSupplier = suppliers.find(supplier => supplier.supplierID === selectedSupplierID);
    setSelectedSupplier(foundSupplier);
    console.log(foundSupplier);
  };
  
  


  return (
    <div>
      <InventoryNavBar selected="listsuppliers"/>
      <SideNavbar selected="Inventory" />
      <Form >
        <MDBContainer fluid className="bg-white" style={{ height: "100vh" }}>
          <MDBRow className="d-flex justify-content-center align-items-center h-100">
            <MDBCol style={{paddingRight:'1rem'}}>
              <MDBCard className="my-4" style={{display:'flex', width: "91%",marginLeft: "auto",marginRight: "auto",zIndex:'888'}}>
                <MDBRow className="g-0">
                  <MDBCol md="6">
                    <MDBCardBody className="text-black d-flex flex-column justify-content-centertext-black d-flex flex-column justify-content-center align-items-center">
                      <MDBCol md="6" >
                        
                        <Form.Label htmlFor="disabledSelect">
                          <h5>Select Supplier</h5>
                        </Form.Label>
                        <Form.Select
                          id="categorySelect"
                          onChange={handleSupplierChange}
                          value={selectedSupplier ? selectedSupplier.supplierID : ''}
                        >
                          {suppliers.map((supplier) => (
                              <option
                                key={supplier.supplierID}
                                value={supplier.supplierID}
                              >
                                {supplier.name}
                              </option>
                            ))}
                        </Form.Select>
                      </MDBCol>
                    </MDBCardBody>
                  </MDBCol>

                  <MDBCol md="6">
                    <MDBCardBody className="text-black d-flex flex-column justify-content-center">
                      <h3 className="mb-5 text-uppercase fw-bold">
                        Supplier Info
                      </h3>

                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          <Form.Label>Supplier Name</Form.Label>
                          <Form.Control
                            id="supplierName"
                            type="text"
                            placeholder="Supplier name....."
                            disabled
                            value={selectedSupplier ? selectedSupplier.name : "Data not available"}	
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>

                        <MDBCol md="6">
                          <Form.Label>E-mail</Form.Label>
                          <Form.Control
                            id="supplierEmail"
                            type="text"
                            disabled
                            value={selectedSupplier ? selectedSupplier.email : "Data not available"}
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>
                      </MDBRow>
                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          <Form.Label>Phone 1</Form.Label>
                          <Form.Control
                            id="phone1"
                            type="text"
                            disabled 
                            value={selectedSupplier ? selectedSupplier.phone1 : "Data not available"}
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>

                        <MDBCol md="6">
                          <Form.Label>Phone 2</Form.Label>
                          <Form.Control
                            id="phone2"
                            type="text"
                            disabled
                            value={selectedSupplier ? selectedSupplier.phone2 : "Data not available"}
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>
                      </MDBRow>

                      <Form.Label>Additional details</Form.Label>
                      <Form.Control
                        id="supplierDetails"
                        type="text"
                        value={selectedSupplier ? selectedSupplier.details : "Data not available"}
                        as={"textarea"}
                        disabled
                        style={{ height: "100px" }}
                      />
                      <Form.Text className="text-muted"></Form.Text>

                      <div className="d-flex justify-content-end pt-3">
                       
                        &nbsp;
                        <Link to="/addSupplier">
                        <Button
                          as="input"
                          variant="dark"
                          type="zbutton"
                          value="Add supplier"
                        />
                        </Link>
                      </div>
                    </MDBCardBody>
                  </MDBCol>
                </MDBRow>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </Form>
    </div>
  );
}

export default ListSuppliers;
