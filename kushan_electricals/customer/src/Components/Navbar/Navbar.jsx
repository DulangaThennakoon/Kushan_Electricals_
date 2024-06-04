import React, { useEffect } from "react";
import { useState } from "react";
import "./Navbar.css";
import logo from "../Assets/logo.png";
import { MdOutlineShoppingCart } from "react-icons/md";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControl from "@mui/material/FormControl";
import { CiSearch } from "react-icons/ci";
import { FaUserCircle } from "react-icons/fa";
import { Link,useNavigate } from "react-router-dom";
import {
  MDBDropdown,
  MDBDropdownMenu,
  MDBDropdownToggle,
  MDBDropdownItem,
  MDBBtn,
} from "mdb-react-ui-kit";
import { LuMenu } from "react-icons/lu";

function Navbar({ onSearch,setIsAuthenticated  }) {
  const [menu, setMenu] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const customerName = localStorage.getItem("customerName") || "Customer";
  const itemCount = localStorage.getItem("itemCount") || 0;
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("logged") || false
  );

  const handleSearch = () => {
    onSearch(searchTerm);
  };
  useEffect(() => {
    handleSearch();
  }, [searchTerm]);

  const handleLogOut = () => {
    localStorage.removeItem("logged");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("customerName");
    localStorage.removeItem("customerID");
    setLoggedIn(false);
    setIsAuthenticated(false);
    navigate("/");
  };

  return (
    <div>
      <div className="navbar">
        <div className="navbar_logo">
          <Link to={"/"}>
            <img src={logo} alt="logo" style={{ width: "10rem"
             }} />
          </Link>
          <p className="greeting">Welcome</p>
          <div className="mobileDropdown">
            <MDBDropdown dropleft group>
              <MDBDropdownToggle class="custom-dropdown-toggle">
                <LuMenu className="menuBTN" />
              </MDBDropdownToggle>
              <MDBDropdownMenu>
                <MDBDropdownItem link>Hello! {customerName}</MDBDropdownItem>
                <MDBDropdownItem divider />
                <Link to={"/cart"}>
                <MDBDropdownItem link>My Cart</MDBDropdownItem>
                </Link>
                <Link to={"/profile"}>
                <MDBDropdownItem link>My account</MDBDropdownItem>
                </Link>
                <MDBDropdownItem divider />
                {!loggedIn ? (
                  <Link to={"/login"}>
                    <MDBDropdownItem link>Login</MDBDropdownItem>
                  </Link>
                ) : <MDBDropdownItem link onClick={handleLogOut}>LogOut</MDBDropdownItem>}
              </MDBDropdownMenu>
            </MDBDropdown>
          </div>
        </div>
        <div className="navbar_search">
          <FormControl sx={{ m: 1 }} variant="outlined" className="searchForm">
            <OutlinedInput
              id="outlined-adornment-weight"
              className="searchInput"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              endAdornment={
                <InputAdornment position="end" style={{fontSize:'20px!important'}}>
                  <CiSearch />
                </InputAdornment>
              }
              placeholder="Explore Products"
              aria-describedby="outlined-weight-helper-text"
              inputProps={{
                "aria-label": "weight",
              }}
            />
          </FormControl>
        </div>
        <ul className="navbar_menu">
          <Link to={"/"}>
            <li
              onClick={() => {
                setMenu("home");
                setSearchTerm("");
              }}
            >
              Home{menu === "home" ? <hr /> : null}
            </li>
          </Link>
          <Link to={"/"}>
            <li
              onClick={() => {
                setMenu("household");
                setSearchTerm("Household Appliances");
              }}
            >
              Household Appliances {menu === "household" ? <hr /> : null}
            </li>
          </Link>
          <Link to={"/"}>
            <li
              onClick={() => {
                setMenu("electrical");
                setSearchTerm("Electrical Components");
              }}
            >
              Electrical Components {menu === "electrical" ? <hr /> : null}
            </li>
          </Link>
        </ul>
        <div className="navbar_login_cart">
          {!loggedIn ? (
            <Link to={"/login"}>
              <button>Login</button>
            </Link>
          ) : (
            <button onClick={handleLogOut}>Log out</button>
          )}
          {loggedIn ? (
            <Link to={"/cart"}>
              {" "}
              <MdOutlineShoppingCart style={{ fontSize: "2rem" }} />
            </Link>
          ) : (
            <MdOutlineShoppingCart style={{ fontSize: "2rem" }} />
          )}
          <div className="navbar_cart_count">{itemCount}</div>
          {loggedIn ? (
            <Link to={"/profile"}>
              <div className="userAccount">
                <p>
                  <FaUserCircle
                    style={{ fontSize: "1.8rem", marginTop: "10px" }}
                  />
                </p>
                <div>
                  <p style={{ fontSize: "14px", marginBottom: "-2px" }}>
                    Hello
                  </p>
                  <p style={{ fontWeight: "bold", marginBottom: "-2px" }}>
                    {customerName}
                  </p>
                </div>
              </div>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
