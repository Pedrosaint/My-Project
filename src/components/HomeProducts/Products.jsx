import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ContextTheme";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../Firebase/Firebase"; // Ensure this path is correct
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import Modal from "../Modal";

const Products = () => {
  const { theme } = useContext(ThemeContext);
  const darkMode = theme === "dark";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setModalOpen] = useState(false); // For modal visibility
  const [selectedProduct, setSelectedProduct] = useState(null); // For selected product

  useEffect(() => {
    // Fetch products with category "Womenswears"
    const fetchProducts = async () => {
      try {
        const productsCollection = collection(db, "newproducts"); // Collection name is "newproducts"
        const womenswearsQuery = query(
          productsCollection,
          where("category", "==", "Fabrics")
        ); // Filter by category
        const productDocs = await getDocs(womenswearsQuery);
        const productList = productDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("Fetched Womenswears Products:", productList); // Debugging
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const navigate = useNavigate();
  const handleview = () => {
    navigate("/Womenswears");
  };

  // Handle modal opening
  const openModal = (product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  // Handle modal closing
  const closeModal = () => {
    setSelectedProduct(null);
    setModalOpen(false);
  };

  // Handle adding product to cart
    const handleAddToCart = async (cartDetails) => {
      try {
        await addDoc(collection(db, "cart"), {
          ...cartDetails,
          addedAt: new Date(),
        });
        console.log("Product added to cart successfully");
        closeModal();
      } catch (error) {
        console.error("Error adding product to cart: ", error);
      }
    };

  // Only display up to 5 products on the homepage
  const displayedProducts = products.slice(0, 5);

  return (
    <div className="dark:bg-gray-900 dark:text-white">
      <div className="container">
        {/* Header Section */}
        <div className="text-center mb-10 max-w-[600px] mx-auto">
          <p className="text-sm text-primary p-9">
            Top Selling Fabric Products for You
          </p>
          <h1 className="text-3xl font-bold -mt-7">Quality Fabrics</h1>
          <p className="text-sm text-gray-400 mt-4">
            Explore our wide range of Fabric. Shop now and enjoy premium
            quality.
          </p>
        </div>

        {/* Body Section */}
        <div>
          {loading ? (
            <div className="flex justify-center items-center">
              <ClipLoader color="#36d7b7" size={50} />
            </div>
          ) : displayedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5 p-4">
              {displayedProducts.map((product) => (
                <motion.div
                  whileHover={{
                    y: 5,
                    boxShadow: darkMode
                      ? "0 25px 50px -12px rgba(255, 255, 255, 0.1)"
                      : "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  }}
                  key={product.id}
                  className="space-y-3 cursor-pointer rounded-lg p-4"
                >
                  <img
                    src={product.image || "https://via.placeholder.com/150"}
                    alt={product.name || "Product"}
                    className="h-[220px] w-[150px] object-cover rounded-md"
                  />
                  <div className="text-center">
                    <h3 className="font-semibold">
                      {product.name || "No Name"}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {product.description || "No Description"}
                    </p>
                    <p className="text-sm font-bold">
                      {product.price
                        ? `${product.price}`
                        : "Price not available"}
                    </p>
                  </div>
                  <button
                    className="text-center ml-5 cursor-pointer bg-primary text-white py-1 px-5 rounded-md mb-2 hover:translate-x-2 duration-300 ease-out"
                    onClick={() => openModal(product)}
                  >
                    Order Now
                  </button>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 pb-6">
              No womenswear products available.
            </div>
          )}
          {/* View All Button */}
          {products.length > 5 && (
            <div className="flex justify-center">
              <button
                onClick={handleview}
                className="text-center mt-10 cursor-pointer bg-primary text-white py-1 px-5 rounded-md mb-7"
              >
                View All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal Component */}
            <Modal
              isOpen={isModalOpen}
              onClose={closeModal}
              productId={selectedProduct?.id} // Pass only the product ID
              onAddToCart={handleAddToCart} // Pass callback to handle cart addition
            />
    </div>
  );
};

export default Products;
