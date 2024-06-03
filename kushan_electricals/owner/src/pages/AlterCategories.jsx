import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import axios from "axios";
import SideNavbar from "../Components/SideNavbar";
import InventoryNavBar from "../Components/InventoryNavBar"
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBRow,
  MDBCol,
} from "mdb-react-ui-kit";
import { Link } from "react-router-dom";
import { nameValidation } from "../functionality/validation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";

function AlterCategories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/owner/productServices/getCategories")
      .then((res) => {
        setCategories(res.data);
        setSelectedCategory(res.data[0]);
        console.log(res.data[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/api/owner/productServices/getSubCategories/${selectedCategory.categoryID}`
      )
      .then((res) => {
        setSubCategories(res.data);
        setSelectedSubCategory(res.data[0]);
        console.log(res.data);
      })

      .catch((err) => {
        console.log(err);
      });
  }, [selectedCategory]);

  function addNewCategory() {

    const newCategory = document.getElementById("newCategoryName").value;
    categories.map((category) => {
      if (category.categoryName === newCategory) {
        toast.error("Category name already exists");
      }
      return;
    });
    if (nameValidation(newCategory)) {
      Swal.fire({
        title: "Are you sure you want to add this category?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#000000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, add it!"
      }).then((result) => {
        if (result.isConfirmed) {
          const accessToken = localStorage.getItem("accessToken");
          axios
            .post("http://localhost:5000/api/owner/productServices/addNewCategory", {
              categoryName: newCategory,
            }, {
              headers: {
                "x-access-token": accessToken,
              },
            })
            .then((res) => {
              console.log(res);
              toast.success("Category added successfully");
            })
            .catch((err) => {
              console.log(err);
              toast.error("Category could not be added");
            });
        }else{
          return;
        }
      });
      
    } else {
      toast.error("Invalid category name");
    }
  }
  const renameCategory = () => {
    const newCategoryName = document.getElementById("categoryNewName").value;
    categories.map((category) => {
      if (category.categoryName === newCategoryName) {
        toast.error("Category name already exists");
      }
      return;
    });
    if (!nameValidation(newCategoryName)) {
      toast.error("Invalid category name");
      return;
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "This category name will be changed!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#000000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, rename it!"
      }).then((result) => {
        if (result.isConfirmed) {
          const accessToken = localStorage.getItem("accessToken");
          axios
            .post("http://localhost:5000/api/owner/productServices/renameCategory", {
              categoryNewName: newCategoryName,
              categoryID: selectedCategory.categoryID,
            }, {
              headers: {
                "x-access-token": accessToken,
              },
            })
            .then((res) => {
              console.log(res);
              toast.success("Category renamed successfully");
            })
            .catch((err) => {
              console.log(err);
              toast.error("Category could not be renamed");
            });
        }else{
          return;
        }
      });
      
    }
  };

  const renameSubCategory = () => {
    const newSubCategoryName = document.getElementById("renameSubCategory").value;
    subCategories.map((subCategory) => {
      if (subCategory.subCategoryName === newSubCategoryName) {
        toast.error("Sub-Category name already exists");
      }
      return;
    });
      
    if (!nameValidation(newSubCategoryName)) {
      toast.error("Invalid Sub-Category name");
      return;
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "This sub-category name will be changed!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#000000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, rename it!"
      }).then((result) => {
        if (result.isConfirmed) {
          const accessToken = localStorage.getItem("accessToken");
          axios.post("http://localhost:5000/api/owner/productServices/renameSubCategory", {
            subCategoryNewName: newSubCategoryName,
            subCategoryID: selectedSubCategory.subCategoryID,
          }, {
            headers: {
              "x-access-token": accessToken,
            },
          }).then((res) => {
            console.log(res);
            toast.success("Sub-Category renamed successfully");
          }).catch((err) => {
            console.log(err);
            toast.error("Sub-Category could not be renamed");
          });
        }
      });
      
    }
  };

  const addNewSubCategory = () => {
    const newSubCategoryName = document.getElementById("newSubCategoryName").value;
    subCategories.map((subCategory) => {
      if (subCategory.subCategoryName === newSubCategoryName) {
        toast.error("Sub-Category name already exists");
      }
      return;
    });
    if(!nameValidation(newSubCategoryName)){
      toast.error("Invalid Sub-Category name");
      return;
    } else {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#000000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, add it!"
      }).then((result) => {
        if (result.isConfirmed) {
          const accessToken = localStorage.getItem("accessToken");
          axios
            .post("http://localhost:5000/api/owner/productServices/addNewSubCategory", {
              subCategoryName: newSubCategoryName,
              categoryID: selectedCategory.categoryID,
            }, {
              headers: {
                "x-access-token": accessToken,
              },
            })
            .then((res) => {
              console.log(res);
              toast.success("Sub-Category added successfully");
            })
            .catch((err) => {
              console.log(err);
              toast.error("Sub-Category could not be added");
            });
        }
      });
      
    }
  };

  return (
    <div>
      <InventoryNavBar selected="altercategories"/>
      <SideNavbar selected="Inventory" />
      <Form >
        <MDBContainer fluid className="bg-white" style={{ height: "100vh" }}>
          <MDBRow className="d-flex justify-content-center align-items-center h-100" > 
            <MDBCol>
              <MDBCard className="my-4" style={{display:'flex', width: "92%",marginLeft: "auto",marginRight: "auto",zIndex:'888'}}>
              <h1 style={{margin:'1rem',marginLeft:'2rem'}}>Alter Categories</h1>
                <MDBRow className="g-0">
                  <MDBCol md="6">
                    <MDBCardBody className="text-black d-flex flex-column justify-content-centertext-black d-flex flex-column justify-content-center align-items-center">
                      <MDBCol md="6">
                        <Form.Label htmlFor="disabledSelect">
                          <h5>Change category data</h5>
                        </Form.Label>
                        <Form.Select
                          id="categorySelect"
                          onChange={(e) => {
                            setSelectedCategory(
                              categories.find(
                                (category) =>
                                  category.categoryID ===
                                  parseInt(e.target.value)
                              )
                            );
                          }}
                          value={selectedCategory.categoryID}
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
                      <br />
                      <MDBCol md="6">
                        <Form.Label>Rename selected category</Form.Label>

                        <Form.Control id="categoryNewName" type="text" />
                        <Form.Text className="text-muted"></Form.Text>
                        <br />
                        <Button
                          variant="dark"
                          type="button"
                          style={{ display: "flex", marginLeft: "auto" }}
                          onClick={renameCategory}
                        >
                          Change
                        </Button>
                      </MDBCol>
                      <br />

                      <MDBCol md="6">
                        <MDBCard style={{ padding: "1rem" }}>
                          <Form.Label>Add new category</Form.Label>
                          <Form.Control id="newCategoryName" type="text" />
                          <br />
                          <Button
                            variant="dark"
                            type="button"
                            style={{ display: "flex", marginLeft: "auto" }}
                            onClick={addNewCategory}
                          >
                            Add
                          </Button>
                        </MDBCard>
                      </MDBCol>
                    </MDBCardBody>
                  </MDBCol>

                  <MDBCol md="6">
                    <MDBCardBody className="text-black d-flex flex-column justify-content-center">
                      <h5>Change sub-category data</h5>

                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          <Form.Label>Select category</Form.Label>
                          <Form.Select
                            id="categorySelect"
                            onChange={(e) => {
                              setSelectedCategory(
                                categories.find(
                                  (category) =>
                                    category.categoryID ===
                                    parseInt(e.target.value)
                                )
                              );
                            }}
                            value={selectedCategory.categoryID}
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
                          <Form.Label>Select sub-category</Form.Label>
                          {subCategories.length > 0 ? (
                            <Form.Select
                              id="subCategorySelect"
                              onChange={(e) => {
                                setSelectedSubCategory(
                                  subCategories.find(
                                    (subCategory) =>
                                      subCategory.subCategoryID ===
                                      parseInt(e.target.value)
                                  )
                                );
                              }}
                              value={selectedSubCategory.subCategoryID}
                            >
                              {subCategories.map((subCategory) => (
                                <option
                                  key={subCategory.subCategoryID}
                                  value={subCategory.subCategoryID}
                                >
                                  {subCategory.subCategoryName}
                                </option>
                              ))}
                            </Form.Select>
                          ) : (
                            <p>No sub-categories available</p>
                          )}
                        </MDBCol>
                      </MDBRow>
                      <MDBRow style={{ marginBottom: "1rem" }}>
                        <MDBCol md="6">
                          <Form.Label>Rename sub-category</Form.Label>
                          <Form.Control id="renameSubCategory" 
                          type="text"
                          placeholder="Enter new sub-category name for selected sub-category"
                          />
                          <Form.Text className="text-muted"></Form.Text>
                        </MDBCol>

                        <MDBCol md="6">
                          <Form.Label>{"\n"}</Form.Label>
                          <Button
                            variant="dark"
                            type="button"
                            style={{ display: "flex", marginLeft: "auto" }}
                            onClick={renameSubCategory}
                          >
                            Rename
                          </Button>
                        </MDBCol>
                      </MDBRow>

                        <MDBCard style={{ padding: "1rem", marginLeft:'auto', width:'100%'}}>
                          <Form.Label>Add new Sub-Category</Form.Label>
                          <Form.Control id="newSubCategoryName" type="text" />
                          <br />
                          <Button
                            variant="dark"
                            type="button"
                            style={{ display: "flex", marginLeft: "auto" }}
                            onClick={addNewSubCategory}
                          >
                            Add
                          </Button>
                        </MDBCard> 
                     
                    </MDBCardBody>
                  </MDBCol>
                </MDBRow>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </Form>
      <ToastContainer />
    </div>
  );
}

export default AlterCategories;
