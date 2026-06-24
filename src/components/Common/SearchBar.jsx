// frontend/src/components/Layout/SearchBar.js
import React, { useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProdsByFilters, setFilters } from "../../redux/slices/productSlice";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const hSearchTog = () => {
    setIsOpen(!isOpen);
  };

  const hSearch = (e) => {
    e.preventDefault();
    
    if (!searchTerm.trim()) {
      return;
    }
    
    console.log("🔍 Searching for:", searchTerm);
    
    // ✅ FIX: Use the correct route
    dispatch(setFilters({ search: searchTerm }));
    dispatch(fetchProdsByFilters({ search: searchTerm }));
    
    // ✅ Navigate to the correct route
    navigate(`/discover/all?search=${encodeURIComponent(searchTerm)}`);
    
    setIsOpen(false);
  };

  return (
    <div className={`flex items-center justify-center w-full transition-all duration-300 ${
      isOpen ? "absolute top-0 left-0 w-full bg-white h-34 z-50 shadow-sm shadow-blue-500" : "w-auto"
    }`}>
      {isOpen ? (
        <form onSubmit={hSearch} className="relative flex items-center justify-center w-full">
          <div className="relative w-1/2">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-100 px-4 py-2 pl-2 pr-12 rounded-lg focus:outline-none w-full placeholder:text-gray-700"
              autoFocus
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
            >
              <HiMagnifyingGlass className="h-6 w-6" />
            </button>
          </div>
          <button type="button" onClick={hSearchTog}>
            <HiMiniXMark className="absolute right-4 top-1/2 transform font-bold text-[40px] -translate-y-1/2 text-red-600 hover:text-red-800 hover:bg-gray-200 rounded-full cursor-pointer px-2" />
          </button>
        </form>
      ) : (
        <button onClick={hSearchTog}>
          <HiMagnifyingGlass className="text-gray-800 w-6 h-6 cursor-pointer" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;