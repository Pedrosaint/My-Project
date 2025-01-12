import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../../common/Navbar";
import Subscribe from "../../HomeProducts/Subscribe";
import Footer from "../../HomeProducts/Footer";
import Men from "../Men";

const MensWears = () => {
       React.useEffect(() => {
            AOS.init({
                offset: 100,
                duration: 800,
                easing: "ease-in-out",
                delay: 100,
            });
            AOS.refresh();
        }, []);
  return (
    <div className="bg-white dark:bg-gray-800">
      <Navbar />
      <Men />
      <Subscribe />
      <Footer />
    </div>
  );
};

export default MensWears;
