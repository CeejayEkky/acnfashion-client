// frontend/src/components/Reviews/Reviews.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  FaStar, FaRegStar, FaUser, 
  FaClock, FaThumbsUp, FaCheckCircle,
  FaQuoteLeft, FaPaperPlane
} from "react-icons/fa";
import { 
  fetchReviews, 
  submitReview, 
  markHelpful 
} from "../../redux/slices/reviewSlice";
import { toast } from "sonner";

const Reviews = ({ productId = null, limit = 6 }) => {
  const dispatch = useDispatch();
  const { reviews, total, avgRating, loading, submitting } = 
    useSelector((state) => state.reviews);
  const { user } = useSelector((state) => state.auth);
  
  const [showAll, setShowAll] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    rating: 5,
    comment: "",
    location: "",
  });
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    dispatch(fetchReviews({ productId, limit: showAll ? 20 : limit }));
  }, [dispatch, productId, limit, showAll]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRatingClick = (rating) => {
    setFormData({ ...formData, rating });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to submit a review");
      return;
    }
    
    if (!formData.comment.trim()) {
      toast.error("Please write your review");
      return;
    }
    
    try {
      await dispatch(submitReview({
        productId,
        rating: formData.rating,
        comment: formData.comment,
        location: formData.location || "Nigeria",
      })).unwrap();
      
      toast.success("✅ Review submitted for approval!");
      setFormData({ rating: 5, comment: "", location: "" });
      setShowForm(false);
      dispatch(fetchReviews({ productId, limit: showAll ? 20 : limit }));
    } catch (error) {
      toast.error(error.message || "Failed to submit review");
    }
  };

  const handleHelpful = async (reviewId) => {
    try {
      await dispatch(markHelpful(reviewId)).unwrap();
      toast.success("Thanks for your feedback!");
    } catch (error) {
      toast.error("Failed to mark as helpful");
    }
  };

  // ✅ Check if review belongs to current user
  const isUserReview = (review) => {
    return user && review.user === user._id;
  };

  // Render stars
  const renderStars = (rating, interactive = false) => {
    const stars = [];
    const displayRating = interactive ? hoverRating || formData.rating : rating;
    
    for (let i = 1; i <= 5; i++) {
      if (interactive) {
        stars.push(
          <button
            key={i}
            type="button"
            onClick={() => handleRatingClick(i)}
            onMouseEnter={() => setHoverRating(i)}
            onMouseLeave={() => setHoverRating(0)}
            className="text-3xl transition-colors"
          >
            {i <= displayRating ? (
              <FaStar className="text-yellow-400" />
            ) : (
              <FaRegStar className="text-gray-300 hover:text-yellow-400" />
            )}
          </button>
        );
      } else {
        stars.push(
          <span key={i} className={i <= rating ? "text-yellow-400" : "text-gray-300"}>
            ★
          </span>
        );
      }
    }
    return stars;
  };

  const displayedReviews = showAll ? reviews : reviews.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800">Customer Reviews</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex">{renderStars(Math.round(avgRating || 0))}</div>
            <span className="text-sm text-gray-500">({total || 0} reviews)</span>
          </div>
        </div>
        
        {user && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
          >
            ✍️ Write Review
          </button>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-32">
          <div className="loader" />
        </div>
      )}

      {/* Reviews List */}
      {!loading && (
        <div className="space-y-4">
          {displayedReviews.length > 0 ? (
            displayedReviews.map((review) => {
              const isOwnReview = isUserReview(review);
              
              return (
                <div key={review._id} className="bg-white rounded-xl p-4 border border-gray-100">
                  {/* Review Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                        {review.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">
                          {review.name}
                          {isOwnReview && (
                            <span className="ml-2 text-xs text-blue-500">(You)</span>
                          )}
                        </p>
                        <p className="text-xs text-gray-400">{review.location || "Nigeria"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex">{renderStars(review.rating)}</div>
                      <button
                        onClick={() => handleHelpful(review._id)}
                        className="flex items-center gap-1 text-xs text-gray-400 hover:text-blue-500 transition"
                      >
                        <FaThumbsUp />
                        <span>{review.helpful || 0}</span>
                      </button>
                    </div>
                  </div>

                  {/* Review Content */}
                  <p className="text-gray-600 text-sm mt-3">{review.comment}</p>

                  {/* ✅ PENDING STATUS - Only visible to the review owner */}
                  {!review.isApproved && isOwnReview && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-xs text-yellow-700 flex items-center gap-1">
                        <FaClock className="text-yellow-500" />
                        ⏳ Your review is pending approval from admin
                      </p>
                    </div>
                  )}

                  {/* ✅ APPROVED STATUS - Only visible to the review owner */}
                  {review.isApproved && isOwnReview && (
                    <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-xs text-green-700 flex items-center gap-1">
                        <FaCheckCircle className="text-green-500" />
                        ✅ Your review is public! Other customers can see it.
                      </p>
                    </div>
                  )}

                  {/* Admin Reply */}
                  {review.reply && (
                    <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600 font-semibold">👤 Admin Response:</p>
                      <p className="text-sm text-gray-600">{review.reply}</p>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-2xl mb-2">💬</p>
              <p className="text-gray-500">No reviews yet. Be the first!</p>
            </div>
          )}
        </div>
      )}

      {/* Show More */}
      {reviews.length > 3 && (
        <div className="text-center mt-4">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-blue-500 hover:text-blue-700 font-medium text-sm"
          >
            {showAll ? "Show Less" : `Show All ${total || reviews.length} Reviews`}
          </button>
        </div>
      )}

      {/* Write Review Form */}
      {showForm && (
        <div className="mt-6 bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold text-gray-800">Write Your Review</h4>
            <button
              onClick={() => setShowForm(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* ✅ Show user info */}
          <div className="mb-4 p-2 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-700 flex items-center gap-2">
              <FaUser className="text-blue-500" />
              Reviewing as: <strong>{user?.name}</strong>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <div className="flex gap-1">
                {renderStars(formData.rating, true)}
                <span className="ml-2 text-sm text-gray-500">
                  {formData.rating} / 5
                </span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                rows="3"
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Share your experience..."
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location (Optional)
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. Lagos, Nigeria"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                <>
                  <FaPaperPlane />
                  Submit Review
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 text-center mt-2">
              Your review will be published after admin approval
            </p>
          </form>
        </div>
      )}
    </div>
  );
};

export default Reviews;