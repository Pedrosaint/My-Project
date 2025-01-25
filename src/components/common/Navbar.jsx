import React, { useContext, useState, useEffect } from "react";
import Logo from "../../assets/img/shoppingbag_1.png";
import ThemeToggle from "../ThemeToggle";
import { Search, Menu, ArrowLeft, X } from "lucide-react";
import { FaShoppingCart } from "react-icons/fa";
import LoginButton from "../LoginButton";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../Firebase/Firebase";


const menu = [
  {
    id: 1,
    name: "Home",
    Link: "/",
  },
  {
    id: 2,
    name: "Fabric",
    Link: "/Fabrics",
  },
  {
    id: 3,
    name: "Kids Wear",
    Link: "/KidsWears",
  },
  {
    id: 4,
    name: "Mens Wear",
    Link: "/MensWears",
  },
  {
    id: 5,
    name: "Womens Wear",
    Link: "/WomensWears",
  },
  {
    id: 6,
    name: "Foot Wears",
    Link: "/Footwears",
  },
];

const Navbar = () => {
  const { cartCount } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCart = () => {
    navigate("/Cart");
    window.scroll(0, 0);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    // Fetch products from Firebase
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "newproducts"));
        const productList = [];
        querySnapshot.forEach((doc) => {
          productList.push({ id: doc.id, ...doc.data() });
        });
        setProducts(productList);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const handleClearSearch = () => {
    setSearchQuery(""); // Clear the search query
  };

  // // Handle Search Input
  // const handleSearch = (e) => {
  //   const query = e.target.value;
  //   setSearchQuery(query);

  //   // Filter products based on the search query
  //   const filtered = products.filter((product) =>
  //     product.name.toLowerCase().includes(query.toLowerCase())
  //   );
  //   console.log("Filtered Products:", filtered);
  //   console.log("All Products:", products);
  //   setFilteredProducts(filtered);
  // };
  // Handle Search Input
  // const handleSearch = (e) => {
  //   const query = e.target.value;
  //   setSearchQuery(query);

  //   // Filter products based on the search query
  //   const filtered = products
  //     .filter((product) =>
  //       product.name.toLowerCase().includes(query.toLowerCase())
  //     )
  //     .sort((a, b) => {
  //       // Prioritize items that start with the search query
  //       const startsWithA = a.name
  //         .toLowerCase()
  //         .startsWith(query.toLowerCase());
  //       const startsWithB = b.name
  //         .toLowerCase()
  //         .startsWith(query.toLowerCase());

  //       if (startsWithA && !startsWithB) return -1; // a comes first
  //       if (!startsWithA && startsWithB) return 1; // b comes first
  //       return 0; // keep original order otherwise
  //     });

  //   setFilteredProducts(filtered);
  // };

  // // Handle Navigation
  // const handleProductClick = (category) => {
  //   console.log("Navigating to category:", category);
  //   navigate(`/${category}`);
  //   setSearchQuery(""); // Clear search bar after navigation
  //   setFilteredProducts([]); // Clear dropdown after navigation
  // };

  // Handle Search Input
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Filter products based on the search query
    const filtered = products
      .filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase())
      )
      .sort((a, b) => {
        const startsWithA = a.name
          .toLowerCase()
          .startsWith(query.toLowerCase());
        const startsWithB = b.name
          .toLowerCase()
          .startsWith(query.toLowerCase());

        if (startsWithA && !startsWithB) return -1;
        if (!startsWithA && startsWithB) return 1;
        return 0;
      });

    setFilteredProducts(filtered);
  };

  // Handle Navigation
  const handleProductClick = (category, searchQuery) => {
    console.log("Navigating to category:", category);
    navigate(`/${category}`, { state: { searchQuery } }); // Pass the search query as state
    setSearchQuery(""); // Clear search bar after navigation
    setFilteredProducts([]); // Clear dropdown after navigation
  };

  return (
    <>
      <div className="">
        <div className="shadow-md bg-white dark:bg-gray-900 dark:text-white duration-200 z-40 fixed top-0 w-full">
          {/* Upper Navbar */}
          <div className="bg-primary/40 py-2">
            {/* -------------------------- Large Screen Layout -------------------------------*/}

            <div className="container mx-auto px-4 hidden sm:flex justify-between items-center">
              {/* Logo */}
              <div className="flex items-center gap-2">
                <a
                  href="#"
                  className="font-bold font-quicksand text-2xl sm:text-3xl flex gap-1"
                >
                  <img
                    src={Logo}
                    alt="Logo"
                    className="w-10 uppercase font-serif"
                  />
                  <a href="/">XtellaNova</a>
                </a>
              </div>

              {/* Right Section */}
              <div className="flex items-center sm:space-x-4">
                <div className="relative w-full mt-2">
                  {/* Search Bar */}
                  <div className="relative flex items-center w-full group">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 dark:text-gray-400 text-gray-800 group-hover:text-primary"
                      size={18}
                    />
                    {/* Input Field */}
                    <input
                      type="text"
                      placeholder="Search for Products..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="dark:bg-gray-800 indent-8 group-hover:w-[300px] w-[200px] transition-all duration-300 dark:text-white rounded-full border-gray-300 px-2 py-1 text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-1"
                    />
                    {/* Cancel Icon */}
                    {searchQuery && (
                      <X
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 dark:text-gray-400 text-gray-800 hover:text-red-500 cursor-pointer"
                        size={18}
                        onClick={handleClearSearch}
                      />
                    )}
                  </div>

                  {/* Dropdown */}
                  {searchQuery && filteredProducts.length > 0 && (
                    <div className="absolute z-50 bg-white dark:bg-gray-800 shadow-lg mt-2 w-full rounded-md">
                      {filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                          onClick={() =>
                            handleProductClick(product.category, searchQuery)
                          } // Navigate based on product category
                        >
                          {product.name} for {product.category}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <ThemeToggle />
                <button
                  onClick={handleCart}
                  className="bg-gradient-to-r from-primary to-secondary transition-all duration-200 text-white py-1 px-4 rounded-full flex items-center gap-3 group relative"
                >
                  <span className="group-hover:block hidden transition-all duration-200">
                    Order
                  </span>
                  <FaShoppingCart size={20} />
                  {/* Badge for cart count */}
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>

                <LoginButton />
              </div>
            </div>

            {/* =================================== Small Screen Layout ==================================== */}

            <div className="container mx-auto px-4 flex sm:hidden flex-col items-center">
              {/* Top Row with Logo and Icons */}
              <div className="flex justify-between w-full items-center">
                {/* Logo */}
                <div className="flex items-center gap-2">
                  <a
                    href="#"
                    className="font-bold font-quicksand text-2xl flex gap-1"
                  >
                    <img src={Logo} alt="Logo" className="w-10 uppercase" />
                    <a href="/">XtellaNova</a>
                  </a>
                </div>

                {/* Icons */}
                <div className="flex items-center gap-4">
                  <button
                    onClick={handleCart}
                    className="text-primary relative"
                  >
                    <FaShoppingCart size={20} />
                    {/* Badge for cart count */}
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  <LoginButton />
                  <button
                    onClick={toggleSidebar}
                    className="text-black dark:text-white"
                  >
                    <Menu size={24} />
                  </button>
                </div>
              </div>

              <div className="relative w-full mt-2">
                {/* Search Bar */}
                <div className="relative flex items-center w-full">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 dark:text-gray-400 text-gray-800 group-hover:text-primary"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search for Products..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="dark:bg-gray-800 indent-8 w-full transition-all duration-300 dark:text-white rounded-full border-gray-300 px-2 py-1 text-black focus:outline-none focus:ring-2 focus:ring-primary focus:border-1"
                  />
                  {searchQuery && (
                    <X
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 dark:text-gray-400 text-gray-800 hover:text-red-500 cursor-pointer"
                      size={18}
                      onClick={handleClearSearch}
                    />
                  )}
                </div>

                {/* Dropdown */}
                {searchQuery && filteredProducts.length > 0 && (
                  <div className="absolute z-50 bg-white dark:bg-gray-800 shadow-lg mt-2 w-full rounded-md">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                        onClick={() => handleProductClick(product.category)} // Navigate based on product category
                      >
                        {product.name} for {product.category}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              {sidebarOpen && (
                <div
                  className="fixed inset-0 z-50 bg-black/50"
                  onClick={() => setSidebarOpen(false)} // Close sidebar when overlay is clicked
                >
                  <div
                    className="w-[70%] max-w-[250px] bg-white dark:bg-gray-900 h-full p-4 shadow-md flex flex-col justify-between"
                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the sidebar
                  >
                    <div>
                      <button
                        className="ml-auto block text-end p-3 hover:bg-primary/40 rounded-full dark:text-white"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <ArrowLeft size={24} />
                      </button>

                      <ul className="space-y-4">
                        {menu.map((data) => (
                          <li key={data.id}>
                            <a
                              href={data.Link}
                              className={`block px-4 py-2 rounded-md ${
                                location.pathname === data.Link
                                  ? "bg-primary text-white"
                                  : "hover:bg-primary/20 hover:text-primary"
                              }`}
                            >
                              {data.name}
                            </a>
                          </li>
                        ))}
                        <div className="bg-blue-700 w-full rounded-md flex justify-evenly p-3">
                          <span className="font-mono font-medium text-sm text-white">Dark/Light Mode</span>
                          <ThemeToggle />
                        </div>
                      </ul>
                    </div>

                    {/* Footer */}
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      EmmeXtella Enterprise
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lower Navbar */}
          <div className="flex justify-center">
            <ul className="sm:flex hidden  items-center gap-4 p-2">
              {menu.map((data) => (
                <li key={data.id}>
                  <a
                    href={data.Link}
                    className={`inline-block px-4 ${
                      location.pathname === data.Link
                        ? "text-primary font-semibold border-b-2 border-primary"
                        : "hover:text-primary duration-200 hover:border-b-2 hover:border-b-primary"
                    }`}
                  >
                    {data.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};


export default Navbar;
