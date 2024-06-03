import * as React from "react";
import { useState, useEffect } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import "./SalesGraph.css";
import {
  getWeeklyInstoreSales,
  getWeeklyOnlineSales,
} from "../Services/ReporService";
import axios from "axios";

export default function SalesGraph() {
  const weeks = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52,
  ];
  const [online_sales, setOnline_Sales] = useState([]);
  const [instore_sales, setInstore_Sales] = useState([]);
  const [total_sales, setTotal_Sales] = useState([]);

  let totalSales = [];
  //const totalSales = onlinesales.map((value, index) => value + offlinesales[index]);
  useEffect(() => {
    getWeeklyOnlineSales()
      .then((response) => {
        setOnline_Sales(response);
      })
      .catch((error) => {
        console.log(error);
      });
    getWeeklyInstoreSales()
      .then((response) => {
        setInstore_Sales(response);
      })
      .catch((error) => {
        console.log(error);
      });
    
  }, []);

  useEffect(() => {
    if (instore_sales.length ===online_sales.length && online_sales.length === 52) {
      for (let i = 0; i < 52; i++) {
        totalSales.push(instore_sales[i] + online_sales[i]);
      }
      setTotal_Sales(totalSales);
    }
  }, [online_sales, instore_sales]);
  
  return (
    <div>
      <LineChart
        xAxis={[{ data: weeks, axisLabel: "Weeks" }]}
        yAxis={[{ axisLabel: "Sales" }]}
        series={[
          {
            data: online_sales,
            label: "Online Sales",
          },
          {
            data: instore_sales,
            label: "Instore Sales",
          },
          {
            data: total_sales,
            label: "Total Sales",
          },
        ]}
        width={600}
        height={420}
      />
      <div className="x-axis-label">Weeks</div>
      <div className="y-axis-label">
        Sales
        <br />x 1000 LKR
      </div>
    </div>
  );
}
