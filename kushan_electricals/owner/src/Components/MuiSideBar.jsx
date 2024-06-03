import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Columns from "react-columns";
import Card from "react-bootstrap/Card";
import axios from 'axios'
import './cashier.css'
import Sidebar from "../../../components/Sidebar";

// var data = require("./db.json");

function BarcodeScanner() {
  const [results, setResults] = useState([]);
  const [searchBarcode, setSearchBarcode] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cart, setCart] = useState([]);

  // const [data,setProduct] = useState([])

  useEffect(()=>{
    const fetchAllProducts = async()=>{
        try{
            const res =await axios.get('http://localhost:5000/cashierDash');
            console.log(res.data);
            // console.log(data);
            setResults(res.data);
            // console.log(data[0])
        }
        catch(err){
          console.log(err)
        }
    }
    fetchAllProducts()
  },[]);

  // var data = products;
  // console.log(products)

  // useEffect(() => {
  //   setResults(data);
  // }, []);

  useEffect(() => {
    if (searchBarcode !== "") {
      const product = results.find((item) => item.barcode === searchBarcode);
      setSelectedProduct(product);
    } else {
      setSelectedProduct(null); // Clear selection if search is empty
    }
  }, [searchBarcode, results]);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && selectedProduct) {
      event.preventDefault();
      const quantity = prompt("Enter quantity for " + selectedProduct.name + ":", "1");
      
      if (quantity && !isNaN(quantity) && Number(quantity) > 0) {
        const productWithQuantity = { 
          ...selectedProduct, 
          quantity: Number(quantity),
          totalPrice: selectedProduct.price * Number(quantity) // Calculate total price
        };
        
        const existingProductIndex = cart.findIndex(item => item.barcode === selectedProduct.barcode);
        
        if (existingProductIndex !== -1) {
          const updatedCart = cart.map((item, index) => {
            if (index === existingProductIndex) {
              const updatedQuantity = item.quantity + Number(quantity);
              return { 
                ...item, 
                quantity: updatedQuantity,
                totalPrice: item.price * updatedQuantity // Update total price
              };
            }
            return item;
          });
          setCart(updatedCart);
        } else {
          setCart(currentCart => [...currentCart, productWithQuantity]);
        }
        
        setSearchBarcode(""); // Clear search input after adding
      } else {
        alert("Please enter a valid quantity.");
      }
    }
  };
  

  const searchResults = results.filter((item) => {
    return searchBarcode !== "" ? item.barcode.includes(searchBarcode) : item;
  }).map((data, index) => (
    <Card
      key={index}
      bg="light"
      text="dark"
      className="text-center"
      style={{ margin: "10px", width: "18rem" }}
    >
      {/* <Card.Img variant="top" src={data.img} /> */}
      <Card.Body>
        <Card.Text>Product name: {data.name}</Card.Text>
        <Card.Text>Price: Rs {data.price}</Card.Text>
        <Card.Text>Barcode: {data.barcode}</Card.Text>
      </Card.Body>
    </Card>
  ));

  return (
    <>
    <div style={{ display: 'flex' }}>
      <div style={{ display: 'flex' }}>
      {/* <Sidebar /> */}
    <div style={{ width: '80%' }}>
      <Form>
        <Form.Group controlId="formGroupSearch">
          <Form.Control
            autoFocus
            type="text"
            placeholder="Search barcode"
            value={searchBarcode}
            onChange={(e) => setSearchBarcode(e.target.value)}
            onKeyDown={handleKeyDown}
            />
        </Form.Group>
      </Form>
      <br />
      {/* Search Results Table */}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Barcode</th>
          </tr>
        </thead>
        <tbody>
          {results.filter(item => searchBarcode !== "" ? item.barcode.includes(searchBarcode) : item)
                   .map((data, index) => (
                     <tr key={index}>
              {/* <td><img src={data.img} alt="product" style={{ width: "50px" }}/></td> */}
              <td>{data.name}</td>
              <td>Rs {data.price}</td>
              <td>{data.barcode}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
    <div style={{ width: "20%" }}>
      {/* Cart Table remains unchanged */}
      ...
    </div>
  </div>
      <div style={{ width: "20%" }}>
  <Table striped bordered hover>
    <thead>
      <tr>
        <th>Name</th>
        <th>Quantity</th>
        <th>Price</th>
        <th>Total Price</th>
      </tr>
    </thead>
    <tbody>
      {cart.map((product, index) => (
        <tr key={index}>
          <td>{product.name}</td>
          <td>{product.quantity}</td>
          <td>Rs {product.price}</td>
          <td>Rs {product.totalPrice.toFixed(2)}</td>
        </tr>
      ))}
      <tr>
        <td colSpan="3">Total</td>
        <td>Rs {
          cart.reduce((acc, current) => acc + (current.totalPrice || 0), 0).toFixed(2)
        }</td>
      </tr>
    </tbody>
  </Table>
  {cart.length === 0 && <div>No products added to the cart</div>}
</div>

    </div>
  </>
  );
}

export default BarcodeScanner;