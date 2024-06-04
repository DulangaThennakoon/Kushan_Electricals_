import React, { useEffect, useState, useCallback } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import Modal from "react-bootstrap/Modal";
import "./AddProducts.css";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Spinner from "react-bootstrap/Spinner";
import SideNavbar from "../Components/SideNavbar";
import InventoryNavBar from "../Components/InventoryNavBar";
import { imgStorage } from "../config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getBarcodes } from "../Services/productServices";

import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBRadio,
} from "mdb-react-ui-kit";
import Carousel from "react-bootstrap/Carousel";
import axios from "axios";

const regex = /^(0|[1-9]\d*)$/;

function AddProduct() {
  const [image1, setImage1] = useState(null);
  const [uploadIMG1, setUploadIMG1] = useState("");
  const [image2, setImage2] = useState(null);
  const [uploadIMG2, setUploadIMG2] = useState("");
  const [image3, setImage3] = useState(null);
  const [uploadIMG3, setUploadIMG3] = useState("");
  const [index, setIndex] = useState(0);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedCategoryID, setSelectedCategoryID] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplierID, setSelectedSupplierID] = useState("");
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [img1URL, setImg1URL] = useState("");
  const [img2URL, setImg2URL] = useState("");
  const [img3URL, setImg3URL] = useState("");
  const [imgUploadError, setImgUploadError] = useState(false);
  const [dataSending, setDataSending] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [barcode, setBarcode] = useState("");
  const [scannedCode, setScannedCode] = useState("");
  const [existingBarcodes, setExistingBarcodes] = useState([]);

  //Variables to store form data
  const [productName, setProductName] = useState("");
  const [brandName, setBrandName] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [openingStock, setOpeningStock] = useState("");
  const [reorderLevel, setReorderLevel] = useState("");
  const [productDetails, setProductDetails] = useState("");

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    axios
      .get("http://localhost:5000/api/owner/productServices/getCategories", {
        headers: { "x-access-token": accessToken },
      })
      .then((res) => {
        setCategories(res.data);
        setSelectedCategoryID(res.data[0].categoryID);
        console.log(selectedCategoryID);
      })
      .catch((err) => {
        console.log(err);
        if(err.response.data.status === 402){
        toast.error(err.response.data.message, {
          position: "top-right",
          autoClose: 2000,
        });
        return;
      }else{
          toast.error("Error fetching categories", {
            position: "top-right",
            autoClose: 2000,
          });
        }
      });
  }, []);

  // useEffect(() => {
  //   axios
  //     .get("http://localhost:5000/api/owner/supplierServices/getSuppliers")
  //     .then((res) => {
  //       setSelectedSupplierID(res.data[0].supplierID);
  //       setSuppliers(res.data);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       toast.error("Error fetching suppliers", {
  //         position: "top-right",
  //         autoClose: 2000,
  //       });
  //     });
  // }, []);

  useEffect(() => {
    getBarcodes().then((res) => {
      setExistingBarcodes(res);
    });
  }, []);

  const handleCategoryChange = (event) => {
    setSelectedCategoryID(event.target.value);
    console.log(selectedCategoryID);
  };

  const handleSupplierChange = (event) => {
    setSelectedSupplierID(event.target.value);
    console.log(selectedSupplierID);
  };

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/api/owner/productServices/getSubCategories/${selectedCategoryID}`
      )
      .then((res) => {
        setSubcategories(res.data);
        setSelectedSubcategory(res.data[0].subCategoryID);
      })

      .catch((err) => {
        console.log(err);
      });
  }, [selectedCategoryID]);

  // Handle subcategory change
  const handleSubcategoryChange = (e) => {
    const selectedSubcategoryId = e.target.value;
    console.log("Selected subcategory", selectedSubcategoryId);
    setSelectedSubcategory(selectedSubcategoryId);
  };

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };
  function handleChange(e, image) {
    console.log(e.target.files);
    if (image === 1) {
      setImage1(URL.createObjectURL(e.target.files[0]));
      setUploadIMG1(e.target.files[0]);
    } else if (image === 2) {
      setImage2(URL.createObjectURL(e.target.files[0]));
      setUploadIMG2(e.target.files[0]);
    } else if (image === 3) {
      setImage3(URL.createObjectURL(e.target.files[0]));
      setUploadIMG3(e.target.files[0]);
    } else {
      alert("Invalid image");
    }
  }

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
  };

  function validateForm(event) {
    event.preventDefault();

    {
      if (
        productName === "" ||
        brandName === "" ||
        openingStock === "" ||
        reorderLevel === "" ||
        productDetails === ""
      ) {
        toast.error("Please fill all the fields", {
          autoClose: 2000,
        });

        return;
      } else if (
        !validateIntegers(openingStock) ||
        !validateIntegers(reorderLevel)
      ) {
        toast.error("Opening stock and reorder level should be integers", {
          position: "top-right",
          autoClose: 2000,
        });

        return;
      } else if (!validatePrice(buyingPrice) || !validatePrice(unitPrice)) {
        toast.error(
          "Buying price and unit price should be numbers greater than zero",
          {
            position: "top-right",
            autoClose: 2000,
          }
        );
        return;
      } else if (existingBarcodes.includes(scannedCode)) {
        toast.error("Barcode already exists", {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        //Create FormData object to send files along with form data
        setDataSending(true);
        imageUpload();

        //Send POST request using Axios
      }
    }
  }

  function validateIntegers(number) {
    if (regex.test(number)) {
      return true;
    } else {
      return false;
    }
  }
  function validatePrice(value) {
    // Check if the value is a valid number and greater than zero
    if (!isNaN(value) && parseFloat(value) > 0) {
      return true;
    }
    return false;
  }

  const imageUpload = async () => {
    const formData = new FormData();
    if (uploadIMG1 !== "") {
      const storageRef = ref(imgStorage, uploadIMG1.name);
      await uploadBytesResumable(storageRef, uploadIMG1)
        .then(async (snapshot) => {
          const url1 = await getDownloadURL(snapshot.ref);
          formData.append("img1", url1);
          console.log("formdata", url1);

          console.log("File available at", url1);
          setImg1URL(url1);
        })
        .catch((error) => {
          console.error("Error uploading image 1", error);
          setImgUploadError(true);
          toast("Error uploading image 1", {
            position: "top-right",
            autoClose: 2000,
          });
        });
    }
    if (uploadIMG2 !== "") {
      const storageRef = ref(imgStorage, uploadIMG2.name);
      await uploadBytesResumable(storageRef, uploadIMG2)
        .then(async (snapshot) => {
          const url2 = await getDownloadURL(snapshot.ref);
          formData.append("img2", url2);
          console.log("File available at", url2);
          setImg2URL(url2);
        })
        .catch((error) => {
          console.error("Error uploading image 2", error);
          setImgUploadError(true);
          toast("Error uploading image 2", {
            position: "top-right",
            autoClose: 2000,
          });
        });
    }
    if (uploadIMG3 !== "") {
      const storageRef = ref(imgStorage, uploadIMG3.name);
      await uploadBytesResumable(storageRef, uploadIMG3)
        .then(async (snapshot) => {
          const url3 = await getDownloadURL(snapshot.ref);
          formData.append("img3", url3);
          console.log("File available at", url3);
          setImg2URL(url3);
        })
        .catch((error) => {
          console.error("Error uploading image 3", error);
          setImgUploadError(true);
        });
    }
    // setTimeout(DatabaseCall, 3000); // Delay DatabaseCall() by 3 seconds
    formData.append("productName", productName);
    formData.append("brandName", brandName);
    formData.append("subCategory", selectedSubcategory);
    formData.append("openingStock", openingStock);
    formData.append("reorderLevel", reorderLevel);
    formData.append("buyingPrice", buyingPrice);
    formData.append("unitPrice", unitPrice);
    formData.append("productDetails", productDetails);
    formData.append("supplierID", selectedSupplierID);
    if (scannedCode === "") {
      formData.append("barcode", "null");
    } else {
      formData.append("barcode", scannedCode);
    }
    console.log("Calling database");
    
    const accessToken = localStorage.getItem("accessToken");
    axios.post("http://localhost:5000/api/owner/productServices/addProduct", formData, {
      headers: { "x-access-token": accessToken },
    })
      .then((res) => {
        // Handle success response
        toast.success("Product added successfully", {
          position: "top-right",
          autoClose: 2000,
        });
        setShowConfirmation(true);
      })
      .catch((err) => {
        // Handle error response
        console.error("Error adding product", err);
        toast.error("Error adding product", {
          position: "top-right",
          autoClose: 2000,
        });
      });

    setDataSending(false);
  };
  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === "Enter") {
        if (barcode) {
          setScannedCode(barcode);
          setBarcode("");
        }
      } else {
        setBarcode((prev) => prev + event.key);
      }
    },
    [barcode]
  );

  const barcodeReader = () => {
    setBarcode("");
    setIsScanning((prevState) => !prevState);
  };

  useEffect(() => {
    if (isScanning) {
      window.addEventListener("keypress", handleKeyPress);
    } else {
      window.removeEventListener("keypress", handleKeyPress);
    }

    // Cleanup event listener on component unmount or when scanning stops
    return () => {
      window.removeEventListener("keypress", handleKeyPress);
    };
  }, [isScanning, handleKeyPress]);

  return (
    <>
      <InventoryNavBar selected="addProduct"/>
      <SideNavbar selected="Inventory" />
      <Form onSubmit={validateForm}>
        <MDBContainer fluid className="bg-white" style={{ height: "100vh" }}>
          <MDBRow className="d-flex justify-content-center align-items-center h-100" style={{width:'100%'}}>
            <MDBCol>
              <MDBCard className="my-4" id="pageCard" style={{zIndex: "888"}}>
                <MDBRow className="g-0"  >
                  <MDBCol
                    md="6"
                    className="d-none d-md-block "
                    style={{ marginTop: "1rem" }}
                  >

                    <Carousel
                      interval={5000}
                      activeIndex={index}
                      onSelect={handleSelect}
                      style={{
                        width: "40%",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    >
                      <Carousel.Item>
                        <img
                          src={
                            image1
                              ? image1
                              : require("../assets/no_image_selected.jpg")
                          }
                          alt="Second slide"
                          style={{ height: "50vh", width: "100%" }}
                        />
                        <Carousel.Caption>
                          <h3>Image 1</h3>
                        </Carousel.Caption>
                      </Carousel.Item>
                      <Carousel.Item>
                        <img
                          src={
                            image2
                              ? image2
                              : require("../assets/no_image_selected.jpg")
                          }
                          alt="Second slide"
                          style={{ height: "50vh", width: "100%" }}
                        />

                        <Carousel.Caption>
                          <h3>Image 2</h3>
                        </Carousel.Caption>
                      </Carousel.Item>
                      <Carousel.Item>
                        <img
                          src={
                            image3
                              ? image3
                              : require("../assets/no_image_selected.jpg")
                          }
                          alt="Second slide"
                          style={{ height: "50vh", width: "100%" }}
                        />
                        <Carousel.Caption>
                          <h3>Image 3</h3>
                        </Carousel.Caption>
                      </Carousel.Item>
                    </Carousel>
                    {/* ----------------------------------------------------------------------------------------- */}

                    {/* <div className="App">
                  <h4>Add Image 1:</h4>
                  <input type="file" onChange={{}} />
                  <img src={image1} />
                </div> */}
                    <div style={{ margin: "1rem" }}>
                      <Form.Label>Select image 1</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleChange(e, 1)}
                      />
                      <Form.Label>Select image 2</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleChange(e, 2)}
                      />
                      <Form.Label>Select image 3</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleChange(e, 3)}
                      />
                    </div>
                  </MDBCol>

                  <MDBCol md="6">
                    <MDBCardBody className="text-black d-flex flex-column justify-content-center">
                      <h3 className="mb-3 text-uppercase fw-bold">
                        New product info
                      </h3>

                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          <Form.Label>Product Name</Form.Label>
                          <Form.Control
                            id="inputProductName"
                            type="text"
                            placeholder="new product name....."
                            onChange={(e) => setProductName(e.target.value)}
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>

                        <MDBCol md="6">
                          <Form.Label>Brand</Form.Label>
                          <Form.Control
                            id="inputBrandName"
                            type="text"
                            placeholder="brand name"
                            onChange={(e) => setBrandName(e.target.value)}
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>
                      </MDBRow>

                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          <Form.Label htmlFor="disabledSelect">
                            Category
                          </Form.Label>
                          <Form.Select
                            id="categorySelect"
                            onChange={handleCategoryChange}
                            value={selectedCategoryID}
                          >
                            {categories.map((category) => (
                              <option
                                key={category.categoryID}
                                value={category.categoryID}
                              >
                                {category.categoryName}
                              </option>
                            ))}
                          </Form.Select>
                        </MDBCol>

                        <MDBCol md="6">
                          <Form.Label htmlFor="disabledSelect">
                            Sub Category
                          </Form.Label>
                          <Form.Select
                            id="subCategorySelect"
                            onChange={handleSubcategoryChange}
                            value={selectedSubcategory}
                          >
                            {subcategories.map((item) => (
                              <option
                                key={item.subcategoryID}
                                value={item.subCategoryID} // Set the value to the subcategoryID
                              >
                                {item.subCategoryName}
                              </option>
                            ))}
                          </Form.Select>
                        </MDBCol>
                      </MDBRow>

                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          <Form.Label>Opening stock</Form.Label>
                          <Form.Control
                            id="inputOpeningStock"
                            type="text"
                            placeholder="first stock quantity"
                            min="0" // Enforce a minimum value of 1
                            step="1" // Allow only whole numbers (integers)
                            pattern="^[1-9]\d*$"
                            onChange={(e) => setOpeningStock(e.target.value)}
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>

                        <MDBCol md="6">
                          <Form.Label>Re-order level</Form.Label>
                          <Form.Control
                            id="inputReorderLevel"
                            type="number"
                            placeholder="product reorder level"
                            min="0" // Enforce a minimum value of 1
                            step="1" // Allow only whole numbers (integers)
                            pattern="^[1-9]\d*$" // Enforce positive integers with regex
                            onChange={(e) => setReorderLevel(e.target.value)}
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>
                      </MDBRow>
                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          <Form.Label>Buying price</Form.Label>
                          <Form.Control
                            id="inputbuyingprice"
                            type="number"
                            placeholder="buying price per unit"
                            min="0" // Enforce a minimum value of 1
                            step="0.01"
                            onChange={(e) => setBuyingPrice(e.target.value)}
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>

                        <MDBCol md="6">
                          <Form.Label>Selling price</Form.Label>
                          <Form.Control
                            id="inputUnitPrice"
                            type="number"
                            placeholder="product selling price per unit"
                            min="0" // Enforce a minimum value of 1
                            step="0.01"
                            onChange={(e) => setUnitPrice(e.target.value)}
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>
                      </MDBRow>
                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          <Form.Label>Supplier</Form.Label>
                          <Form.Control
                            id="inputSupplier"
                            type="text"
                            placeholder="Supplier name"
                          />
                          <Form.Text className="text-muted"></Form.Text>
                          </MDBCol>
                        <MDBCol md="6">
                          <Form.Label htmlFor="disabledSelect">
                            Supplier
                          </Form.Label>
                          <Form.Select
                            id="inputSupplier"
                            onChange={handleSupplierChange}
                            value={selectedSupplierID}
                          >
                            {suppliers?.map((supplier) => (
                              <option
                                key={supplier.supplierID}
                                value={supplier.supplierID}
                              >
                                {supplier.name}
                              </option>
                            ))}
                          </Form.Select>
                        </MDBCol>
                        <MDBCol md="6">
                          <Form.Label htmlFor="disabledSelect">
                            Barcode
                          </Form.Label>
                          <InputGroup>
                            <Form.Control
                              type="text"
                              placeholder="product barcode"
                              aria-describedby="inputBarcode"
                              value={scannedCode ? scannedCode : barcode}
                              readOnly
                            />
                            {scannedCode === "" ? (
                              <InputGroup.Text
                                id="inputBarcodeBtn"
                                style={{
                                  cursor: "pointer",
                                  backgroundColor: isScanning
                                    ? "white"
                                    : "black",
                                  border: "2px solid black",
                                  color: isScanning ? "black" : "white",
                                }}
                                onClick={() => {
                                  barcodeReader();
                                }}
                              >
                                {isScanning ? "Stop scanning" : "Scan barcode"}
                              </InputGroup.Text>
                            ) : (
                              <InputGroup.Text
                                id="inputBarcodeBtn"
                                style={{
                                  cursor: "pointer",
                                  backgroundColor: "black",
                                  border: "2px solid black",
                                  color: "white",
                                }}
                                onClick={() => {
                                  setScannedCode("");
                                  setBarcode("");
                                }}
                              >
                                {"Clear"}
                              </InputGroup.Text>
                            )}
                          </InputGroup>
                        </MDBCol>
                      </MDBRow>

                      <Form.Label>Product details</Form.Label>
                      <Form.Control
                        id="inputProductDetails"
                        type="text"
                        placeholder="new product details....."
                        as={"textarea"}
                        style={{ height: "100px" }}
                        onChange={(e) => setProductDetails(e.target.value)}
                      />
                      <Form.Text className="text-muted"></Form.Text>

                      <div className="d-flex justify-content-end pt-3">
                        <Button variant="outline-dark" type="reset">
                          Clear all
                        </Button>
                        &nbsp;
                        <Button
                          as="input"
                          variant="dark"
                          type="submit"
                          value="Add product"
                        />
                      </div>
                    </MDBCardBody>
                  </MDBCol>
                </MDBRow>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </Form>

      <div
        className="cover"
        style={{ display: dataSending ? "block" : "none" }}
      >
        <div className="innerCover">
          <Spinner animation="grow" variant="light" />;
          <h4 style={{ color: "snow" }}>Database Updating</h4>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}

export default AddProduct;
