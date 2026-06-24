// frontend/src/components/Admin/EditProductPg.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProdsDetails, updateProduct } from "../../redux/slices/productSlice";
import axios from "axios";
import { toast } from "sonner";

const EditProductPg = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const { selectedProduct, loading, error } = useSelector((state) => state.products);
  
  const [prodData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [],
  });
  
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Generate SKU function
  const generateSKU = () => {
    const name = prodData.name || "PRD";
    const category = prodData.category || "GEN";
    const gender = prodData.gender || "UN";
    
    // Get first 3 letters of name (uppercase)
    const nameCode = name.substring(0, 3).toUpperCase();
    // Get first 3 letters of category (uppercase)
    const categoryCode = category.substring(0, 3).toUpperCase();
    // Get first 2 letters of gender (uppercase)
    const genderCode = gender.substring(0, 2).toUpperCase();
    // Random 4-digit number
    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    
    return `${genderCode}-${categoryCode}-${nameCode}-${random}`;
  };

  // ✅ Handle Generate SKU button
  const handleGenerateSKU = () => {
    const newSKU = generateSKU();
    setProductData(prev => ({ ...prev, sku: newSKU }));
    toast.success("SKU generated! ✅");
  };

  // ✅ Fetch product on load
  useEffect(() => {
    if (id) {
      dispatch(fetchProdsDetails(id));
    }
  }, [dispatch, id]);

  // ✅ Set form data when product loads
  useEffect(() => {
    if (selectedProduct) {
      setProductData({
        name: selectedProduct.name || "",
        description: selectedProduct.description || "",
        price: selectedProduct.price || 0,
        countInStock: selectedProduct.countInStock || 0,
        sku: selectedProduct.sku || "",
        category: selectedProduct.category || "",
        brand: selectedProduct.brand || "",
        sizes: selectedProduct.sizes || [],
        colors: selectedProduct.colors || [],
        collections: selectedProduct.collections || "",
        material: selectedProduct.material || "",
        gender: selectedProduct.gender || "",
        images: selectedProduct.images || [],
      });
    }
  }, [selectedProduct]);

  // ✅ Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle number inputs
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  // ✅ Handle sizes (comma separated)
  const handleSizesChange = (e) => {
    const value = e.target.value;
    const sizesArray = value.split(",").map((s) => s.trim()).filter((s) => s);
    setProductData((prev) => ({ ...prev, sizes: sizesArray }));
  };

  // ✅ Handle colors (comma separated)
  const handleColorsChange = (e) => {
    const value = e.target.value;
    const colorsArray = value.split(",").map((c) => c.trim()).filter((c) => c);
    setProductData((prev) => ({ ...prev, colors: colorsArray }));
  };

  // ✅ Handle image upload
  // In EditProductPg.js - Update handleImageUpload

// ✅ Handle image upload
const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  console.log("📤 Selected file:", file.name);
  console.log("📦 File size:", (file.size / 1024).toFixed(2), "KB");

  // Validate file type
  if (!file.type.startsWith('image/')) {
    toast.error("Please upload an image file");
    e.target.value = "";
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    toast.error("Image must be less than 5MB");
    e.target.value = "";
    return;
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    setUploading(true);
    
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    console.log("✅ Upload response:", response.data);

    if (response.data.success) {
      // ✅ Fix: Construct full URL if needed
      let imageUrl = response.data.imageUrl;
      
      // If the URL is relative (starts with /uploads), make it absolute
      if (imageUrl.startsWith('/uploads')) {
        imageUrl = `${import.meta.env.VITE_BACKEND_URL}${imageUrl}`;
      }
      
      console.log("🖼️ Image URL:", imageUrl);

      setProductData((prev) => ({
        ...prev,
        images: [...prev.images, { url: imageUrl, altText: file.name }],
      }));
      
      toast.success("Image uploaded successfully!");
    } else {
      toast.error(response.data.message || "Upload failed");
    }
  } catch (error) {
    console.error("❌ Upload error:", error);
    toast.error(error.response?.data?.message || "Failed to upload image");
  } finally {
    setUploading(false);
    e.target.value = ""; // Reset file input
  }
};

  // ✅ Remove image
  const removeImage = (index) => {
    setProductData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    toast.info("Image removed");
  };

  // ✅ Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Validate required fields
    if (!prodData.name || !prodData.description || !prodData.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    // ✅ Validate SKU
    if (!prodData.sku) {
      toast.error("Please enter or generate a SKU");
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await dispatch(updateProduct({ 
        id, 
        productData: prodData 
      })).unwrap();
      
      toast.success("Product updated successfully! 🎉");
      navigate("/admin/products");
    } catch (error) {
      console.error("Update error:", error);
      toast.error(error?.message || "Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error: {error}</p>
        <button 
          onClick={() => dispatch(fetchProdsDetails(id))}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Product</h2>

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        {/* Product Name */}
        <div className="mb-4">
          <label className="block font-semibold mb-2 text-sm">Product Name *</label>
          <input
            type="text"
            name="name"
            value={prodData.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block font-semibold mb-2 text-sm">Description *</label>
          <textarea
            name="description"
            value={prodData.description}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          />
        </div>

        {/* Price & Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block font-semibold mb-2 text-sm">Price *</label>
            <input
              type="number"
              name="price"
              value={prodData.price}
              onChange={handleNumberChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2 text-sm">Stock Count *</label>
            <input
              type="number"
              name="countInStock"
              value={prodData.countInStock}
              onChange={handleNumberChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              required
            />
          </div>
        </div>

        {/* SKU & Category - WITH GENERATE SKU BUTTON */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block font-semibold mb-2 text-sm">SKU *</label>
            <div className="flex gap-2">
              <input
                type="text"
                name="sku"
                value={prodData.sku}
                onChange={handleChange}
                className="flex-1 border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter SKU or generate one"
                required
              />
              <button
                type="button"
                onClick={handleGenerateSKU}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors whitespace-nowrap text-sm font-medium"
              >
                Generate
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              SKU must be unique for each product
            </p>
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2 text-sm">Category *</label>
            <input
              type="text"
              name="category"
              value={prodData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Top Wear, Bottom Wear, Shoes"
              required
            />
          </div>
        </div>

        {/* Brand & Collection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block font-semibold mb-2 text-sm">Brand</label>
            <input
              type="text"
              name="brand"
              value={prodData.brand}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Nike, Gucci, H&M"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2 text-sm">Collection</label>
            <input
              type="text"
              name="collections"
              value={prodData.collections}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Summer 2024, Winter Collection"
            />
          </div>
        </div>

        {/* Material & Gender */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block font-semibold mb-2 text-sm">Material</label>
            <input
              type="text"
              name="material"
              value={prodData.material}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Cotton, Denim, Silk"
            />
          </div>

          <div className="mb-4">
            <label className="block font-semibold mb-2 text-sm">Gender</label>
            <select
              name="gender"
              value={prodData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Gender</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>
        </div>

        {/* Sizes */}
        <div className="mb-4">
          <label className="block font-semibold mb-2 text-sm">
            Sizes (comma-separated) *
          </label>
          <input
            type="text"
            name="sizes"
            value={prodData.sizes.join(", ")}
            onChange={handleSizesChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. S, M, L, XL"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Current sizes: {prodData.sizes.join(", ") || "None"}
          </p>
        </div>

        {/* Colors */}
        <div className="mb-4">
          <label className="block font-semibold mb-2 text-sm">
            Colors (comma-separated) *
          </label>
          <input
            type="text"
            name="colors"
            value={prodData.colors.join(", ")}
            onChange={handleColorsChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g. Red, Blue, Black"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Current colors: {prodData.colors.join(", ") || "None"}
          </p>
        </div>

        {/* Images */}
        <div className="mb-4">
          <label className="block font-semibold mb-2 text-sm">Product Images</label>
          
          <div className="flex items-center gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploading && (
              <span className="text-blue-500 text-sm">Uploading...</span>
            )}
          </div>

          {/* Image Preview */}
          <div className="flex flex-wrap gap-4 mt-4">
            {prodData.images.map((img, index) => (
              <div key={index} className="relative group">
                <img
                  src={img.url}
                  alt={img.altText || `Product image ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg border shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition"
                >
                  ✕
                </button>
              </div>
            ))}
            {prodData.images.length === 0 && (
              <p className="text-gray-400 text-sm">No images uploaded</p>
            )}
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={isSubmitting || uploading}
            className="flex-1 bg-green-500 text-white py-3 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Updating..." : "Update Product"}
          </button>
          
          <button
            type="button"
            onClick={() => navigate("/admin/products")}
            className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPg;