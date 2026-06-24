// frontend/src/components/Admin/OrderMgt.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllOrders, updateOrderStatus } from "../../redux/slices/adminOrderSlice";
import { toast } from "sonner";

const OrderMgt = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [updatingId, setUpdatingId] = useState(null);

  const { user } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
    } else {
      dispatch(fetchAllOrders());
    }
  }, [dispatch, user, navigate]);

  const handStatusChange = async (orderId, status) => {
    console.log(`📝 Changing order ${orderId} to "${status}"`);
    
    // ✅ Show loading state
    setUpdatingId(orderId);
    
    try {
      const result = await dispatch(updateOrderStatus({ id: orderId, status })).unwrap();
      console.log("✅ Update result:", result);
      toast.success(`Order status updated to "${status}"! ✅`);
    } catch (error) {
      console.error("❌ Update error:", error);
      toast.error(error?.message || "Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <p className="text-blue-500">Loading orders...</p>
    </div>
  );
  
  if (error) return (
    <div className="text-red-500 p-4">
      Error: {error}
      <button 
        onClick={() => dispatch(fetchAllOrders())}
        className="ml-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Retry
      </button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Order Management</h2>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Order ID</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Total Price</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.length > 0 ? (
              orders.map((ord) => (
                <tr
                  key={ord._id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap text-sm">
                    #{ord._id}
                  </td>
                  <td className="p-4">{ord.user?.name || "Unknown"}</td>
                  <td className="p-4">₦{ord.totalPrice?.toFixed(2) || "0.00"}</td>
                  <td className="p-4">
                    {/* ✅ Status badge */}
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
                  <td className="p-4">
                    <select
                      value={ord.status}
                      onChange={(e) => handStatusChange(ord._id, e.target.value)}
                      disabled={updatingId === ord._id}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 disabled:opacity-50"
                    >
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                    {updatingId === ord._id && (
                      <span className="ml-2 text-xs text-blue-500">Updating...</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No Orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrderMgt;