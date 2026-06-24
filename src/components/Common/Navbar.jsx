import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import acnImg from "../../../public/acnImge.png";
import { HiOutlineUser, HiOutlineShoppingCart, HiBars3 } from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrag from "../Layout/CartDrag";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

const Navbar = () => {
  const location = useLocation();
  const pathname = location.pathname;
  const [dragOpen, setDragOpen] = useState(false);
  const [navDrag, setNavDrag] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const cartItCount =
    cart?.products?.reduce((total, prod) => total + prod.quantity, 0) || 0;

  const togNavDrag = () => {
    setNavDrag(!navDrag);
  };

  const togCartDrag = () => {
    setDragOpen(!dragOpen);
  };

  return (
    <>
      <nav className="container mx-auto flex items-center justify-between py-2 px-6">
        <div>
          <Link to="/" className="text-2xl font-medium">
            <img src={acnImg} className="w-25" alt="" />
          </Link>
        </div>
        <div className="hidden md:flex space-x-6">
          <Link
            to="/discover/all"
            className="relative text-gray-700 hover:text-blue-700 text-sm font-medium uppercase"
          >
            Discover
            <span
              className={`absolute left-0 -bottom-1 h-0.5 bg-blue-500 rounded-full transition-all duration-300 ${
                pathname === "/discover"
                  ? "w-full opacity-100"
                  : "w-0 opacity-0"
              } hidden md:block`}
            ></span>
          </Link>
          <Link
            to="/about"
            className="relative text-gray-700 hover:text-blue-700 text-sm font-medium uppercase"
          >
            About
            <span
              className={`absolute left-0 -bottom-1 h-0.5 bg-blue-500 rounded-full transition-all duration-300 ${
                pathname === "/about" ? "w-full opacity-100" : "w-0 opacity-0"
              } hidden md:block`}
            ></span>
          </Link>
          <Link
            to="/contacts"
            className="relative text-gray-700 hover:text-blue-700 text-sm font-medium uppercase"
          >
            Contacts
            <span
              className={`absolute left-0 -bottom-1 h-0.5 bg-blue-500 rounded-full hover:scale-x-100 transition-all duration-300 ${
                pathname === "/contacts"
                  ? "w-full opacity-100"
                  : "w-0 opacity-0"
              } hidden md:block`}
            ></span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className="block bg-black px-2 rounded text-sm text-white"
            >
              Admin
            </Link>
          )}

          <Link to="/profile" className="hover:text-blue-700">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>
          <button
            onClick={togCartDrag}
            className="relative hover:text-blue-700"
          >
            <HiOutlineShoppingCart className="h-6 w-6 text-gray-700 cursor-pointer" />
            {cartItCount > 0 && (
              <span className="absolute -top-1 acn text-white text-xs rounded-full px-1 py-0">
                {cartItCount}
              </span>
            )}
          </button>
          <div className="overflow-hidden">
            <SearchBar />
          </div>
          <button onClick={togNavDrag} className="md:hidden">
            <HiBars3 className="h-7 w-7 text-gray-700 cursor-pointer" />
          </button>
        </div>
      </nav>
      <CartDrag dragOpen={dragOpen} togCartDrag={togCartDrag} />

      <div
        className={`fixed top-0 right-0 w-1/2 shadow-blue-600 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 ${
          navDrag ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4 mt-6">
          <button onClick={togNavDrag}>
            <IoMdClose className="h-6 w-6 text-gray-600 hover:text-red-600 cursor-pointer" />
          </button>
        </div>

        <div className="p-4">
          <h2 className="text-2xl text-blue-900 -mt-14 mb-15 font-semibold mb-6">
            Menu
          </h2>
          <nav className="space-y-4">
            <Link
              to="/discover/all"
              onClick={togNavDrag}
              className="block text-gray-600 hover:text-blue-700"
            >
              Discover
            </Link>
            <Link
              to="/about"
              onClick={togNavDrag}
              className="block text-gray-600 hover:text-blue-700"
            >
              About
            </Link>
            <Link
              to="/contacts"
              onClick={togNavDrag}
              className="block text-gray-600 hover:text-blue-700"
            >
              Contacts
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Navbar;
