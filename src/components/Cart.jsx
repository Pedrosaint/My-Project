// import React, { useContext } from "react";
// import { CartContext } from "../components/context/CartContext";
// import Navbar from "./common/Navbar";
// import Subscribe from "./HomeProducts/Subscribe";
// import Footer from "./HomeProducts/Footer";
// import { useNavigate } from "react-router-dom";
// import { doc, updateDoc } from "firebase/firestore";
// import { db } from "./Firebase/Firebase";
// import { LuShoppingBag } from "react-icons/lu";
// import { toast } from "react-toastify";

// const Cart = () => {
//   const navigate = useNavigate();
//   const { cart, dispatch } = useContext(CartContext);

//   // Handle Checkout
//   const handleCheckout = () => {
//     navigate("/Checkout");
//   };

//   //-------------------------------------------------- Handle Quantity Update
//   const handleQuantityChange = async (productId, newQuantity) => {
//     // Convert the input to a number if it's valid; otherwise, default to an empty string
//     const parsedQuantity = newQuantity === "" ? "" : parseInt(newQuantity, 10);

//     if (parsedQuantity === "" || parsedQuantity > 0) {
//       const updatedCart = cart.map((item) => {
//         if (item.productId === productId) {
//           if (item.category === "Fabrics") {
//             // Only update quantity for Fabrics
//             return {
//               ...item,
//               quantity: parsedQuantity, // Allow empty or valid numbers
//             };
//           }

//           // Non-Fabric logic: Update stock and quantity
//           const currentStock = item.stock || 0;
//           const revertedStock = currentStock + item.quantity; // Revert to original stock
//           const newStock =
//             parsedQuantity === ""
//               ? revertedStock
//               : revertedStock - parsedQuantity; // Calculate new stock

//           if (newStock < 0) {
//             toast.error("Insufficient stock!");
//             return item; // Do not update if stock is insufficient
//           }

//           // Update stock in Firebase for non-Fabric items
//           if (parsedQuantity !== "") {
//             const productRef = doc(db, "newproducts", productId);
//             updateDoc(productRef, { stock: newStock }).catch((error) =>
//               console.error("Error updating stock:", error)
//             );
//           }

//           return {
//             ...item,
//             quantity: parsedQuantity,
//             stock: newStock, // Update stock only for non-Fabric items
//           };
//         }
//         return item;
//       });

//       // Update the cart context with the new state
//       dispatch({ type: "SET_CART", payload: updatedCart });
//     }
//   };

  
//   //---------------------------------------------- Handle Product Removal
//   const handleRemove = async (productId) => {
//     const productToRemove = cart.find((item) => item.productId === productId);

//     if (productToRemove) {
//       const {
//         stock,
//         quantity = 0,
//         size = "0 yards",
//         category,
//       } = productToRemove;
//       const isFabrics = category === "Fabrics";

//       const restoredStock = isFabrics
//         ? stock + parseFloat(size.replace(" yards", ""))
//         : stock + quantity;

//       try {
//         const productRef = doc(db, "newproducts", productId);
//         await updateDoc(productRef, { stock: restoredStock });

//         dispatch({ type: "REMOVE_FROM_CART", payload: productId });

//         console.log("Stock successfully restored:", restoredStock);
//       } catch (error) {
//         console.error("Error restoring stock on remove:", error);
//       }
//     }
//   };

//   // Calculate Total
//   const calculateTotal = () => {
//     const total = cart
//       .reduce((total, item) => {
//         const itemTotal = item.size.includes("yards")
//           ? parseFloat(
//               item.price.replace("₦", "").replace(/\s/g, "").replace(/,/g, "")
//             ) * parseFloat(item.size)
//           : parseFloat(
//               item.price.replace("₦", "").replace(/\s/g, "").replace(/,/g, "")
//             ) * item.quantity;
//         return total + itemTotal;
//       }, 0)
//       .toFixed(2);

//     return `${parseFloat(total).toLocaleString()}`;
//   };

//   const HandleEmptyCart = () => {
//     navigate("/");
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="p-4 pt-28 dark:bg-gray-950 dark:text-white">
//         <h1 className="text-2xl font-bold mb-4 text-center">Shopping Cart</h1>
//         {cart.length === 0 ? (
//           <div className="flex flex-col items-center justify-center h-screen text-gray-500">
//             <LuShoppingBag size={70} color="gray" />
//             <p className="p-3">Your cart is empty.</p>
//             <button
//               onClick={HandleEmptyCart}
//               className="border p-3 rounded hover:bg-gray-200 text-black dark:text-white dark:hover:bg-gray-800"
//             >
//               Continue Shopping
//             </button>
//           </div>
//         ) : (
//           <div className="flex flex-col lg:flex-row gap-8">
//             <div className="flex-1">
//               {cart.map((item, index) => (
//                 <div
//                   key={index}
//                   className="flex items-center justify-between border-b pb-4 mb-4"
//                 >
//                   <div>
//                     <h2 className="text-lg font-bold">{item.name}</h2>
//                     <p>
//                       {item.category === "Fabrics"
//                         ? `Size (Yards): ${item.size || "N/A"}`
//                         : `Size: ${item.size || "N/A"}`}
//                     </p>
//                     <p>Color: {item.color || "N/A"}</p>
//                     <p>Price: {item.price}</p>
//                     <p>Available Stock: {item.stock || "N/A"}</p>
//                     {!item.size.includes("yards") && (
//                       <div className="flex items-center space-x-2 mt-2">
//                         <label htmlFor={`quantity-${index}`} className="mr-2">
//                           Quantity:
//                         </label>
//                         <input
//                           id={`quantity-${index}`}
//                           type="number"
//                           min="1"
//                           max={item.stock}
//                           value={item.quantity === "" ? "" : item.quantity}
//                           onChange={(e) =>
//                             handleQuantityChange(item.productId, e.target.value)
//                           }
//                           className="w-16 border rounded px-2 py-1 dark:bg-gray-900 dark:text-white"
//                         />
//                       </div>
//                     )}
//                   </div>
//                   <button
//                     className="text-red-50 bg-red-600 rounded-md hover:bg-red-400 hover:text-white p-2"
//                     onClick={() => handleRemove(item.productId)}
//                   >
//                     Remove
//                   </button>
//                 </div>
//               ))}
//             </div>

//             <div className="w-full lg:w-1/3 p-4 dark:shadow-gray-700 rounded shadow-lg">
//               <h2 className="text-xl font-bold mb-4">Order Summary</h2>
//               <div className="space-y-2">
//                 <div className="flex justify-between">
//                   <p>Subtotal</p>
//                   <p>₦{calculateTotal()}</p>
//                 </div>
//                 <div className="flex justify-between">
//                   <p>Shipping</p>
//                   <p>Free</p>
//                 </div>
//                 <div className="flex justify-between font-bold">
//                   <p>Total</p>
//                   <p>₦{calculateTotal()}</p>
//                 </div>
//               </div>
//               <button
//                 className="w-full bg-blue-500 text-white py-2 mt-4 rounded hover:bg-blue-600"
//                 onClick={handleCheckout}
//               >
//                 Proceed to Checkout
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//       <Subscribe />
//       <Footer />
//     </>
//   );
// };

// export default Cart;




import React, { useContext, useEffect } from "react";
import { CartContext } from "../components/context/CartContext";
import { AuthContext } from "../components/context/AuthContext";
import Navbar from "./common/Navbar";
import Subscribe from "./HomeProducts/Subscribe";
import Footer from "./HomeProducts/Footer";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./Firebase/Firebase";
import { LuShoppingBag } from "react-icons/lu";
import { toast } from "react-toastify";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, dispatch } = useContext(CartContext);
  const { authUser } = useContext(AuthContext);

  // Initialize cart for guest users
  useEffect(() => {
    if (!authUser) {
      const guestCart = JSON.parse(localStorage.getItem("guestCart")) || [];
      dispatch({ type: "SET_CART", payload: guestCart });
    }
  }, [authUser, dispatch]);

  // Handle Checkout
  const handleCheckout = () => {
    if (!authUser) {
      toast.error("Please log in to proceed to checkout.");
      navigate("/login");
      return;
    }
    navigate("/Checkout");
  };

  // Handle Quantity Update
  const handleQuantityChange = async (productId, newQuantity) => {
    const parsedQuantity = newQuantity === "" ? "" : parseInt(newQuantity, 10);

    if (parsedQuantity === "" || parsedQuantity > 0) {
      const updatedCart = cart.map((item) => {
        if (item.productId === productId) {
          if (item.category === "Fabrics") {
            return {
              ...item,
              quantity: parsedQuantity,
            };
          }

          const currentStock = item.stock || 0;
          const revertedStock = currentStock + item.quantity;
          const newStock =
            parsedQuantity === ""
              ? revertedStock
              : revertedStock - parsedQuantity;

          if (newStock < 0) {
            toast.error("Insufficient stock!");
            return item;
          }

          if (authUser && parsedQuantity !== "") {
            const productRef = doc(db, "newproducts", productId);
            updateDoc(productRef, { stock: newStock }).catch((error) =>
              console.error("Error updating stock:", error)
            );
          }

          return {
            ...item,
            quantity: parsedQuantity,
            stock: newStock,
          };
        }
        return item;
      });

      if (authUser) {
        dispatch({ type: "SET_CART", payload: updatedCart });
      } else {
        localStorage.setItem("guestCart", JSON.stringify(updatedCart));
        dispatch({ type: "SET_CART", payload: updatedCart });
      }
    }
  };

  // Handle Product Removal
  const handleRemove = async (productId) => {
    const updatedCart = cart.filter((item) => item.productId !== productId);
    const productToRemove = cart.find((item) => item.productId === productId);

    if (productToRemove) {
      const restoredStock =
        productToRemove.category === "Fabrics"
          ? productToRemove.stock +
            parseFloat(productToRemove.size.replace(" yards", ""))
          : productToRemove.stock + productToRemove.quantity;

      if (authUser) {
        try {
          const productRef = doc(db, "newproducts", productId);
          await updateDoc(productRef, { stock: restoredStock });
        } catch (error) {
          console.error("Error restoring stock on remove:", error);
        }
      }

      if (authUser) {
        dispatch({ type: "REMOVE_FROM_CART", payload: productId });
      } else {
        localStorage.setItem("guestCart", JSON.stringify(updatedCart));
        dispatch({ type: "SET_CART", payload: updatedCart });
      }
    }
  };

  // Calculate Total
  const calculateTotal = () => {
    const total = cart
      .reduce((total, item) => {
        const itemTotal = item.size.includes("yards")
          ? parseFloat(
              item.price.replace("₦", "").replace(/\s/g, "").replace(/,/g, "")
            ) * parseFloat(item.size)
          : parseFloat(
              item.price.replace("₦", "").replace(/\s/g, "").replace(/,/g, "")
            ) * item.quantity;
        return total + itemTotal;
      }, 0)
      .toFixed(2);

    return `${parseFloat(total).toLocaleString()}`;
  };

  const HandleEmptyCart = () => {
    navigate("/");
  };

  return (
    <>
      <Navbar />
      <div className="p-4 pt-28 dark:bg-gray-950 dark:text-white">
        <h1 className="text-2xl font-bold mb-4 text-center">Shopping Cart</h1>
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-screen text-gray-500">
            <LuShoppingBag size={70} color="gray" />
            <p className="p-3">Your cart is empty.</p>
            <button
              onClick={HandleEmptyCart}
              className="border p-3 rounded hover:bg-gray-200 text-black dark:text-white dark:hover:bg-gray-800"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="flex-1">
              {cart.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-4 mb-4"
                >
                  <div>
                    <h2 className="text-lg font-bold">{item.name}</h2>
                    <p>
                      {item.category === "Fabrics"
                        ? `Size (Yards): ${item.size || "N/A"}`
                        : `Size: ${item.size || "N/A"}`}
                    </p>
                    <p>Color: {item.color || "N/A"}</p>
                    <p>Price: {item.price}</p>
                    <p>Available Stock: {item.stock || "N/A"}</p>
                    {!item.size.includes("yards") && (
                      <div className="flex items-center space-x-2 mt-2">
                        <label htmlFor={`quantity-${index}`} className="mr-2">
                          Quantity:
                        </label>
                        <input
                          id={`quantity-${index}`}
                          type="number"
                          min="1"
                          max={item.stock}
                          value={item.quantity === "" ? "" : item.quantity}
                          onChange={(e) =>
                            handleQuantityChange(item.productId, e.target.value)
                          }
                          className="w-16 border rounded px-2 py-1 dark:bg-gray-900 dark:text-white"
                        />
                      </div>
                    )}
                  </div>
                  <button
                    className="text-red-50 bg-red-600 rounded-md hover:bg-red-400 hover:text-white p-2"
                    onClick={() => handleRemove(item.productId)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>

            <div className="w-full lg:w-1/3 p-4 dark:shadow-gray-700 rounded shadow-lg">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <p>Subtotal</p>
                  <p>₦{calculateTotal()}</p>
                </div>
                <div className="flex justify-between">
                  <p>Shipping</p>
                  <p>Free</p>
                </div>
                <div className="flex justify-between font-bold">
                  <p>Total</p>
                  <p>₦{calculateTotal()}</p>
                </div>
              </div>
              <button
                className="w-full bg-blue-500 text-white py-2 mt-4 rounded hover:bg-blue-600"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
      <Subscribe />
      <Footer />
    </>
  );
};

export default Cart;
