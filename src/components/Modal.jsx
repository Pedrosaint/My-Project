import React, { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { ClipLoader } from "react-spinners";
import { doc, getDoc, updateDoc } from "firebase/firestore"; 
import { db } from "./Firebase/Firebase"; 
import { CartContext } from "../components/context/CartContext";


const Modal = ({ isOpen, onClose, productId }) => {
  const { dispatch } = useContext(CartContext); // Access the dispatch function from CartContext
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(""); // For current input
  const [previousYards, setPreviousYards] = useState(0); // To track the previous yards entered
  const [initialStock, setInitialStock] = useState(0); // To store the initial stock value
  const [loading, setLoading] = useState(false);
  const [selectedColor, setSelectedColor] = useState("");

  // Fetch product details when the modal is open
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (productId && isOpen) {
        setLoading(true);
        try {
          const docRef = doc(db, "newproducts", productId); // Adjust 'newproducts' to your collection name
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const productData = docSnap.data();
            setProduct(productData);
            setInitialStock(productData.stock); // Store the initial stock value
          } else {
            console.error("No product found with ID:", productId);
          }
        } catch (error) {
          console.error("Error fetching product details:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchProductDetails();
  }, [productId, isOpen]);

  // Reset states and revert stock when the modal closes
  const handleClose = async () => {
    if (product && product.stock !== initialStock) {
      try {
        const productRef = doc(db, "newproducts", productId);
        await updateDoc(productRef, { stock: initialStock }); // Revert stock to initial value
        setProduct((prev) => ({ ...prev, stock: initialStock })); // Update local state
      } catch (error) {
        console.error("Error reverting stock on close:", error);
      }
    }
    setSelectedSize("");
    setPreviousYards(0); // Reset previous yards
    onClose();
  };

  // Handle yard input and stock update
  const handleYardsChange = async (e) => {
    const newYards = parseInt(e.target.value) || 0; // Parse new input or default to 0

    if (!newYards) {
      // If input is cleared, revert to initial stock
      if (product) {
        try {
          const productRef = doc(db, "newproducts", productId);
          await updateDoc(productRef, { stock: initialStock }); // Revert stock to initial value
          setProduct((prev) => ({ ...prev, stock: initialStock })); // Update local state
          setPreviousYards(0); // Reset previous yards
          setSelectedSize(""); // Reset input
        } catch (error) {
          console.error("Error reverting stock:", error);
        }
      }
      return;
    }

    if (product) {
      // Calculate the stock difference and update
      const revertedStock = product.stock + previousYards; // Revert stock to the original state
      const newStock = revertedStock - newYards; // Subtract new input

      if (newStock < 0) {
        alert("Insufficient stock!");
        return;
      }

      try {
        const productRef = doc(db, "newproducts", productId);
        await updateDoc(productRef, { stock: newStock }); // Update stock in Firebase
        setProduct((prev) => ({ ...prev, stock: newStock })); // Update local state
        setPreviousYards(newYards); // Update previous yards
        setSelectedSize(newYards); // Update current input
      } catch (error) {
        console.error("Error updating stock:", error);
      }
    }
  };

 const handleAddToCart = async () => {
   if (product.category === "Fabrics" && !selectedSize) {
     alert("Please enter the number of yards.");
     return;
   }

   if (product.category !== "Fabrics" && (!selectedSize || !selectedColor)) {
     alert("Please select both size and color.");
     return;
   }

   try {
     const selectedQuantity =
       product.category === "Fabrics" ? parseInt(selectedSize, 10) : 0;

     // Ensure sufficient stock is available
     if (selectedQuantity > product.stock) {
       alert("Insufficient stock available!");
       return;
     }

     // Reduce stock only once (when quantity is entered, not again when adding to cart)
     const newStock = product.stock - selectedQuantity;

     // Check if stock was updated already, if not, update Firebase stock (only the first time)
     if (initialStock === product.stock) {
       // Update stock in Firebase (this will happen only once when quantity is entered)
       const productRef = doc(db, "newproducts", productId);
       await updateDoc(productRef, { stock: newStock });
       setInitialStock(newStock); // Update the initial stock state for future use
     }

     // Dispatch action to add the item to the cart (doesn't affect stock again)
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        productId,
        size:
          product.category === "Fabrics"
            ? `${selectedSize} yards`
            : selectedSize, // Ensure clarity for fabrics
        color: selectedColor || null, // Set null if no color is selected
        stock: product.stock, // Pass the already reduced stock
        name: product.name, // Name of the product
        price: product.price, // Price per unit
        quantity: selectedQuantity, // Ensure quantity matches the entered value
      },
    });


     // Reset states for next time
     setSelectedSize("");
     setSelectedColor("");
     setPreviousYards(0);
     onClose(); // Close the modal
   } catch (error) {
     console.error("Error updating stock on add to cart:", error);
   }
 };


  // If the modal is not open, render nothing
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-80 lg:w-[50rem] lg:flex lg:gap-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-[10rem] w-full">
            <ClipLoader color="#36d7b7" size={40} />
          </div>
        ) : product ? (
          <>
            {/* Product Image Section */}
            <div className="w-full sm:w-3/4 md:w-1/2 lg:w-1/2">
              <h2 className="text-sm sm:text-lg font-bold mb-3">
                {product.name}
              </h2>
              <img
                src={product.image}
                alt={product.name}
                className="rounded-lg mb-3 w-full"
              />
              <div className="mb-3">
                <p className="text-sm sm:text-base font-medium">
                  Price: {product.price}
                </p>
                <p className="text-sm sm:text-base font-medium">
                  Stock: {product.stock || "N/A"}
                </p>
                <p className="text-sm sm:text-base font-medium">
                  Description: {product.description || "N/A"}
                </p>
              </div>
            </div>

            {/* Product Options Section */}
            <div className="lg:w-1/2">
              {product.category === "Fabrics" ? (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Enter Yards:</h3>
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter number of yards"
                    className="w-full px-4 py-2 border rounded dark:text-black outline-none"
                    value={selectedSize || ""} // Use empty string for initial value
                    onChange={handleYardsChange}
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <h3 className="font-medium mb-2">Select Size:</h3>
                  <div className="flex flex-wrap gap-2">
                    {(product.size
                      ? product.size.split(",").map((size) => size.trim())
                      : []
                    ).map((size) => (
                      <button
                        key={size}
                        className={`px-4 py-2 border rounded ${
                          selectedSize === size
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-black"
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              <div className="mb-4">
                <h3 className="font-medium mb-2">Select Color:</h3>
                <div className="flex flex-wrap gap-2">
                  {(product.colors
                    ? product.colors.split(",").map((color) => color.trim())
                    : []
                  ).map((color) => (
                    <button
                      key={color}
                      className={`px-4 py-2 border rounded ${
                        selectedColor === color
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between">
                <button
                  className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                  onClick={handleClose}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center">Product not found.</div>
        )}
      </div>
    </div>
  );
};

// PropTypes Validation
Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  productId: PropTypes.string, // This can be null initially
};

export default Modal;
