import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import AdSidebar from "./AdSidebar";
import { Outlet } from "react-router-dom"

const AdLayout = () => {
  const [isSideOpen, setIsSideOpen] = useState(false);

  const togSidebar = () => {
    setIsSideOpen(!isSideOpen);
  };

  return (
    <div className="relative min-h-screen flex flex-col md:flex-row">
      <div className="flex md:hidden z-20 p-4 bg-gray-900 text-white">
        <button onClick={togSidebar}>
          <FaBars size={24} className="cursor-pointer" />
        </button>
        <h1 className="ml-4 text-xl font-medium">Admin Dashboard</h1>
      </div>

      {isSideOpen && (
        <div className="fixed inset-0 z-10 bg-black bg-opacity-50 md:hidden" onClick={togSidebar}>

        </div>
      )}

      <div className={`bg-gray-900 w-64 min-h-screen fixed text-white absolute md:relative transform ${isSideOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 md:translate-x-0 md:static md:block z-20`}>
        <AdSidebar />
      </div>

      <div className="grow p-6 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdLayout;
