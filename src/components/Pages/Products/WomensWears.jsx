import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Navbar from "../../common/Navbar";
import Women from "../Women"
import Subscribe from "../../HomeProducts/Subscribe";
import Footer from "../../HomeProducts/Footer";

const WomensWears = () => {
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
    <div>
      <Navbar />
      <Women />
      <Subscribe />
      <Footer />
    </div>
  );
};

export default WomensWears;
