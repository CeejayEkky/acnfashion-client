// frontend/src/components/Products/ProductDets.js
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import ProdGrids from "./ProdGrids";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProdsDetails,
  fetchSimilarProducts,
} from "../../redux/slices/productSlice.js";
import { addToCart } from "../../redux/slices/cartSlice.js";
import Reviews from "../Reviews/Reviews";

const ProductDets = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const { user } = useSelector((state) => state.auth);
  const [mainImg, setMainImg] = useState(null);
  const [selSize, setSelSize] = useState("");
  const [selCol, setSelCol] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProdsDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  const hQtyChange = (action) => {
    if (action === "inc") setQuantity((prev) => prev + 1);
    if (action === "dec" && quantity > 1) setQuantity((prev) => prev - 1);
  };

  const hAddToCart = () => {
    if (!selSize || !selCol) {
      toast.error("Kindly pick a size and color before adding to cart");
      return;
    }

    setIsBtnDisabled(true);

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity: quantity,
        size: selSize,
        color: selCol,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Product added to cart!");
      })
      .catch((error) => {
        toast.error(error?.message || "Failed to add to cart");
      })
      .finally(() => {
        setIsBtnDisabled(false);
      });
  };

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImg(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

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
      </div>
    );
  }

  if (!selectedProduct) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* ✅ Product Details - Clean Grid */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 p-4 md:p-6">
          {/* ✅ LEFT - Images */}
          <div className="lg:w-1/2">
            {/* Main Image */}
            <div className="bg-gray-50 rounded-lg overflow-hidden mb-3">
              <img
                src={mainImg}
                alt={selectedProduct.name}
                className="w-full h-auto max-h-100 md:max-h-125 object-contain"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {selectedProduct.images?.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt={img.altText || `Thumbnail ${i}`}
                  className={`w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg cursor-pointer border-2 shrink-0 transition ${
                    mainImg === img.url ? "border-blue-500" : "border-gray-200 hover:border-gray-400"
                  }`}
                  onClick={() => setMainImg(img.url)}
                />
              ))}
            </div>
          </div>

          {/* ✅ RIGHT - Product Info */}
          <div className="lg:w-1/2 space-y-4">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              {selectedProduct.name}
            </h1>

            <div className="flex items-center gap-3">
              <span className="text-2xl md:text-3xl font-bold text-blue-600">
                ₦{selectedProduct.price.toLocaleString()}
              </span>
              {selectedProduct.discountPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ₦{selectedProduct.discountPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed">
              {selectedProduct.description}
            </p>

            {/* ✅ Color Selection */}
            {selectedProduct.colors?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Color:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.colors.map((col) => (
                    <button
                      key={col}
                      onClick={() => setSelCol(col)}
                      className={`w-8 h-8 rounded-full border-2 transition ${
                        selCol === col
                          ? "border-blue-500 ring-2 ring-blue-200"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                      style={{ backgroundColor: col.toLowerCase() }}
                      title={col}
                    />
                  ))}
                </div>
                {selCol && (
                  <p className="text-xs text-gray-500 mt-1">Selected: {selCol}</p>
                )}
              </div>
            )}

            {/* ✅ Size Selection */}
            {selectedProduct.sizes?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Size:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelSize(size)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                        selSize === size
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-300 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {selSize && (
                  <p className="text-xs text-gray-500 mt-1">Selected: {selSize}</p>
                )}
              </div>
            )}

            {/* ✅ Quantity */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Quantity:</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => hQtyChange("dec")}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg hover:bg-gray-100 transition"
                >
                  -
                </button>
                <span className="w-10 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => hQtyChange("inc")}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-lg hover:bg-gray-100 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* ✅ Add to Cart */}
            <button
              onClick={hAddToCart}
              disabled={isBtnDisabled}
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBtnDisabled ? "Adding..." : "Add to Cart"}
            </button>

            {/* ✅ Product Info Table */}
            <div className="pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-1 text-sm">
                <span className="text-gray-500">Brand:</span>
                <span className="text-gray-700">{selectedProduct.brand || "N/A"}</span>
                <span className="text-gray-500">Material:</span>
                <span className="text-gray-700">{selectedProduct.material || "N/A"}</span>
                <span className="text-gray-500">Category:</span>
                <span className="text-gray-700">{selectedProduct.category || "N/A"}</span>
                <span className="text-gray-500">Gender:</span>
                <span className="text-gray-700">{selectedProduct.gender || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Reviews Section */}
      <div className="mt-8">
        <div className="border-t border-gray-200 pt-8">
          <h2 className="text-xl font-bold mb-6">⭐ Customer Reviews</h2>
          <Reviews productId={productFetchId} limit={4} />
        </div>
      </div>

      {/* ✅ You May Also Like */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-center mb-6">You May Also Like</h2>
        <ProdGrids products={similarProducts} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default ProductDets;