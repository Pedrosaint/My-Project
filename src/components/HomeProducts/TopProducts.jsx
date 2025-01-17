import React, { useEffect, useState, useContext } from "react";
import { FaStar } from "react-icons/fa";
import { db } from "../Firebase/Firebase"; // Firebase config
import { collection, getDocs } from "firebase/firestore";
import Modal from "../../components/Modal";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ClipLoader } from "react-spinners";
import { useAuth } from "../../components/context/AuthContext"; // Import Auth Context
import { useNavigate } from "react-router-dom"; // For navigation

const TopProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { currentUser } = useAuth(); // Get user from context
  const navigate = useNavigate(); // Navigation hook

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const categories = [
          "Fabrics",
          "Menswears",
          "Womenswears",
          "Footwears",
          "kidswears",
        ];
        const fetchedProducts = [];

        const newProductsCollection = collection(db, "newproducts");
        const newProductsSnapshot = await getDocs(newProductsCollection);

        newProductsSnapshot.forEach((doc) => {
          const productData = doc.data();
          if (categories.includes(productData.category)) {
            fetchedProducts.push({ id: doc.id, ...productData });
          }
        });

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle modal opening
  const handleOrderNow = (product) => {
    if (!currentUser) {
      // Redirect to login if user is not authenticated
      navigate("/login");
    } else {
      // Open modal if user is logged in
      setSelectedProduct(product);
      setModalOpen(true);
    }
  };

  // Close modal
  const closeModal = () => {
    setSelectedProduct(null);
    setModalOpen(false);
  };

  // Slider settings
  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    slidesToShow: 3,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 640,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="dark:bg-gray-950 dark:text-white bg-gray-100 pt-3">
      <div className="container mx-auto">
        <div className="text-left mb-10 px-4">
          <p className="text-sm text-primary mt-6">
            Top Rated Products for you
          </p>
          <h1 className="text-3xl font-bold">Best Products</h1>
          <p className="text-sm text-gray-400">
            Discover our wide range of products.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <ClipLoader color="#36d7b7" size={50} />
          </div>
        ) : (
          <Slider {...settings}>
            {products.map((product) => (
              <div key={product.id} className="p-4 mb-5">
                <div
                  data-aos="zoom-in"
                  className="rounded-2xl bg-white dark:bg-gray-900 hover:bg-black/80 dark:hover:bg-primary hover:text-white relative shadow-xl duration-300 group max-w-[300px] mx-auto"
                >
                  {/* Image */}
                  <div className="h-[150px] w-[150px] flex items-center justify-center -translate-y-3 overflow-hidden bg-gray-500 rounded-xl mx-auto">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transform group-hover:scale-105 duration-300"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-4 text-center">
                    <div className="flex justify-center items-center gap-1 w-full mb-2">
                      <FaStar className="text-yellow-500" />
                      <FaStar className="text-yellow-500" />
                      <FaStar className="text-yellow-500" />
                      <FaStar className="text-yellow-500" />
                    </div>
                    <h1 className="text-xl font-bold">{product.name}</h1>
                    <p className="text-gray-500 group-hover:text-white duration-300 text-sm line-clamp-2">
                      {product.description}
                    </p>
                    <p className="text-lg font-bold text-primary group-hover:text-white">
                      {product.price}
                    </p>
                    <button
                      onClick={() => handleOrderNow(product)}
                      className="bg-primary hover:scale-105 duration-300 text-white py-1 px-4 rounded-full mt-4 group-hover:bg-white group-hover:text-primary"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>

      {/* Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        productId={selectedProduct?.id} // Pass only product ID
        onAddToCart={() => console.log("Add to cart")}
      />
    </div>
  );
};

export default TopProducts;
