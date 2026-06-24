// frontend/src/pages/CollectionPage.js
import React, { useEffect, useRef, useState } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";
import FilterProds from "../components/Products/FilterProds";
import SortOpts from "../components/Products/SortOpts";
import ProdGrids from "../components/Products/ProdGrids";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProdsByFilters } from "../redux/slices/productSlice";

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);

  const sidebarRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const queryParams = Object.fromEntries([...searchParams]);
    const filters = {
      collection: collection || "all",
      ...queryParams,
    };

    console.log("🔍 Fetching with filters:", filters);
    dispatch(fetchProdsByFilters(filters));
  }, [dispatch, collection, searchParams]);

  const togSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        closeSidebar();
      }
    };

    if (isSidebarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isSidebarOpen]);

  const searchTerm = searchParams.get("search");
  const activeFiltersCount = [...searchParams.keys()].filter(k => k !== "collection").length;

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={togSidebar}
          className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium"
        >
          <FaFilter />
          Filters
          {activeFiltersCount > 0 && (
            <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
        <span className="text-sm text-gray-500">
          {!loading && products.length > 0 && `${products.length} products`}
        </span>
      </div>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={closeSidebar} />
      )}

      {/* Sidebar */}
      <div
        ref={sidebarRef}
        className={`
          fixed lg:static inset-y-0 left-0 z-50 
          w-80 lg:w-72 
          bg-white 
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          border-r border-gray-200
          overflow-y-auto
          h-full
          max-h-screen
        `}
      >
        {/* Mobile Close Button */}
        <div className="lg:hidden flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <span className="font-semibold text-gray-800">Filters</span>
          <button onClick={closeSidebar} className="p-1 hover:bg-gray-100 rounded-full">
            <FaTimes className="text-gray-600" />
          </button>
        </div>

        <FilterProds />
      </div>

      {/* Products Grid */}
      <div className="flex-1 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
              {searchTerm ? (
                <>Results for "<span className="text-blue-600">{searchTerm}</span>"</>
              ) : collection && collection !== "all" ? (
                <span className="capitalize">{collection}</span>
              ) : (
                "All Collections"
              )}
            </h2>
            {!loading && products.length > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                {products.length} product{products.length > 1 ? 's' : ''} found
              </p>
            )}
          </div>
          <SortOpts />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loader" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 text-lg">Error: {error}</p>
            <button 
              onClick={() => {
                const queryParams = Object.fromEntries([...searchParams]);
                dispatch(fetchProdsByFilters({ collection, ...queryParams }));
              }}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <ProdGrids products={products} loading={loading} error={error} />
            {products.length === 0 && !loading && (
              <div className="text-center py-20">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-gray-600 text-xl font-medium">No products found</p>
                <p className="text-gray-400 mt-2">Try adjusting your filters or search terms.</p>
                <button 
                  onClick={() => {
                    setSearchParams({});
                    dispatch(fetchProdsByFilters({ collection: collection || "all" }));
                  }}
                  className="mt-4 text-blue-500 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;