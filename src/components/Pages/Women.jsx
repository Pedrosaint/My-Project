import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ContextTheme";
import { FaStar } from "react-icons/fa";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { ClipLoader } from "react-spinners";
import BuyButton from "../BuyButtin"; // Ensure the correct path

const Women = () => {
  const { theme } = useContext(ThemeContext);
  const darkMode = theme === "dark";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWomenswearsProducts = async () => {
      try {
        const q = query(
          collection(db, "newproducts"),
          where("category", "==", "Womenswears")
        );
        const querySnapshot = await getDocs(q);

        const WomenswearsProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(WomenswearsProducts);
      } catch (error) {
        console.error("Error fetching Footwears products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWomenswearsProducts();
  }, []);

  return (
    <div className="min-h-[550px] sm:min-h-[650px] mt-20 relative overflow-hidden bg-gray-100 dark:bg-gray-950 dark:text-white">
      <div>
        <h1 className="m-6 font-bold text-2xl">Womens Wears</h1>
      </div>
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <ClipLoader color="#36d7b7" size={50} />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            No Womenswears available now.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5 p-4">
            {products.map((product) => (
              <motion.div
                key={product.id}
                className="cursor-pointer rounded-lg"
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
                    {product.price ? `${product.price}` : "Price not available"}
                  </p>
                  <div className="flex items-center gap-1 p-1">
                    <FaStar className="text-yellow-400" />
                    <span>{product.rating || "4.0"}</span>
                  </div>
                </div>
                <BuyButton product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Women;
