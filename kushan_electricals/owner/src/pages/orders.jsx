import React, { useState, useRef, useEffect } from "react";
import ListGroup from "react-bootstrap/ListGroup";
import SideNavbar from "../Components/SideNavbar";
import { Modal, Button } from "react-bootstrap";
import TitleBar from "../Components/TitleBar";
import axios from "axios";
import Card from "react-bootstrap/Card";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./orders.css";
import zIndex from "@mui/material/styles/zIndex";

function Orders() {
  const [items, setItems] = useState([]);
  const listRef = useRef(null);
  const [listHeight, setListHeight] = useState(0);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    const accessToken = localStorage.getItem("accessToken");
    axios
      .get("http://localhost:5000/api/owner/ECOM_services/getOrders", {
        headers: { "x-access-token": accessToken },
      })
      .then((response) => {
        setItems(response.data.data);
        setSelectedOrder(response.data.data[0]);
        console.log(response.data.data[0]);
      })
      .catch((error) => {
        toast.error(error.response.data.message, {
          position: "top-right",
          autoClose: 3500,
        });

        console.log(error);
      });
  }

  useEffect(() => {
    setListHeight(listRef.current.offsetHeight);
  }, []);

  useEffect(() => {
    if (items.length > 0) {
      setSelectedOrder(items[0]);
    }
  }, [items]);

  const handleProceed = () => {
    setShowConfirmation(true);
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  const handleDelivery = () => {
    axios
      .post(
        "http://localhost:5000/api/owner/ECOM_services/updateDeliveryStatus",
        { cartID: selectedOrder.cartID },
        {
          headers: {
            "x-access-token": localStorage.getItem("accessToken"),
          },
        }
      )
      .then((response) => {
        toast.success("Order marked as delivered");
        fetchOrders();
      })
      .catch((error) => {
        toast.error("Error marking order as delivered");
        console.log(error);
      });
    setShowConfirmation(false);
  };

  const handleItemClick = (order) => {
    setSelectedOrder(order);
  };

  return (
    <>
      <div
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        <div
          style={{
            marginLeft: "7%",
            width: "50%",
            marginTop: "1rem",
            flex: "1",
          }}
        >
          <h1>Orders</h1>

          <ListGroup as="ol" style={{ overflow: "hidden" }}>
            <ListGroup.Item
              as="li"
              style={{ display: "flex", justifyContent: "space-between" }}
              
              
            >
              <div className="listGroupHeader">
                <b>Order Number</b>
              </div>
              <div className="listGroupHeader" style={{ textAlign: "center" }}>
                <b>Date</b>
              </div>
              <div className="listGroupHeader">
                <b>Amount</b>
              </div>
            </ListGroup.Item>
          </ListGroup>
          <div style={{ maxHeight: "calc(100vh - 150px)", overflowY: "auto" }}>
            <ListGroup as="ol" ref={listRef}>
              {items.map((order) => (
                <ListGroup.Item
                  as="li"
                  key={order.cartID}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    cursor: "pointer",
                  }}
                  id="listItem"
                  onClick={() => handleItemClick(order)}
                >
                  <div className="listGroupItem">{order.cartID}</div>
                  <div
                    className="listGroupItem"
                    style={{ textAlign: "center" }}
                  >
                    {order.dateTime}
                  </div>
                  <div className="listGroupItem">Rs.{order.total}.00</div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>
      </div>

      <SideNavbar selected="Orders"/>

      <div style={{ position: "relative", height: "100vh" }}>
        <Card
          className="mt-6 w-96"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "snow",
            maxWidth: "32%",
            marginLeft: "auto",
            overflowY: "auto",
            zIndex: 100,
            paddingTop: "2.5rem",
          }}
        >
          <Card.Body>
            <h3>Order number: {selectedOrder?.cartID}</h3>
            <br />
            <p>
              <b>Customer name:</b> {selectedOrder?.receiverName}
            </p>
            <p>
              <b>Address:</b> {selectedOrder?.deliveryAddress}
            </p>
            <p>
              <b>Mobile:</b> {selectedOrder?.receiverTelephone}
            </p>
            <p>
              <b>Total: Rs.</b> {selectedOrder?.total}
            </p>
            <p>
              <b>Date:</b> {selectedOrder?.dateTime}
            </p>
            <p>
              <b>Items:</b>
            </p>
            <ul>
              {selectedOrder &&
                selectedOrder.items.map((item) => (
                  <li key={item.cart_itemID}>
                    <span>
                      <b>{item.quantity}</b>&nbsp; x{" "}
                    </span>
                    <span>{item.productName}</span>
                  </li>
                ))}
            </ul>
            <Button
              variant="dark"
              style={{ width: "50%", marginLeft: "auto" }}
              onClick={handleProceed}
            >
              Delivered
            </Button>
          </Card.Body>
        </Card>
      </div>

      <Modal show={showConfirmation} onHide={handleCloseConfirmation}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delivery</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you shipping the order?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseConfirmation}>
            Close
          </Button>
          <Button variant="primary" onClick={handleDelivery}>
            Yes !
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
}

export default Orders;
