import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Navbar from "../common/Navbar";
import Footer from "../HomeProducts/Footer";
import { LuLogOut } from "react-icons/lu";
import { IoCartOutline } from "react-icons/io5";
import { IoMdCall } from "react-icons/io";
import { FiShoppingBag } from "react-icons/fi";
import LoadingText from "../LoadingText";

const LogoutPage = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext); // Access logout function from context
  const [user, setUser] = useState(null); // State to store user information

  useEffect(() => {
    const auth = getAuth(); // Initialize Firebase Auth
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName || "Customer",
          email: currentUser.email,
          phone: currentUser.phoneNumber || "N/A", // Include phone number if available
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup subscription on component unmount
  }, []);

  const handleLogout = () => {
    logout(); // Log the user out using AuthContext
    navigate("/"); // Redirect to the home page
  };

  const handleViewCart = () => {
    navigate("/cart"); // Redirect to the cart page
  };

  const handleViewOrders = () => {
    navigate("/Orders"); // Redirect to the orders page
  };

  const handleCallSupport = () => {
    window.open("tel:+2349019617300"); // Opens the phone dialer with the support number
  };

    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
          <div className="bg-white dark:bg-gray-800 p-7 rounded-lg shadow-lg w-full max-w-4xl m-5">
            {/* Profile Details */}
            {user ? (
              <div className="flex flex-col items-center text-center mb-5">
                <div className="bg-red-500 text-white dark:text-black rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-black dark:text-white">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-white">
                    {user.email}
                  </p>
                  {user.phone !== "N/A" && (
                    <p className="text-sm text-gray-500">{user.phone}</p>
                  )}
                </div>
              </div>
            ) : (
              <LoadingText />
            )}

            {/* Buttons */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <button
                onClick={handleViewOrders}
                className="bg-blue-900 text-white py-2 px-4 rounded-lg text-lg font-semibold hover:bg-blue-800 flex items-center justify-center space-x-2"
              >
                <FiShoppingBag size={30} />
                <span> View Orders</span>
              </button>
              <button
                onClick={handleViewCart}
                className="bg-blue-900 text-white py-2 px-4 rounded-lg text-lg font-semibold hover:bg-blue-800 flex items-center justify-center space-x-2"
              >
                <IoCartOutline size={30} />
                <span>View Cart</span>
              </button>
              <button
                onClick={handleCallSupport}
                className="bg-gray-200 text-black py-2 px-4 rounded-lg text-lg font-semibold hover:bg-gray-300 flex items-center justify-center space-x-2"
              >
                <IoMdCall size={30} />
                <span>Call Support</span>
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white py-2 px-4 rounded-lg text-lg font-semibold hover:bg-red-600 flex items-center justify-center space-x-2"
              >
                <LuLogOut size={30} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </>
    );
};

export default LogoutPage;
