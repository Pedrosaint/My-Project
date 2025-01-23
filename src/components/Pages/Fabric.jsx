// import React, { useContext, useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { ThemeContext } from "../context/ContextTheme";
// import { FaStar } from "react-icons/fa";
// import { collection, query, where, getDocs,} from "firebase/firestore";
// import { db } from "../Firebase/Firebase"; // Update this path to your Firebase configuration file
// import { ClipLoader } from "react-spinners";
// import BuyButton from "../BuyButtin";

// const Fabric = () => {
//   const { theme } = useContext(ThemeContext);
//   const darkMode = theme === "dark";

//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch products from Firestore
//   useEffect(() => {
//     const fetchFabricsProducts = async () => {
//       try {
//         const q = query(
//           collection(db, "newproducts"),
//           where("category", "==", "Fabrics")
//         );
//         const querySnapshot = await getDocs(q);

//         const FabricsProducts = querySnapshot.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setProducts(FabricsProducts);
//       } catch (error) {
//         console.error("Error fetching Fabrics products: ", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchFabricsProducts();
//   }, []);

//   return (
//     <div className="min-h-[550px] sm:min-h-[650px] mt-20 relative overflow-hidden bg-gray-100 dark:bg-gray-950 dark:text-white">
//       <div>
//         <h1 className="m-6 font-bold text-2xl">Fabrics</h1>
//       </div>
//       {/* Body Section */}
//       <div>
//         {loading ? (
//           <div className="flex flex-col items-center justify-center h-screen">
//             <ClipLoader color="#36d7b7" size={50} />
//           </div>
//         ) : products.length === 0 ? (
//           <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
//             No Fabrics available now.
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5 p-4">
//             {products.map((product) => (
//                 <motion.div
//                   key={product.id}
//                   className="cursor-pointer rounded-lg"
//                 >
//                   <img
//                     src={product.image || "default-image-path.jpg"}
//                     alt={product.name}
//                     className="h-[220px] w-[150px] object-cover rounded-md"
//                   />
//                   <div>
//                     <h3 className="font-semibold p-1">{product.name}</h3>
//                     <p className="text-sm text-gray-600 p-1 dark:text-white">
//                       {product.description || "No description"}
//                     </p>
//                     <p className="text-xl text-gray-600 p-1 font-semibold dark:text-white">
//                       {product.price
//                         ? `${product.price}`
//                         : "Price not available"}
//                     </p>
//                     <div className="flex items-center gap-1 p-1">
//                       <FaStar className="text-yellow-400" />
//                       <span>{product.rating || "4.0"}</span>
//                     </div>
//                   </div>
//                   <BuyButton product={product} />
//                 </motion.div>
//               ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Fabric;







import React, { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ThemeContext } from "../context/ContextTheme";
import { FaStar } from "react-icons/fa";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../Firebase/Firebase";
import { ClipLoader } from "react-spinners";
import BuyButton from "../BuyButtin";
import { useLocation } from "react-router-dom";

const Fabric = () => {
  const { theme } = useContext(ThemeContext);
  const darkMode = theme === "dark";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const location = useLocation();
  const [sortedProducts, setSortedProducts] = useState([]);

  useEffect(() => {
    const fetchFabricsProducts = async () => {
      try {
        const q = query(
          collection(db, "newproducts"),
          where("category", "==", "Fabrics")
        );
        const querySnapshot = await getDocs(q);

        const FabricsProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProducts(FabricsProducts);

        // Check if searchQuery exists in location.state
        const searchQuery = location.state?.searchQuery || "";
        console.log("Search Query:", searchQuery);

        if (searchQuery) {
          const queryLowerCase = searchQuery.toLowerCase();

          // Sort products to prioritize items matching the search query
          const sorted = [...FabricsProducts].sort((a, b) => {
            const startsWithA = a.name.toLowerCase().startsWith(queryLowerCase);
            const startsWithB = b.name.toLowerCase().startsWith(queryLowerCase);

            if (startsWithA && !startsWithB) return -1;
            if (!startsWithA && startsWithB) return 1;
            return 0;
          });

          setSortedProducts(sorted);
        } else {
          setSortedProducts(FabricsProducts);
        }
      } catch (error) {
        console.error("Error fetching Fabrics products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFabricsProducts();
  }, [location.state]);

  return (
    <div className="min-h-[550px] sm:min-h-[650px] mt-20 relative overflow-hidden bg-gray-100 dark:bg-gray-950 dark:text-white">
      <div>
        <h1 className="m-6 font-bold text-2xl">Fabrics</h1>
      </div>
      {/* Body Section */}
      <div>
        {loading ? (
          <div className="flex flex-col items-center justify-center h-screen">
            <ClipLoader color="#36d7b7" size={50} />
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-10">
            No Fabrics available now.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 place-items-center gap-5 p-4">
            {sortedProducts.map((product) => (
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

export default Fabric;
