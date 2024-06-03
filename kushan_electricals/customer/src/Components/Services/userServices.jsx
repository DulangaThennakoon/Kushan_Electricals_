import { signUpEndpoint,loginEndpoint,customerServicesEndpoint } from "../apiCalls"
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Function to call the signUp API endpoint
export const signUpUser = async (userData) => {
  
    const response = await axios.post(signUpEndpoint, userData);
    return response.status;
 
};

export const loginUser = async(loginData) => {
    const response = await axios.post(loginEndpoint, loginData);
   const accessToken = response.data.accessToken;
    localStorage.setItem("logged", response.data.auth);
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("customerName", response.data.customerName);
    localStorage.setItem("customerID", response.data.customerID);
    return response.status;
}



// export async function getCustomerDetails(){
//   console.log("Front end service ***************************** ");
//   const accessToken = localStorage.getItem("accessToken");

//   const response = await axios.post(customerServicesEndpoint + "/getCustomerDetails", {
//     headers: {
//       "x-access-token": accessToken,
//     },
//   });
//   return response.data;
// }
export const getCustomerDetails = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.post(customerServicesEndpoint + "/getCustomerDetails", {}, {
      headers: {
        "x-access-token": accessToken,
      },
    });
    return response.data;
  } catch (error) {
    toast.error(error.message, {
      position: "top-right",
      autoClose: 3500,
    });
    console.error("Error fetching customer details:", error);
    throw error;
  }
  <ToastContainer />;
};

export const getOrderHistory = async () => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.get(customerServicesEndpoint + "/getOrderHistory", {
      headers: {
        "x-access-token": accessToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching order history:", error);
    toast.error(error.message);
  }
}

export const changeCustomerDetails = async (newDetails) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.post(customerServicesEndpoint + "/updateCustomerDetails", newDetails, {
      headers: {
        "x-access-token": accessToken,
      },
    });
    toast.success(response.data.message, {
      position: "top-right",
      autoClose: 3500,
    }
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    toast.error(error.message, {
      position: "top-right",
      autoClose: 3500,
    });
    console.error("Error changing customer details:", error);
    return error;
  }
};

export const verifyPassword = async (password) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.post(customerServicesEndpoint + "/verifyPassword", { password }, {
      headers: {
        "x-access-token": accessToken,
      },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.message, {
      position: "top-right",
      autoClose: 3500,
    });
    console.error(error);
    return error;
  }
  <ToastContainer />
}; 

export const changePassword = async (newPassword) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    const response = await axios.post(customerServicesEndpoint + "/changePassword", { newPassword:newPassword }, {
      headers: {
        "x-access-token": accessToken,
      },
    });
    toast.success(response.data.message, {
      position: "top-right",
      autoClose: 3500,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    toast.error(error.response.data.message, {
      position: "top-right",
      autoClose: 3500,
    });
    console.error(error);
    return error;
  }
  <ToastContainer />
}; 
