import React, { useState } from "react";
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBListGroup,
  MDBListGroupItem,
} from "mdb-react-ui-kit";

export default function PastOrderModel({order, show = false}) {
    const [scrollableModal, setScrollableModal] = useState(show);
  console.log(order);
  const items = [
    {
      id: 1,
      name: "Product 1",
      price: 1000.0,
      quantity: 2,
      total: 2000.0,
    },
    {
      id: 2,
      name: "Product 2",
      price: 1500.0,
      quantity: 1,
      total: 1500.0,
    },
    {
      id: 3,
      name: "Produrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtrtkkkkkkkkct 3",
      price: 2500.0,
      quantity: 1,
      total: 2500.0,
    },
    {
      id: 4,
      name: "Product 4",
      price: 500.0,
      quantity: 3,
      total: 1500.0,
    },
  ];

  return (
    <>
      <MDBBtn color='dark' onClick={() => setScrollableModal(!scrollableModal)}>
        View
      </MDBBtn>

      <MDBModal
        open={scrollableModal}
        onClose={() => setScrollableModal(false)}
        tabIndex="-1"
      >
        <MDBModalDialog scrollable>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Order</MDBModalTitle>
              <MDBBtn
                className="btn-close"
                color="none"
                onClick={() => setScrollableModal(false)}
              ></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <p>Date: {order.dateTime}</p>
              <p>Order ID: {order.cartID}</p>
              <p>Order Status: {order.deliveryStatus===0?"Processing":"Delivered"}</p>
              <p>Receiver: {order.receiverName}</p>
              <p>Receiver Phone: {order.receiverTelephone}</p>
              <p>Reveiver Address: {order.deliveryAddress}</p>
              <p>Total: Rs. {order.totalAmount}.00</p>
              <p>Items:</p>
              <div>
                <MDBListGroup light numbered style={{ minWidth: "22rem" }}>
                  {order.items.map((item) => (
                    // <MDBListGroupItem key={item.id}>
                    //     {item.name} - Rs. {item.price} x {item.quantity} = Rs. {item.total}
                    // </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex justify-content-between align-items-start" key={item.cart_itemID}>
                      <div className="ms-2 me-auto">
                        <div className="fw-bold" style={{overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis"}}>{item.productName}</div>Rs. {item.unitPrice} x {item.quantity} = Rs. {item.totalAmount}
                      </div>
                    </MDBListGroupItem>
                  ))}
                </MDBListGroup>
              </div>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn
                color="dark"
                onClick={() => setScrollableModal(!setScrollableModal)}
              >
                Close
              </MDBBtn>
              
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
}
