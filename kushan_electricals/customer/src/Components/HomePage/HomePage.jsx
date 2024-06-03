import React, { useEffect, useState } from "react";
import FilterOptions from "../FilterOptions/FilterOptions";
import ProductGrid from "../productGrid/productGrid";

export default function HomePage({ searchTerm }) {
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(12000);
    const [search, setSearch] = useState("");

   
  
    return (
      <div>
        <FilterOptions
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          search = {search}
          setSearch={setSearch}

        />
        <ProductGrid
          searchTerm={searchTerm}
          minPrice={minPrice}
          maxPrice={maxPrice}
        />
      </div>
    );
  }