import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AuthProvider from "../src/components/context/AuthContext";
import CartProvider from "../src/components/context/CartContext";
import Home from "../src/components/Pages/Home";
import Login from "../src/components/Pages/Login";
import ForgotPassword from "./components/ForgotPassword";
import { ToastContainer } from "react-toastify";
import KidsWears from "./components/Pages/Products/KidsWears";
import MensWears from "./components/Pages/Products/MensWears";
import WomensWears from "./components/Pages/Products/WomensWears";
import FootWears from "./components/Pages/Products/FootWears";
import Cart from "./components/Cart";
import Fabrics from "./components/Pages/Products/Fabrics";
import CheckOut from "./components/Pages/CheckOut";
import ProtectedRoutes from "./components/ProtectedRoutes"; 
import LogoutPage from "./components/Pages/LogoutButton";
import Paystack from "./components/Pages/Paystack"
import Orders from "./components/Pages/Orders";


function App() {
  return (
    <>
      <AuthProvider>
        <CartProvider>
          <Router>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/KidsWears" element={<KidsWears />} />
              <Route path="/MensWears" element={<MensWears />} />
              <Route path="/WomensWears" element={<WomensWears />} />
              <Route path="/Footwears" element={<FootWears />} />
              <Route path="/Fabrics" element={<Fabrics />} />
              <Route path="/login" element={<Login />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/Profile" element={<LogoutPage />} />
              <Route path="/reset" element={<ForgotPassword />} />
              <Route path="/Paystack" element={<Paystack />} />

              {/* Protected routes */}
              <Route
                path="/Cart"
                element={
                  <ProtectedRoutes>
                    <Cart />
                  </ProtectedRoutes>
                }
              />
              <Route
                path="/Checkout"
                element={
                  <ProtectedRoutes>
                    <CheckOut />
                  </ProtectedRoutes>
                }
              />
            </Routes>
          </Router>
        </CartProvider>
      </AuthProvider>
      <ToastContainer />
    </>
  );
}

export default App;
