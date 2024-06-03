import { getProductsEndpoint,getProduceDetailsEndpoint } from "../apiCalls";
import { React, useState } from "react";
import axios from "axios";

const categories = [
  {
    id: 1,
    name: "Household Appliances",
    subcategories: [
      {
        id: 1,
        name: "Kitchen Appliances",
      },
      {
        id: 2,
        name: "Entertainment Appliances",
      },
    ],
  },
  {
    id: 2,
    name: "Electrical Components",
    subcategories: [
      {
        id: 1,
        name: "Wiring Deviceses",
      },
      {
        id: 2,
        name: "Cabling & Cords",
      },
      {
        id: 3,
        name: "Lighting",
      },
      {
        id: 4,
        name: "Electrical Protection",
      },
    ],
  },
];

export const getProducts = async () => {
  const response = await axios.get(getProductsEndpoint);
  return response.data;
};

function getCategories() {
  const returnItems = categories.map((category) => {
    return { id: category.id, name: category.name };
  });
  return returnItems;
}

function getSubcategories(categoryId) {
  const category = categories.find((category) => category.id === categoryId);
  return category.subcategories.map((subcategory) => {
    return {
      id: subcategory.id,
      name: subcategory.name,
    };
  });
}

async function getProductDetails(productId) {
  const response = await axios.get(getProduceDetailsEndpoint + "/" + productId);
  return response.data;
}


export { getCategories, getSubcategories,getProductDetails };