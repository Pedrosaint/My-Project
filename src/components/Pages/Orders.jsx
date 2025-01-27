import React, { useEffect, useState } from "react";
import { db } from "../Firebase/Firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { LuShoppingBag } from "react-icons/lu";
import { ClipLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import Footer from "../HomeProducts/Footer";
import Navbar from "../common/Navbar";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleEmptyOrder = () => {
    navigate("/");
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          // Redirect unauthenticated users to the login page
          navigate("/login");
          return;
        }

        // Query Firestore for the user's orders
        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(ordersQuery);

        const userOrders = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Include document ID if needed
          ...doc.data(),
        }));

        setOrders(userOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
        alert("Failed to fetch orders. Please try again later.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <ClipLoader color="#36d7b7" size={50} />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500">
        <LuShoppingBag size={70} color="gray" />
        <p className="p-3">No orders found.</p>
        <button
          onClick={handleEmptyOrder}
          className="border p-3 rounded hover:bg-gray-200 text-black"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="mx-auto p-4 pt-28 dark:bg-gray-950">
        <h1 className="text-2xl font-bold mb-4 text-black dark:text-white">Your Orders</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ">
          {orders.map((order) => (
            <div
              key={order.id}
              className="border rounded-lg p-4 shadow-md dark:bg-gray-800 dark:text-white"
            >
              {/* Loop through cart items in the order */}
              {order.cartItems.map((item, index) => (
                <div key={index} className="mb-4 border-b pb-4">
                  <h2 className="font-semibold text-lg">{item.name}</h2>
                  <p>Price: {item.price}</p>
                  <p>Color: {item.color || "N/A"}</p>
                  <p>Quantity: {item.quantity}</p>
                  <p>Size: {item.size || "N/A"}</p>
                </div>
              ))}

              {/* Display Total Amount */}
              <p className="text-md text-gray-600 dark:text-gray-400 font-bold">
                Total Amount: {order.totalAmount.toLocaleString("en-NG")}
              </p>

              {/* Format Shipping Address */}
              {order.shippingAddress && (
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Shipping Address:{" "}
                  {`${order.shippingAddress.fullName}, ${order.shippingAddress.address}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.country}, ZIP; ${order.shippingAddress.zipCode}`}
                </p>
              )}

              {/* Order Date */}
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Ordered on:{" "}
                {order.date
                  ? new Date(order.date).toLocaleDateString()
                  : "Unknown"}
              </p>

              {/* Order Status */}
              <p
                className={`text-sm font-medium ${
                  order.status === "Delivered"
                    ? "text-green-600 dark:text-green-400"
                    : order.status === "Processing"
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-yellow-600 dark:text-yellow-400"
                }`}
              >
                Status: {order.status || "Pending"}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Orders;
