const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const e = require("express");
const bodyParser = require("body-parser");
const { getItemList } = require("./controllers/productController");
const customerServicesRouter = require("./routes/customerServices");
const productServicesRouter = require("./routes/productServices");
const cartServicesRouter = require("./routes/cartServices");
const ownerProductServicesRouter = require("./routes/ownerProductServices");
const ownerSupplierServicesRouter = require("./routes/ownerSupplierServices");
const ownerAccountServicesRouter = require("./routes/ownerAccountServices");
const owner_ECOM_servicesRouter = require("./routes/owner_ECOM_services");
const Report_AnalyticsRouter = require("./routes/OwnerReport&Analytics");
const { pseudoRandomBytes } = require("crypto");
const multer = require("multer");
const cookieParser = require("cookie-parser");
const upload = multer();
const {createToken, validateToken} = require("./JWT");
const {createOwnerToken, validateOwnerToken} = require("./ownerJWT");


const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json());
const port = 5000;
app.use(cookieParser()); 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


const db = require("./Server_Configuration");

app.get("/listProducts", getItemList);

// Use the customer services route handler for the /api/customerServices route.
app.use("/api/customerServices", customerServicesRouter);
app.use("/api/ProductServices", productServicesRouter);
app.use("/api/owner/productServices",ownerProductServicesRouter);
app.use("/api/owner/supplierServices", ownerSupplierServicesRouter);
app.use("/api/owner/accountServices", ownerAccountServicesRouter);
app.use("/api/cartServices", cartServicesRouter);
app.use("/api/owner/ECOM_services", owner_ECOM_servicesRouter);
app.use("/ownerReportServices", Report_AnalyticsRouter);

app.get("/isAuth", validateOwnerToken, (req, res) => {
    console.log("User is authenticated");
    console.log(req.role);
    return res.status(200).json({ message: "User is authenticated" });
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});