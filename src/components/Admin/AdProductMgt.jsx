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
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Product Management</h2>
        <Link
          to="/admin/products/new"
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          + Add Product
        </Link>
      </div>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Stock</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map((prod) => (
                <tr key={prod._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                    {prod.name}
                  </td>
                  <td className="p-4">₦{prod.price}</td>
                  <td className="p-4">{prod.sku || "N/A"}</td>
                  <td className="p-4">{prod.countInStock || 0}</td>
                  <td className="p-4">
                    <Link
                      to={`/admin/products/${prod._id}/edit`}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600 text-sm inline-block"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handlDel(prod._id)}
                      disabled={deletingId === prod._id}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm disabled:opacity-50"
                    >
                      {deletingId === prod._id ? "Deleting..." : "Delete"}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No Products Found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdProductMgt;