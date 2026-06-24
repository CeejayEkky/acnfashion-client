// frontend/src/components/Admin/AdLayout.js
import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import AdSidebar from "./AdSidebar";
import { Outlet } from "react-router-dom";

const AdLayout = () => {
  const [isSideOpen, setIsSideOpen] = useState(false);

  const togSidebar = () => {
    setIsSideOpen(!isSideOpen);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* ✅ SIDEBAR - ALWAYS FIXED */}
      <div
        className={`
          fixed lg:relative
          z-30
          h-full
          transition-transform duration-300 ease-in-out
          ${isSideOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          flex-shrink-0
        `}
      >
        <AdSidebar />
      </div>

      {/* ✅ MOBILE OVERLAY */}
      {isSideOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={togSidebar}
        />
      )}

      {/* ✅ MAIN CONTENT - SCROLLABLE */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden lg:ml-64">
        {/* ✅ MOBILE HEADER */}
        <div className="lg:hidden sticky top-0 z-10 bg-gray-900 text-white p-4 flex items-center">
          <button onClick={togSidebar} className="mr-4">
            <FaBars size={24} className="cursor-pointer" />
          </button>
          <h1 className="text-xl font-medium">Admin Dashboard</h1>
        </div>

        {/* ✅ PAGE CONTENT - SCROLLABLE */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdLayout;