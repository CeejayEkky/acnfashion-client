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
import Reviews from "../Reviews/Reviews"; // ✅ Add this import
import { fetchReviews } from "../../redux/slices/reviewSlice";
import axios from "axios";

const ProductDets = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products,
  );
  const { user, guestId } = useSelector((state) => state.auth);
  const [mainImg, setMainImg] = useState(null);
  const [selSize, setSelSize] = useState("");
  const [selCol, setSelCol] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [reviewStats, setReviewStats] = useState({ avgRating: 0, total: 0 });

  const productFetchId = productId || id;

  useEffect(() => {
    if (productFetchId) {
      const fetchReviewStats = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/reviews?productId=${productFetchId}`,
          );
          setReviewStats({
            avgRating: response.data.avgRating || 0,
            total: response.data.total || 0,
          });
        } catch (error) {
          console.error("Error fetching review stats:", error);
        }
      };
      fetchReviewStats();
    }
  }, [productFetchId]);

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
      toast.error("Kindly pick a size and color before adding to cart", {
        duration: 1000,
      });
      return;
    }

    setIsBtnDisabled(true);

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity: quantity,
        size: selSize,
        color: selCol,
        guestId,
        userId: user?._id,
      }),
    )
      .then(() => {
        toast.success("Product added to cart!", {
          duration: 2000,
        });
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

  return (
    <div className="p-6">
      {selectedProduct && (
        <>
          {/* Product Details - Your existing code */}
          <div className="max-w-6xl mx-auto bg-white p-8 rounded-lg">
            <div className="flex flex-col md:flex-row">
              {/* Thumbnails - Left */}
              <div className="hidden md:flex flex-col space-y-4 mr-6">
                {selectedProduct.images?.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={img.altText || `Thumbnail ${i}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                      mainImg === img.url ? "border-black" : "border-gray-300"
                    }`}
                    onClick={() => setMainImg(img.url)}
                  />
                ))}
              </div>

              {/* Main Image */}
              <div className="md:w-1/2">
                <div className="mb-4">
                  <img
                    src={mainImg}
                    alt="Main Prod"
                    className="w-full h-auto object-cover rounded-lg"
                  />
                </div>
              </div>

              {/* Mobile Thumbnails */}
              <div className="md:hidden flex overscroll-x-scroll space-x-4 mb-4">
                {selectedProduct.images?.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={img.altText || `Thumbnail ${i}`}
                    className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                      mainImg === img.url ? "border-black" : "border-gray-300"
                    }`}
                    onClick={() => setMainImg(img.url)}
                  />
                ))}
              </div>

              {/* Product Info - Right */}
              <div className="md:w-1/2 md:ml-10">
                <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                  {selectedProduct.name}
                </h1>

                <p className="text-lg text-gray-600 mb-1 line-through">
                  {selectedProduct.originalPrice &&
                    `${selectedProduct.originalPrice}`}
                </p>
                <p className="text-xl text-gray-500 mb-2">
                  ₦{selectedProduct.price}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>
                        {i < Math.round(reviewStats.avgRating) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    ({reviewStats.total} reviews)
                  </span>
                </div>
                <p className="text-gray-600 mb-4">
                  {selectedProduct.description}
                </p>

                {/* Color Selection */}
                <div className="mb-4">
                  <p className="text-gray-700">Color:</p>
                  <div className="flex gap-2 mt-2">
                    {selectedProduct.colors?.map((col) => (
                      <button
                        key={col}
                        onClick={() => setSelCol(col)}
                        className={`w-8 h-8 rounded-full border ${
                          selCol === col
                            ? "border-4 border-black"
                            : "border-gray-300"
                        }`}
                        style={{
                          backgroundColor: col.toLowerCase(),
                          filter: "brightness(0.5)",
                        }}
                      ></button>
                    ))}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="mb-4">
                  <p className="text-gray-700">Size:</p>
                  <div className="flex gap-2 mt-2">
                    {selectedProduct.sizes?.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelSize(size)}
                        className={`px-4 py-2 rounded border ${
                          selSize === size ? "bg-black text-white" : ""
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-6">
                  <p className="text-gray-700">Quantity:</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <button
                      onClick={() => hQtyChange("dec")}
                      className="px-2 py-1 bg-gray-200 rounded text-lg"
                    >
                      -
                    </button>
                    <span className="text-lg">{quantity}</span>
                    <button
                      onClick={() => hQtyChange("inc")}
                      className="px-2 py-1 bg-gray-200 rounded text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  disabled={isBtnDisabled}
                  onClick={hAddToCart}
                  className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${
                    isBtnDisabled
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-gray-900"
                  }`}
                >
                  {isBtnDisabled ? "Adding Now..." : "ADD TO CART"}
                </button>

                {/* Product Features */}
                <div className="mt-10 text-gray-700">
                  <h3 className="text-xl font-bold mb-4">Features:</h3>
                  <table className="w-full text-left text-sm text-gray-600">
                    <tbody>
                      <tr>
                        <td className="py-1">Brand:</td>
                        <td className="py-1">{selectedProduct.brand}</td>
                      </tr>
                      <tr>
                        <td className="py-1">Material:</td>
                        <td className="py-1">{selectedProduct.material}</td>
                      </tr>
                      <tr>
                        <td className="py-1">Category:</td>
                        <td className="py-1">{selectedProduct.category}</td>
                      </tr>
                      <tr>
                        <td className="py-1">Gender:</td>
                        <td className="py-1">{selectedProduct.gender}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ CUSTOMER REVIEWS SECTION */}
          <div className="max-w-6xl mx-auto mt-12">
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-2xl font-bold mb-6 glow-text">
                ⭐ Customer Reviews
              </h2>

              {/* Pass the product ID to Reviews component */}
              <Reviews productId={productFetchId} limit={4} />
            </div>
          </div>

          {/* Similar Products */}
          <div className="max-w-6xl mx-auto mt-12">
            <h2 className="text-2xl text-center font-medium mb-6">
              You May Also Like
            </h2>
            <ProdGrids
              products={similarProducts}
              loading={loading}
              error={error}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ProductDets;
