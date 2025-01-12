import React from 'react'
import Navbar from '../../components/common/Navbar'
import Hero from '../Hero'
import Product2 from '../HomeProducts/Product2'
import Products from '../HomeProducts/Products'
import AOS from "aos"
import "aos/dist/aos.css"
import TopProducts from '../HomeProducts/TopProducts'
import Banner from '../HomeProducts/Banner'
import Subscribe from '../HomeProducts/Subscribe'
import Tesmonial from '../HomeProducts/Testimonial'
import Footer from '../HomeProducts/Footer'

const Home = () => {
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
      <>
        <div className='bg-white dark:bg-gray-800'>
          <Navbar />
          <Hero />
          <Products />
          <TopProducts />
          <Banner />
          <Subscribe />
          <Product2 />
          <Tesmonial />
          <Footer />
        </div>
      </>
    );
}

export default Home
