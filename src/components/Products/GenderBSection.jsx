// frontend/src/components/Products/GenderBSection.js
import React from 'react';
import menGuide from '../../assets/men.jpg';
import womenGuide from '../../assets/womens-collection.webp';
import { Link } from 'react-router-dom';

const GenderBSection = () => {
  return (
    <section className='py-8 md:py-12 px-4'>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {/* Women's Collection */}
          <div className="relative group overflow-hidden rounded-xl">
            <img 
              src={womenGuide} 
              alt="Women's Collection" 
              className='w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-105'
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2">
                Women's Collection
              </h2>
              <Link 
                to="/discover/all?gender=Women" 
                className="inline-block bg-white/90 text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-white transition-colors text-sm md:text-base"
              >
                Shop Now →
              </Link>
            </div>
          </div>

          {/* Men's Collection */}
          <div className="relative group overflow-hidden rounded-xl">
            <img 
              src={menGuide} 
              alt="Men's Collection" 
              className='w-full h-64 sm:h-72 md:h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-105'
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-2">
                Men's Collection
              </h2>
              <Link 
                to="/discover/all?gender=Men" 
                className="inline-block bg-white/90 text-gray-900 px-6 py-2 rounded-lg font-medium hover:bg-white transition-colors text-sm md:text-base"
              >
                Shop Now →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderBSection;