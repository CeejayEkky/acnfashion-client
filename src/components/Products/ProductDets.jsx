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
  const { user, guestId } = useSelector((state) => state.auth);
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
      })
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
    <div className="p-3 md:p-6">
      {selectedProduct && (
        <>
          {/* ✅ Product Details - Mobile First */}
          <div className="max-w-6xl mx-auto bg-white p-4 md:p-8 rounded-lg">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
              {/* ✅ Images - Stack on mobile, side by side on desktop */}
              <div className="md:w-1/2">
                {/* Main Image */}
                <div className="mb-3">
                  <img
                    src={mainImg}
                    alt="Main Prod"
                    className="w-full h-auto max-h-96 md:max-h-[500px] object-cover rounded-lg"
                  />
                </div>

                {/* Thumbnails - Horizontal scroll on mobile */}
                <div className="flex gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:absolute md:left-0 md:top-0 md:flex-col md:space-y-2 md:w-20">
                  {selectedProduct.images?.map((img, i) => (
                    <img
                      key={i}
                      src={img.url}
                      alt={img.altText || `Thumbnail ${i}`}
                      className={`w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg cursor-pointer border-2 flex-shrink-0 ${
                        mainImg === img.url ? "border-black" : "border-gray-200"
                      }`}
                      onClick={() => setMainImg(img.url)}
                    />
                  ))}
                </div>
              </div>

              {/* ✅ Product Info - Full width on mobile */}
              <div className="md:w-1/2">
                <h1 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-2">
                  {selectedProduct.name}
                </h1>

                <p className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                  ₦{selectedProduct.price}
                </p>
                
                {selectedProduct.discountPrice && (
                  <p className="text-sm text-gray-400 line-through mb-2">
                    ₦{selectedProduct.discountPrice}
                  </p>
                )}

                <p className="text-gray-600 text-sm md:text-base mb-4">
                  {selectedProduct.description}
                </p>

                {/* ✅ Color Selection - Responsive grid */}
                <div className="mb-4">
                  <p className="text-gray-700 font-medium mb-2">Color:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.colors?.map((col) => (
                      <button
                        key={col}
                        onClick={() => setSelCol(col)}
                        className={`w-8 h-8 md:w-10 md:h-10 rounded-full border-2 transition ${
                          selCol === col
                            ? "border-black ring-2 ring-blue-500 ring-offset-2"
                            : "border-gray-300"
                        }`}
                        style={{
                          backgroundColor: col.toLowerCase(),
                        }}
                        title={col}
                      />
                    ))}
                  </div>
                  {selCol && (
                    <p className="text-xs text-gray-500 mt-1">Selected: {selCol}</p>
                  )}
                </div>

                {/* ✅ Size Selection - Responsive grid */}
                <div className="mb-4">
                  <p className="text-gray-700 font-medium mb-2">Size:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedProduct.sizes?.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelSize(size)}
                        className={`px-4 py-2 rounded border text-sm md:text-base transition ${
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

                {/* ✅ Quantity */}
                <div className="mb-4">
                  <p className="text-gray-700 font-medium mb-2">Quantity:</p>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => hQtyChange("dec")}
                      className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold hover:bg-gray-300 transition"
                    >
                      -
                    </button>
                    <span className="text-lg font-medium w-8 text-center">{quantity}</span>
                    <button
                      onClick={() => hQtyChange("inc")}
                      className="w-8 h-8 md:w-10 md:h-10 bg-gray-200 rounded-full flex items-center justify-center text-lg font-bold hover:bg-gray-300 transition"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* ✅ Add to Cart - Full width on mobile */}
                <button
                  disabled={isBtnDisabled}
                  onClick={hAddToCart}
                  className={`w-full bg-black text-white py-3 md:py-4 rounded-lg font-medium text-sm md:text-base transition ${
                    isBtnDisabled
                      ? "cursor-not-allowed opacity-50"
                      : "hover:bg-gray-800"
                  }`}
                >
                  {isBtnDisabled ? "Adding..." : "ADD TO CART"}
                </button>

                {/* ✅ Product Features */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Product Details</h3>
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
          <div className="max-w-6xl mx-auto mt-8">
            <div className="border-t border-gray-200 pt-8">
              <h2 className="text-xl md:text-2xl font-bold mb-6 glow-text">
                ⭐ Customer Reviews
              </h2>
              <Reviews productId={productFetchId} limit={4} />
            </div>
          </div>

          {/* ✅ Similar Products */}
          <div className="max-w-6xl mx-auto mt-8">
            <h2 className="text-xl md:text-2xl text-center font-medium mb-6">
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