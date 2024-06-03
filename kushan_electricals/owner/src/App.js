// App.jsx
import React from 'react';
import { Routes, Route, BrowserRouter,useParams,useLocation } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import Orders from './pages/orders';
import Transaction from './pages/Transaction'; 
import Inventory from './pages/Inventory';
import Login from './pages/Login';
import Productlist from './Components/productlist';
import LowStock from './pages/LowStock';
import AddProduct from './pages/AddProduct';
import EditProduct from './pages/EditProduct';
import NewInventory from './pages/NewInventory';
import AddSupplier from './pages/addSupplier';
import ListSuppliers from './pages/ListSuppliers';
import PurchaseHistory from './pages/PurchaseHistory';
import AlterCategories from './pages/AlterCategories';
import HandleExpiredProducts from './pages/HandleExpiredProducts'
import ProductReturn from './pages/ProductReturn';
import Reports from './pages/Reports';
import AccountSetings from './pages/AccountSettings';
import TitleBar from './Components/TitleBar';

function MainContent(){
  const location = useLocation();
  return(
    <>
    {(location.pathname !== '/') && <TitleBar/>}
    <Routes>
      <Route path="/orders" element={<Orders />} />
      <Route path="/" element={<Login />} />
      <Route path="/transaction" element={<Transaction />} />
      <Route path="/inventory" element={<Inventory/>} />
      <Route path="/productlist" element={<Productlist/>} />
      <Route path="/lowstock" element={<LowStock/>} />
      <Route path="/addproduct" element={<AddProduct/>} />
      <Route path="/editproduct/:productId" element={<EditProduct/>} />
      <Route path="/newinventory/:productId" element={<NewInventory/>} />
      <Route path="/addsupplier" element={<AddSupplier/>} />
      <Route path="/listsuppliers" element={<ListSuppliers/>} />
      <Route path="/purchasehistory" element={<PurchaseHistory/>} />
      <Route path="/altercategories" element={<AlterCategories/>} />
      <Route path="/handleexpiredproducts" element={<HandleExpiredProducts/>} />
      <Route path="/productreturn" element={<ProductReturn/>} />
      <Route path="/reports" element={<Reports/>} />
      <Route path="/accountsettings" element={<AccountSetings/>} />
    </Routes>
    </>
  );
}

function App() {
  return (
    
    <BrowserRouter>
        <MainContent/>
    </BrowserRouter>
  );
}

export default App;