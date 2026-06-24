// frontend/src/components/Products/FeatSects.js
import React from "react";
import { HiShoppingBag, HiOutlineCreditCard } from 'react-icons/hi';
import { HiArrowPathRoundedSquare } from 'react-icons/hi2';

const FeatSects = () => {
  return (
    <section className="py-12 md:py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center p-4 md:p-6">
            <div className="bg-gray-100 rounded-full p-3 md:p-4 mb-4">
              <HiShoppingBag className="text-xl md:text-2xl text-gray-700" />
            </div>
            <h4 className="text-sm md:text-base font-semibold tracking-tight mb-2">
              FREE NATIONAL SHIPPING
            </h4>
            <p className="text-gray-600 text-sm">
              On all orders over ₦50k.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center p-4 md:p-6">
            <div className="bg-gray-100 rounded-full p-3 md:p-4 mb-4">
              <HiArrowPathRoundedSquare className="text-xl md:text-2xl text-gray-700" />
            </div>
            <h4 className="text-sm md:text-base font-semibold tracking-tight mb-2">
              42 DAYS RETURN
            </h4>
            <p className="text-gray-600 text-sm">
              Money back guarantee
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center p-4 md:p-6 sm:col-span-2 lg:col-span-1">
            <div className="bg-gray-100 rounded-full p-3 md:p-4 mb-4">
              <HiOutlineCreditCard className="text-xl md:text-2xl text-gray-700" />
            </div>
            <h4 className="text-sm md:text-base font-semibold tracking-tight mb-2">
              SECURE CHECKOUT
            </h4>
            <p className="text-gray-600 text-sm">
              100% secured checkout process
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatSects;