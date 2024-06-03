// SearchBar.jsx
import React, { useState, useRef, useEffect } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { IoSearch } from "react-icons/io5";

const SearchBar = ({ items, onItemSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const listRef = useRef(null);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    // Filter items based on search term
    const results = items.filter((item) =>
      item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  };

  const handleClickOutside = (event) => {
    if (listRef.current && !listRef.current.contains(event.target)) {
      setSearchResults([]); // Clear search results when clicked outside the list
    }
  };

  const handleItemSelect = (item) => {
    onItemSelect(item); // Pass the selected item to the parent component
    setSearchResults([]); // Clear search results after selecting an item
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div style={{ position: "absolute",width:'30%'}}>
      <InputGroup className="mb-3">
        <Form.Control
          aria-label="Amount (to the nearest dollar)"
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={handleChange}
          style={{ borderTopLeftRadius: "25px", borderBottomLeftRadius: "25px" }}
        />
        <InputGroup.Text style={{ backgroundColor: "black",borderTopRightRadius: "25px", borderBottomRightRadius: "25px"  }}>
          <IoSearch style={{ color: "snow" }} />
        </InputGroup.Text>
      </InputGroup>
      <div ref={listRef}>
        <ul style={{ listStyleType: "none", backgroundColor: "white" }}>
          {searchResults.map((item) => (
            <li
              key={item.productID}
              onMouseOver={(event) => {
                event.target.style.backgroundColor = "#636363";
                event.target.style.color = "white";
              }}
              onMouseOut={(event) => {
                event.target.style.backgroundColor = "";
                event.target.style.color = "";
              }}
              onClick={() => handleItemSelect(item)} // Call handleItemSelect when item is clicked
            >
              {item.productName}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SearchBar;
