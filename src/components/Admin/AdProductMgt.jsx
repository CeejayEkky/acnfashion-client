// frontend/src/components/Admin/AdProductMgt.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteProduct, fetchAdminProds } from "../../redux/slices/adminProdSlice";
import { toast } from "sonner";
import { FaSearch, FaSortAlphaDown, FaSortAlphaUp } from "react-icons/fa";

const AdProductMgt = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.adminProducts
  );
  const [deletingId, setDeletingId] = useState(null);
  
  // ✅ Search and Sort State
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc"); // "asc" or "desc"

  useEffect(() => {
    dispatch(fetchAdminProds());
  }, [dispatch]);

  // ✅ Filter products by search term
  const filteredProducts = products?.filter((prod) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      prod.name?.toLowerCase().includes(searchLower) ||
      prod.sku?.toLowerCase().includes(searchLower) ||
      prod.category?.toLowerCase().includes(searchLower)
    );
  });

  // ✅ Sort products alphabetically
  const sortedProducts = [...(filteredProducts || [])].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name?.localeCompare(b.name || "");
    } else {
      return b.name?.localeCompare(a.name || "");
    }
  });

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

  // ✅ Toggle sort order
  const toggleSort = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader" />
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
    <div>
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

      {/* ✅ Search & Sort Bar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex-1 min-w-[200px] relative">
          <input
            type="text"
            placeholder="Search products by name, SKU, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
        
        <button
          onClick={toggleSort}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition text-sm"
        >
          {sortOrder === "asc" ? <FaSortAlphaUp /> : <FaSortAlphaDown />}
          Sort {sortOrder === "asc" ? "A-Z" : "Z-A"}
        </button>

        {searchTerm && (
          <span className="text-sm text-gray-500">
            Found {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Name</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Price</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">SKU</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Stock</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedProducts.length > 0 ? (
                sortedProducts.map((prod) => (
                  <tr key={prod._id} className="hover:bg-gray-50 transition">
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {prod.name}
                    </td>
                    <td className="py-3 px-4 text-gray-600">₦{prod.price}</td>
                    <td className="py-3 px-4 text-gray-600">{prod.sku || "N/A"}</td>
                    <td className="py-3 px-4">
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
                    <td className="py-3 px-4">
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
                    {searchTerm ? "No products match your search" : "No products found. Click 'Add Product' to create one."}
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