import React from 'react'
import Image1 from "../assets/img/Shopping_1.png"
import Image2 from "../assets/img/Shopping_2.png";
import Image3 from "../assets/img/Shopping_3.png";
import Slider from 'react-slick';
import { useNavigate } from 'react-router-dom';


const ImageList = [
  {
    id: 1,
    img: Image1,
    title: "Upgrade Your Style: Up to 50% Off Men's Wear",
    Description:
      "Elevate your wardrobe with our exclusive men's wear collection. From timeless classics to trendy pieces, enjoy up to 50% off on all styles. Don't miss out on this chance to redefine your look with premium quality and unmatched savings.",
    target: "Men", // Add this to specify the navigation target
  },
  {
    id: 2,
    img: Image2,
    title: "Unmissable Deals: 30% Off Women's Wear",
    Description:
      "Discover the latest in women's fashion with our stunning collection. Enjoy 30% off on chic dresses, cozy sweaters, and more. Shop now and embrace style that speaks volumes without breaking the bank.",
    target: "Women", // Add this to specify the navigation target
  },
  {
    id: 3,
    img: Image3,
    title: "Massive Clearance: 70% Off Storewide",
    Description:
      "Don't miss the ultimate product sale! Enjoy a whopping 70% off on a wide range of items. From kids' essentials to trendy picks for all, stock up and save big while supplies last. It's the sale event of the season!",
    target: "Kids", // Add this to specify the navigation target
  },
];


const Hero = () => {
  const navigate = useNavigate()
   const handleMen = () => {
    navigate("/Menswears");
  };

  const handleWomen = () => {
    navigate("/Womenswears");
  };

  const handleKids = () => {
    navigate("/kidswears");
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
    <>
      <div className="relative overflow-hidden pt-28 min-h-[550px] sm:min-h-[650px] bg-gray-100 flex justify-center items-center dark:bg-gray-950 dark:text-white duration-200">
        {/* Background Pattern */}
        <div className="h-[700px] w-[700px] bg-primary/40 absolute -top-1/2 right-0 rounded-3xl rotate-45 -z-9"></div>
        {/* Hero Section */}
        <div className="container pb-8 sm:pb-0">
          <Slider {...settings}>
            {ImageList.map((data) => (
              <div className='p-3'>
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {/* text content section */}
                  <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10">
                    <h1
                      className="text-5xl sm:text-5xl lg:text-7xl font-bold font-quicksand"
                    >
                      {data.title}
                    </h1>
                    <p>
                      {data.Description}
                    </p>
                    <div  >
                      <button
                        onClick={() => {
                          if (data.target === "Men") {
                            handleMen();
                          } else if (data.target === "Women") {
                            handleWomen();
                          } else if (data.target === "Kids") {
                            handleKids();
                          }
                        }}
                        className="bg-gradient-to-r from-primary to-secondary hover:scale-105 duration-200 text-white py-2 px-4 rounded-full"
                      >
                        Order Now
                      </button>
                    </div>
                  </div>
                  {/* image content section */}
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
    </>
  );
}

export default Hero