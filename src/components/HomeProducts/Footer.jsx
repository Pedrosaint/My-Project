import React from "react";
import { Link } from "react-router-dom";
import FooterLogo from "../../assets/img/shoppingbag_1.png";
import {
  FaFacebook,
  FaInstagram,
  FaWhatsapp,
  FaLocationArrow,
  FaMobileAlt,
} from "react-icons/fa";

const FooterLinks = [
  {
    title: "Home",
    link: "/",
  },
  {
    title: "Fabrics",
    link: "/Fabric",
  },
  {
    title: "Men",
    link: "/Menswears",
  },
  {
    title: "Womens",
    link: "/Womenswears",
  },
  {
    title: "Kids",
    link: "/Kidswears",
  },
  {
    title: "Foots",
    link: "/Footwears",
  },
];

const Footer = () => {
  return (
    <div className="text-white bg-black">
      <div className="container">
        <div className="grid md:grid-cols-3 pb-30 pt-5">
          {/* Company details */}
          <div className="py-8 px-4">
            <h1 className="sm:text-3xl text-xl font-bold sm:text-left text-justify mb-3 flex items-center gap-3">
              <img
                src={FooterLogo}
                alt="XtellaNova Logo"
                className="max-w-[50px]"
              />
              XtellaNova
            </h1>
            <p>
              At XtellaNova, we are passionate about delivering premium-quality
              fashion and lifestyle products for everyone. From trendy apparel
              to timeless classics, we aim to provide a seamless shopping
              experience that inspires confidence and style. With a commitment
              to excellence, customer satisfaction, and innovation, we bring
              your fashion desires to life.
            </p>
          </div>
          {/* Footer Links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 col-span-2 md:pl-10">
            <div className="py-8 px-4">
              <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                Menu
              </h1>
              <ul className="flex flex-col gap-3">
                {FooterLinks.map((link) => (
                  <li
                    className="cursor-pointer hover:text-primary hover:translate-x-1 duration-300 text-gray-200"
                    key={link.title}
                  >
                    <Link to={link.link} className="block">
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            {/* Social Media */}
            <div>
              <div className="py-8 px-4">
                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                  Social Media
                </h1>
                <div className="flex items-center gap-3 mt-6">
                  <a
                    href="https://www.instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaInstagram className="text-3xl cursor-pointer hover:text-primary hover:translate-x-1 duration-300" />
                  </a>
                  <a
                    href="https://www.facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaFacebook className="text-3xl cursor-pointer hover:text-primary hover:translate-x-1 duration-300" />
                  </a>
                  <a
                    href="https://wa.link/4rh638"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp className="text-3xl cursor-pointer hover:text-primary hover:translate-x-1 duration-300" />
                  </a>
                </div>
              </div>
            </div>
            {/* Contact Section */}
            <div>
              <div className="mt-6">
                <h1 className="sm:text-xl text-xl font-bold sm:text-left text-justify mb-3">
                  Contact
                </h1>
                <div className="flex items-center gap-3">
                  <FaLocationArrow className="text-xl" />
                  <p>No 5 Onyenwaku Street, Aba, Abia State, Nigeria.</p>
                </div>
                <div className="flex items-center  gap-3 mt-3 mb-6">
                  <FaMobileAlt className="text-xl" />
                  <div className="flex-col">
                    <a
                      href="tel:+2348130315251"
                      className="text-sm font-medium hover:text-blue-700"
                    >
                      +234 813 031 5251
                    </a> <br />
                    <a href="tel:+2347072598854"
                      className="text-sm font-medium hover:text-blue-700"
                    >
                      +234 707 259 8854</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
