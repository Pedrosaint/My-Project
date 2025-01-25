import React from "react";
import Image1 from "../assets/img/Shopping_1.png";
import Image2 from "../assets/img/Shopping_2.png";
import Image3 from "../assets/img/Shopping_3.png";
import Slider from "react-slick";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "Premium Fabrics for Every Style",
    Description:
      "Discover high-quality fabrics perfect for crafting your next masterpiece. From breathable cotton to luxurious silk, find the materials you need to create timeless looks. Shop now and bring your designs to life.",
    target: "/Fabrics", // Change target to match actual routes
  },
  {
    id: 2,
    img: Image2,
    title: "Find Your Perfect Look in Women's Wear",
    Description:
      "Uncover stylish pieces for every occasion. Whether it's chic dresses or cozy layers, our women's collection has you covered. Embrace effortless style today.",
    target: "/Womenswears",
  },
  {
    id: 3,
    img: Image3,
    title: "Exciting Finds for Everyone in Store",
    Description:
      "Shop a wide range of essentials for the whole family. From kids' must-haves to everyday favorites, discover quality and value in every pick. Don’t wait—start shopping now!",
    target: "/Kidswears",
  },
];

const Hero = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Get current pathname

  const handleNavigation = (target) => {
    if (location.pathname === target) {
      toast.success(`You are already on the ${target} page!`);
    } else {
      navigate(target);
    }
  };

  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  return (
    <div className="relative overflow-hidden pt-28 min-h-[550px] sm:min-h-[650px] bg-gray-100 flex justify-center items-center dark:bg-gray-950 dark:text-white duration-200">
      {/* Background Pattern */}
      <div className="h-[700px] w-[700px] bg-primary/40 absolute -top-1/2 right-0 rounded-3xl rotate-45 -z-9"></div>

      {/* Hero Section */}
      <div className="container pb-8 sm:pb-0">
        <Slider {...settings}>
          {ImageList.map((data) => (
            <div key={data.id} className="p-3">
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {/* Text Content Section */}
                <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10">
                  <h1 className="text-5xl sm:text-5xl lg:text-6xl font-bold font-serif">
                    {data.title}
                  </h1>
                  <p className="font-serif">{data.Description}</p>
                  <div>
                    <button
                      onClick={() => handleNavigation(data.target)}
                      className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-2 px-4 rounded-full"
                    >
                      Order Now
                    </button>
                  </div>
                </div>

                {/* Image Content Section */}
                <div className="order-1 sm:order-2">
                  <div className="relative z-10">
                    <img
                      src={data.img}
                      alt=""
                      className="w-[300px] h-[300px] sm:h-[350px] sm:w-[400px] sm:scale-100 lg:scale-120 object-contain mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Hero;
