// frontend/src/components/Products/FilterProds.js
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchProdsByFilters, setFilters } from "../../redux/slices/productSlice";

const FilterProds = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const [filters, setFiltersState] = useState({
    category: "",
    gender: "",
    color: "",
    size: [],
    material: [],
    brand: [],
    minPrice: 3000,
    maxPrice: 60000,
  });

  const [prices, setPrices] = useState([3000, 60000]);

  const categories = ["Top Wear", "Bottom Wear", "Shoes", "Accessories"];
  const colors = ["Red", "Blue", "Black", "Yellow", "Green", "Gray", "White", "Pink", "Orange", "Navy"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const materials = ["Cotton", "Wool", "Denim", "Silk", "Fleece", "Polyester", "Leather", "Linen", "Viscose"];
  const brands = ["Nike", "Adidas", "Louis Vuitton", "Fashionista", "Gucci", "Panther", "Street Style", "Modern Fit"];
  const genders = ["Men", "Women"];

  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);
    
    const newFilters = {
      category: params.category || "",
      gender: params.gender || "",
      color: params.color || "",
      size: params.size ? params.size.split(",") : [],
      material: params.material ? params.material.split(",") : [],
      brand: params.brand ? params.brand.split(",") : [],
      minPrice: Number(params.minPrice) || 3000,
      maxPrice: Number(params.maxPrice) || 60000,
    };

    setFiltersState(newFilters);
    setPrices([Number(params.minPrice) || 3000, Number(params.maxPrice) || 60000]);

    const collection = params.collection || "all";
    dispatch(fetchProdsByFilters({ collection, ...newFilters }));
  }, [searchParams, dispatch]);

  const updateFilters = (newFilters) => {
    const params = new URLSearchParams();
    const collection = searchParams.get("collection") || "all";
    if (collection && collection !== "all") {
      params.append("collection", collection);
    }

    Object.keys(newFilters).forEach((key) => {
      if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
        params.append(key, newFilters[key].join(","));
      } else if (newFilters[key] && !Array.isArray(newFilters[key]) && newFilters[key] !== "") {
        params.append(key, newFilters[key]);
      }
    });

    setSearchParams(params);
    dispatch(setFilters(newFilters));
    dispatch(fetchProdsByFilters({ collection, ...newFilters }));
  };

  const handFiltChange = (e) => {
    const { name, value, checked, type } = e.target;
    
    let newFilters = { ...filters };

    if (type === "checkbox") {
      if (checked) {
        newFilters[name] = [...(newFilters[name] || []), value];
      } else {
        newFilters[name] = newFilters[name].filter((it) => it !== value);
      }
    } else {
      newFilters[name] = value;
    }

    setFiltersState(newFilters);
    updateFilters(newFilters);
  };

  const hPriceChange = (e) => {
    const newMax = Number(e.target.value);
    setPrices([3000, newMax]);
    const newFilters = { ...filters, minPrice: 3000, maxPrice: newMax };
    setFiltersState(newFilters);
    updateFilters(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      category: "",
      gender: "",
      color: "",
      size: [],
      material: [],
      brand: [],
      minPrice: 3000,
      maxPrice: 60000,
    };
    
    setFiltersState(emptyFilters);
    setPrices([3000, 60000]);
    
    const collection = searchParams.get("collection") || "all";
    const params = new URLSearchParams();
    if (collection && collection !== "all") {
      params.append("collection", collection);
    }
    setSearchParams(params);
    dispatch(setFilters(emptyFilters));
    dispatch(fetchProdsByFilters({ collection, ...emptyFilters }));
  };

  const handleColorClick = (color) => {
    const newFilters = { ...filters, color: filters.color === color ? "" : color };
    setFiltersState(newFilters);
    updateFilters(newFilters);
  };

  return (
    <div className="p-4 md:p-6 mb-9">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        <button 
          onClick={clearFilters}
          className="text-sm text-blue-500 hover:text-blue-700 font-medium"
        >
          Clear All
        </button>
      </div>

      {/* Category */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category}
                onChange={handFiltChange}
                checked={filters.category === category}
                className="w-4 h-4 text-blue-500 focus:ring-blue-400 border-gray-300"
              />
              <span className="ml-3 text-gray-600 text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Gender</label>
        <div className="space-y-2">
          {genders.map((gender) => (
            <label key={gender} className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="gender"
                value={gender}
                onChange={handFiltChange}
                checked={filters.gender === gender}
                className="w-4 h-4 text-blue-500 focus:ring-blue-400 border-gray-300"
              />
              <span className="ml-3 text-gray-600 text-sm">{gender}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Colors</label>
        <div className="flex flex-wrap gap-3">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorClick(color)}
              className={`w-9 h-9 rounded-full border-2 transition-all duration-200 hover:scale-110 ${
                filters.color === color 
                  ? "border-blue-500 ring-2 ring-blue-500 ring-offset-2" 
                  : "border-gray-300 hover:border-gray-400"
              }`}
              style={{ backgroundColor: color.toLowerCase() }}
              aria-label={color}
              title={color}
            />
          ))}
        </div>
        {filters.color && (
          <p className="text-xs text-blue-600 mt-2">Selected: {filters.color}</p>
        )}
      </div>

      {/* Sizes */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Sizes</label>
        <div className="grid grid-cols-3 gap-2">
          {sizes.map((size) => (
            <label key={size} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="size"
                value={size}
                onChange={handFiltChange}
                checked={filters.size.includes(size)}
                className="w-4 h-4 text-blue-500 focus:ring-blue-400 border-gray-300"
              />
              <span className="ml-2 text-gray-600 text-sm">{size}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Materials */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Materials</label>
        <div className="grid grid-cols-2 gap-1">
          {materials.map((material) => (
            <label key={material} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="material"
                value={material}
                onChange={handFiltChange}
                checked={filters.material.includes(material)}
                className="w-4 h-4 text-blue-500 focus:ring-blue-400 border-gray-300"
              />
              <span className="ml-2 text-gray-600 text-sm truncate">{material}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Brands */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Brands</label>
        <div className="grid grid-cols-2 gap-1">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="brand"
                value={brand}
                onChange={handFiltChange}
                checked={filters.brand.includes(brand)}
                className="w-4 h-4 text-blue-500 focus:ring-blue-400 border-gray-300"
              />
              <span className="ml-2 text-gray-600 text-sm truncate">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">Price Range</label>
        <div className="px-1">
          <input
            type="range"
            min={3000}
            max={60000}
            step={1000}
            value={prices[1]}
            onChange={hPriceChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between mt-2">
            <span className="text-sm font-medium text-gray-600">₦{prices[0].toLocaleString()}</span>
            <span className="text-sm font-medium text-blue-600">₦{prices[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs font-medium text-gray-500 mb-2">Active Filters:</p>
        <div className="flex flex-wrap gap-1.5">
          {filters.category && (
            <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
              {filters.category}
            </span>
          )}
          {filters.gender && (
            <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
              {filters.gender}
            </span>
          )}
          {filters.color && (
            <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200 flex items-center gap-1">
              <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: filters.color.toLowerCase() }} />
              {filters.color}
            </span>
          )}
          {filters.size.length > 0 && (
            <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
              Sizes: {filters.size.join(", ")}
            </span>
          )}
          {filters.material.length > 0 && (
            <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
              {filters.material.length} materials
            </span>
          )}
          {filters.brand.length > 0 && (
            <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
              {filters.brand.length} brands
            </span>
          )}
          {(prices[1] < 60000) && (
            <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full border border-blue-200">
              Up to ₦{prices[1].toLocaleString()}
            </span>
          )}
          {!filters.category && !filters.gender && !filters.color && filters.size.length === 0 && 
           filters.material.length === 0 && filters.brand.length === 0 && prices[1] === 60000 && (
            <span className="text-xs text-gray-400">No filters applied</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default FilterProds;