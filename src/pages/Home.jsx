import React, { useEffect, useState } from "react";
import Hero from "../components/Layout/Hero";
import GenderBSection from "../components/Products/GenderBSection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDets from "../components/Products/ProductDets";
import ProdGrids from "../components/Products/ProdGrids";
import { useDispatch, useSelector } from "react-redux";
import { fetchProdsByFilters } from "../redux/slices/productSlice.js";
import axios from "axios";
import FeatColls from '../components/Products/FeatColls';
import FeatSects from '../components/Products/FeatSects';
import WhatsAppButton from "../components/WhatsAppButton.jsx";
import Reviews from "../components/Reviews/Reviews.jsx";

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

  // Simple scroll reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="aura-bg cyber-grid relative overflow-x-hidden">
      {/* Floating Orbs - Very Light */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="aura-orb" />
        <div className="aura-orb" />
        <div className="aura-orb" />
      </div>

      <WhatsAppButton />





      <div className="relative z-10">
        <Hero />
        <GenderBSection />
        
        <section className="reveal py-8 md:py-12 px-4">
          <div className="container mx-auto">
            <NewArrivals />
          </div>
        </section>

        <section className="py-8 md:py-12 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-center font-bold mb-6 glow-text">
              ⚡ Best Seller
            </h2>
            
            {isLoadingBestSeller ? (
              <div className="flex justify-center items-center h-64">
                <div className="loader" />
              </div>
            ) : bestSellerProduct ? (
              <div className="aura-box rounded-2xl p-4 md:p-6">
                <ProductDets productId={bestSellerProduct._id} />
              </div>
            ) : (
              <p className="text-center text-gray-500">No best seller found</p>
            )}
          </div>
        </section>

        <section className="reveal py-8 md:py-12 px-4">
          <div className="container mx-auto">
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-center font-bold mb-6 glow-text">
              ✨ Top Wears for Women
            </h2>
            <ProdGrids products={products} loading={loading} error={error} />
          </div>
        </section>

        <FeatColls />
        <FeatSects />

        <Reviews limit={6} />
      </div>
    </main>
  );
};

export default Home;