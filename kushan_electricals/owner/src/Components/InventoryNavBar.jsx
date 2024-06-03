import React, { useEffect, useState } from "react";
import { IoIosArrowDropleftCircle } from "react-icons/io";
import { BsFillCaretRightFill } from "react-icons/bs";
import { BiSolidCategoryAlt } from "react-icons/bi";
import { CiSquarePlus } from "react-icons/ci";
import { LiaUserCircle } from "react-icons/lia";
import { CiSquareRemove } from "react-icons/ci";
import { VscHistory } from "react-icons/vsc";
import { PiTreeStructureLight } from "react-icons/pi";
import { Link } from "react-router-dom";
import "./InventoryNavBar.css";

function SideNavbar({ selected }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="d-flex"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100%",
        zIndex: open ? "1000" : "100",
        overflowX: "hidden",
      }}
    >
      <div
        className={`h-screen bg-black position-relative`}
        style={{
          display: "flex",
          width: "100%",
          transform: `translateX(${open ? "0" : "20%"})`,
          transition: "transform 0.5s",
        }}
      >
        <div
          style={{
            color: "white",
            top: "5rem",
            position: "absolute",
            marginLeft: open ? "15px" : "-15px",
          }}
        >
          <IoIosArrowDropleftCircle
            style={{
              fontSize: "2rem",
              border: "1px solid black",
              borderRadius: "25px",
              zIndex: 1000,
              backgroundColor: "#474747",
              transform: open ? "rotate(180deg)" : "none",
              cursor: "pointer",
            }}
            onClick={() => setOpen(!open)}
          />
        </div>

        <br />
        <ul
          className="d-flex flex-column justify-content-center"
          id="optionList"
        >
          <Link to="/altercategories">
            <li
              className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2 hover-bg-light rounded-md mt-2 "
              style={{
                paddingTop: "1rem",
                cursor: "pointer",
                marginLeft: "-1rem",
                backgroundColor:
                  selected === "altercategories" ? "#474747" : "",
              }}
            >
              <PiTreeStructureLight
                className="w-12 h-12"
                style={{ fontSize: "36px" }}
              />
              &nbsp;&nbsp;
              {open && (
                <span>
                  Alter
                  <br />
                  Category
                </span>
              )}
            </li>
          </Link>
          <Link to="/addProduct">
            <li
              className="text-white text-sm d-flex align-items-center gap-2 cursor-pointer p-2 hover-bg-light rounded-md mt-2 "
              style={{
                paddingTop: "1rem",
                cursor: "pointer",
                marginLeft: "-1rem",
                backgroundColor: selected === "addProduct" ? "#474747" : "",
              }}
            >
              <CiSquarePlus
                className="w-12 h-12"
                style={{ fontSize: "36px" }}
              />
              &nbsp;&nbsp;
              {open && (
                <span>
                  New
                  <br />
                  Product
                </span>
              )}
            </li>
          </Link>
        </ul>
      </div>
      <div className=""></div>
    </div>
  );
}

export default SideNavbar;
