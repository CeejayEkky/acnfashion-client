// frontend/src/pages/Home.js
import React, { useEffect, useState } from "react";
import Hero from "../components/Layout/Hero";
import GenderBSection from "../components/Products/GenderBSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProdGrids from "../components/Products/ProdGrids";
import { useDispatch, useSelector } from "react-redux";
import { fetchProdsByFilters } from "../redux/slices/productSlice.js";
import axios from "axios";
import FeatColls from '../components/Products/FeatColls';
import FeatSects from '../components/Products/FeatSects';
import { Link } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const { products, error, loading } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);
  const [isLoadingBestSeller, setIsLoadingBestSeller] = useState(true);

  useEffect(() => {
    dispatch(
      fetchProdsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
      })
    );

    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );
        setBestSellerProduct(response.data);
      } catch (error) {
        console.error("Error fetching best seller:", error);
      } finally {
        setIsLoadingBestSeller(false);
      }
    };

    fetchBestSeller();
  }, [dispatch]);

  return (
    <main className="overflow-x-hidden">
      <Hero />
      <GenderBSection />
      <NewArrivals />

      {/* ✅ Best Seller - Show as CARD, not full details */}
      <section className="py-8 md:py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-center font-bold mb-6 glow-text">
            ⚡ Best Seller
          </h2>

          {isLoadingBestSeller ? (
            <div className="flex justify-center items-center h-40">
              <div className="loader" />
            </div>
          ) : bestSellerProduct ? (
            // ✅ Show as a product card, NOT full ProductDets
            <Link to={`/product/${bestSellerProduct._id}`} className="block max-w-sm mx-auto group">
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="relative overflow-hidden">
                  <img
                    src={bestSellerProduct.images?.[0]?.url || "https://via.placeholder.com/400x400?text=No+Image"}
                    alt={bestSellerProduct.name}
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Best Seller 🔥
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-lg line-clamp-1">
                    {bestSellerProduct.name}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mt-1">
                    {bestSellerProduct.description?.substring(0, 80)}...
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xl font-bold text-gray-900">
                      ₦{bestSellerProduct.price.toLocaleString()}
                    </span>
                    <span className="text-blue-500 text-sm font-medium hover:text-blue-700 transition">
                      View Details →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <p className="text-center text-gray-500">No best seller found</p>
          )}
        </div>
      </section>

      {/* Top Wears for Women */}
      <section className="py-8 md:py-12 px-4">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl text-center font-bold mb-6 glow-text">
            ✨ Top Wears for Women
          </h2>
          <ProdGrids products={products} loading={loading} error={error} />
        </div>
      </section>

      <FeatColls />
      <FeatSects />
    </main>
  );
};

export default Home;