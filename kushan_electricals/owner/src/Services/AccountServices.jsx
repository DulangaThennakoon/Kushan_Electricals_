import axios from "axios";
import { useState,useEffect } from 'react';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const getEmail = async () => {
    const accessToken = localStorage.getItem("accessToken");
    try {
        const res = await axios({
            method: "get",
            url: "http://localhost:5000/api/owner/accountServices/getEmail",
            headers: { "x-access-token": accessToken },
        });
        return res.data.email;
    } catch (err) {
        console.log(err);
        toast.error("Error fetching email", {
            position: "top-right",
            autoClose: 3500,
        });
        throw err;
    }
};

const ChangeEmail = async (email) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
        const res = await axios({
            method: "post",
            url: "http://localhost:5000/api/owner/accountServices/changeEmail",
            headers: { "x-access-token": accessToken },
            data: { email },
        });
        return res.data;
    } catch (err) {
        console.log(err);
        toast.error("Error changing email", {
            position: "top-right",
            autoClose: 3500,
        });
        throw err;
    }
};

const verifyPassword = async (password) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
        const res = await axios({
            method: "post",
            url: "http://localhost:5000/api/owner/accountServices/verifyPassword",
            headers: { "x-access-token": accessToken },
            data: { password },
        });
        return res.data;
    } catch (err) {
        console.log(err);
        toast.error(err.response.data.message, {
            position: "top-right",
            autoClose: 3500,
        });
        throw err;
    }
};

const changePassword = async (password) => {
    const accessToken = localStorage.getItem("accessToken");
    try {
        const res = await axios({
            method: "post",
            url: "http://localhost:5000/api/owner/accountServices/changePassword",
            headers: { "x-access-token": accessToken },
            data: { password },
        });
        return res.data;
    } catch (err) {
        console.log(err);
        toast.error(err.response.data.message, {
            position: "top-right",
            autoClose: 3500,
        });
        throw err;
    }
};


// const getWeeklyInstoreSales = async () => {
//   try {
//     const res = await axios.get('http://localhost:5000/ownerReportServices/getInstoreSales');
//     console.log(res.data);
//     return res.data;
//   } catch (err) {
//     toast.error("Error fetching sales data", {
//       position: "top-right",
//       autoClose: 3500,
//     });
//     console.log(err);
//     throw err; // Rethrow the error to handle it in the caller function
//   }
// };

export { getEmail, ChangeEmail, verifyPassword, changePassword};