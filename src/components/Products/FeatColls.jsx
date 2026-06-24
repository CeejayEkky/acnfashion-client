// frontend/src/components/Products/FeatColls.js
import React from "react";
import { Link } from 'react-router-dom';
import featured from '../../assets/feat1.jpg';

const FeatColls = () => {
  return (
    <section className="py-12 md:py-16 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center bg-green-50 rounded-2xl overflow-hidden">
          {/* Text Content */}
          <div className="w-full lg:w-1/2 p-6 md:p-8 lg:p-12 text-center lg:text-left order-2 lg:order-1">
            <h2 className="text-sm md:text-base font-semibold text-gray-700 mb-2 uppercase tracking-wider">
              Elevate Your Fashion Presence
            </h2>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 leading-tight">
              Confidence achieved in your everyday life
            </h3>
            <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8">
              Experience premium fashion crafted for confidence, elegance, and
              individuality. Every piece is designed to blend luxury aesthetics
              with everyday comfort.
            </p>
            <Link
              to="/collections/all"
              className="inline-block bg-black text-white px-8 py-3 rounded-lg text-base md:text-lg hover:bg-gray-800 transition-colors"
            >
              Shop Now
            </Link>
          </div>

          {/* Image */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2">
            <img 
              src={featured} 
              alt="Featured Collection" 
              className="w-full h-64 sm:h-80 lg:h-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatColls;