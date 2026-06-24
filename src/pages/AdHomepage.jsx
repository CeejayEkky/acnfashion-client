// frontend/src/pages/AdHomepage.js
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminProds } from "../redux/slices/adminProdSlice";
import { fetchAllOrders } from "../redux/slices/adminOrderSlice";

const AdHomepage = () => {
  const dispatch = useDispatch();
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.adminProducts);
  const {
    orders,
    totalOrders,
    totalSales,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAdminProds());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {productsLoading || ordersLoading ? (
        <p>Loading ...</p>
      ) : productsError ? (
        <p className="text-red-500">Error fetching products: {productsError}</p>
      ) : ordersError ? (
        <p className="text-red-500">Error fetching orders: {ordersError}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold">Revenue</h2>
            <p className="text-2xl">₦ {totalSales?.toFixed(2) || "0.00"}</p>
          </div>
          <div className="p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold">Total Orders</h2>
            <p className="text-2xl">{totalOrders || 0}</p>
            <Link to="/admin/orders" className="text-blue-500 hover:underline">
              Manage Orders
            </Link>
          </div>
          <div className="p-4 shadow-md rounded-lg">
            <h2 className="text-xl font-semibold">Total Products</h2>
            <p className="text-2xl">{products?.length || 0}</p>
            <Link
              to="/admin/products"
              className="text-blue-500 hover:underline"
            >
              Manage Products
            </Link>
          </div>
        </div>
      )}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-gray-500">
            {/* ✅ FIX: Added <tr> wrapper */}
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Unit Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders && orders.length > 0 ? (
                orders.map((ord) => (
                  <tr
                    key={ord._id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="p-4 text-sm">{ord._id}</td>
                    <td className="p-4">{ord.user?.name || "Unknown"}</td>
                    <td className="p-4">₦{ord.totalPrice?.toFixed(2) || "0.00"}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        ord.status === "Delivered" 
                          ? "bg-green-100 text-green-700" 
                          : ord.status === "Shipped"
                          ? "bg-blue-100 text-blue-700"
                          : ord.status === "Cancelled"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {ord.status || "Processing"}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdHomepage;