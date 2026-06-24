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
      {/* Sidebar */}
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

      {/* Overlay */}
      {isSideOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSideOpen(false)}
        />
      )}

      {/* Main Content - FULL WIDTH */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-10 bg-gray-900 text-white p-3 flex items-center">
          <button onClick={() => setIsSideOpen(!isSideOpen)} className="mr-3">
            <FaBars size={22} className="cursor-pointer" />
          </button>
          <h1 className="text-base font-medium">Admin Dashboard</h1>
        </div>

        {/* ✅ Content - FULL WIDTH, no max-width restriction */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-6 w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdLayout;