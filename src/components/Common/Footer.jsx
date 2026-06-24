import React from "react";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { FiPhoneCall } from "react-icons/fi"
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6 lg:px-0">
        <div className="md:ml-8">
          <h3 className="text-lg text-gray-800 mb-4">Newsletter</h3>
          <p className="text-gray-500 mb-4">
            Be the first to hear about new products, exclusive events and online
            offers.
          </p>
          <p className="font-medium text-sm text-gray-600 mb-4">
            Sign up and get 10% off your first order.
          </p>


          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-3 w-full text-sm border-t border-l border-b border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all"
              required
            />
            <button
              className="bg-black text-white px-6 text-sm py-3 rounded-r-md hover:bg-gray-800 transition-all"
              type="submit"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div>
          <h3 className="text-lg text-gray-800 mb-4">Shop</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="#" className="transition-colors hover:text-gray-500">
                Men's Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="transition-colors hover:text-gray-500">
                Women's Wear
              </Link>
            </li>
            <li>
              <Link to="#" className="transition-colors hover:text-gray-500">
                Shoes
              </Link>
            </li>
            <li>
              <Link to="#" className="transition-colors hover:text-gray-500">
                Accessories
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg text-gray-800 mb-4">Store</h3>
          <ul className="space-y-2 text-gray-600">
            <li>
              <Link to="/message-status" className="transition-colors hover:text-gray-500">
         Check Message Status
      </Link>
            </li>
            <li>
              <Link to="/contacts" className="transition-colors hover:text-gray-500">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition-colors hover:text-gray-500">
                About Us
              </Link>
            </li>
            <li>
              <Link to="#" className="transition-colors hover:text-gray-500">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="#" className="transition-colors hover:text-gray-500">
                Features
              </Link>
            </li>
          </ul>
        </div>

        <div>
            <h3 className="text-lg text-gray-800 mb-4">
                Follow Us
            </h3>
            <div className="flex items-center space-x-4 mb-6">
                <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600">
                    <TbBrandMeta className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/prett_ychiommy/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600">
                    <IoLogoInstagram className="w-5 h-5" />
                </a> 
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600">
                    <RiTwitterXLine className="w-5 h-5" />
                </a> 
            </div>
            <p className="text-gray-500">Reach Out</p>
            <p>
                <FiPhoneCall className="inline-block mr-2" />
                +234 813-700-4669
            </p>
        </div>
      </div>
      <div className="container mx-auto mt-12 px-4 lg:px-0 border-t border-gray-200 pt-6">
        <p className="text-gray-500 text-sm tracking-tighter text-center ">&copy; 2026, &nbsp; A.C.N Fashion House | All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
