import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ContextTheme";
import { FaStar } from "react-icons/fa";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { db } from "../Firebase/Firebase"; // Update this path to your Firebase configuration file
import { ClipLoader } from "react-spinners";
import Modal from "../../components/Modal"; // Ensure you have the Modal component in this path

const Foot = () => {
  const { theme } = useContext(ThemeContext);
  const darkMode = theme === "dark";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setModalOpen] = useState(false); // For modal visibility
  const [selectedProduct, setSelectedProduct] = useState(null); // For selected product

  // Fetch products from Firestore
  useEffect(() => {
    const fetchFootwearsProducts = async () => {
      try {
        const q = query(
          collection(db, "newproducts"),
          where("category", "==", "Footwears")
        );
        const querySnapshot = await getDocs(q);

        const FootwearsProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          isLoading: true,
        }));

        setProducts(FootwearsProducts);

        // Simulate a staggered loading effect
        FootwearsProducts.forEach((product, index) => {
          setTimeout(() => {
            setProducts((prev) =>
              prev.map((p) =>
                p.id === product.id ? { ...p, isLoading: false } : p
              )
            );
          }, index * 500);
        });
      } catch (error) {
        console.error("Error fetching Footwears products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFootwearsProducts();
  }, []);

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

  return (
    <div className="min-h-[550px] sm:min-h-[650px] mt-20 relative overflow-hidden bg-gray-100 dark:bg-gray-950 dark:text-white">
      <div>
        <h1 className="m-6 font-bold text-2xl">Foot Wears</h1>
      </div>
      {/* Body Section */}
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <ClipLoader color="#36d7b7" size={50} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            No Foot wears available now.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5 p-4">
            {products.map((product) =>
              product.isLoading ? (
                <div
                  key={product.id}
                  className="flex justify-center items-center h-[250px] w-[180px]"
                >
                  <ClipLoader color="#36d7b7" size={40} />
                </div>
              ) : (
                <motion.div
                  data-aos="fade-up"
                  data-aos-delay="100"
                  key={product.id}
                  className="space-y-3 cursor-pointer rounded-lg"
                >
                  <img
                    src={product.image || "default-image-path.jpg"}
                    alt={product.name}
                    className="h-[220px] w-[150px] object-cover rounded-md"
                  />
                  <div>
                    <h3 className="font-semibold p-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 p-1 dark:text-white">
                      {product.description || "No description"}
                    </p>
                    <p className="text-xl text-gray-600 p-1 font-semibold dark:text-white">
                      {product.price
                        ? `${product.price}`
                        : "Price not available"}
                    </p>
                    <div className="flex items-center gap-1 p-1">
                      <FaStar className="text-yellow-400" />
                      <span>{product.rating || "4.0"}</span>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <button
                      className="text-center cursor-pointer bg-primary text-white py-1 px-5 rounded-md mb-2 hover:translate-x-2 duration-300 ease-out"
                      onClick={() => openModal(product)}
                    >
                      Buy
                    </button>
                  </div>
                </motion.div>
              )
            )}
          </div>
        )}
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

export default Foot;
