// frontend/src/components/Admin/AdProductMgt.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteProduct, fetchAdminProds } from "../../redux/slices/adminProdSlice";
import { toast } from "sonner";

const AdProductMgt = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.adminProducts
  );
  const [deletingId, setDeletingId] = useState(null);

  const handlDel = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setDeletingId(id);
      try {
        await dispatch(deleteProduct(id)).unwrap();
        toast.success("Product deleted successfully! 🗑️");
      } catch (error) {
        toast.error(error?.message || "Failed to delete product");
      } finally {
        setDeletingId(null);
      }
    }
  };

  useEffect(() => {
    dispatch(fetchAdminProds());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error: {error}</p>
        <button 
          onClick={() => dispatch(fetchAdminProds())}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    // ✅ REMOVED max-w-7xl, mx-auto - FULL WIDTH
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <h2 className="text-xl font-bold text-gray-800">Product Management</h2>
        <Link
          to="/admin/products/new"
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition text-sm font-medium"
        >
          + Add Product
        </Link>
      </div>

      {/* ✅ Table - FULL WIDTH, no container max-width */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 whitespace-nowrap">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 whitespace-nowrap">Price</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 whitespace-nowrap">SKU</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 whitespace-nowrap">Stock</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products && products.length > 0 ? (
                products.map((prod) => (
                  <tr key={prod._id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-medium text-gray-800 whitespace-nowrap">
                      {prod.name}
                    </td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">₦{prod.price}</td>
                    <td className="py-3 px-4 text-gray-600 whitespace-nowrap">{prod.sku || "N/A"}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        prod.countInStock > 10 
                          ? "bg-green-100 text-green-700" 
                          : prod.countInStock > 0 
                          ? "bg-yellow-100 text-yellow-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {prod.countInStock || 0}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/products/${prod._id}/edit`}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-xs font-medium transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handlDel(prod._id)}
                          disabled={deletingId === prod._id}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-xs font-medium transition disabled:opacity-50"
                        >
                          {deletingId === prod._id ? "..." : "Delete"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">
                    No products found. Click "Add Product" to create one.
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

export default AdProductMgt;