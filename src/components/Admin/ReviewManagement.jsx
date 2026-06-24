// frontend/src/components/Admin/ReviewManagement.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchAllReviewsAdmin, 
  updateReviewAdmin, 
  deleteReviewAdmin 
} from "../../redux/slices/reviewSlice";
import { FaCheck, FaTimes, FaTrash, FaReply, FaStar, FaUser, FaClock, FaEye } from "react-icons/fa";
import { toast } from "sonner";

const ReviewManagement = () => {
  const dispatch = useDispatch();
  const { adminReviews, loading } = useSelector((state) => state.reviews);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedReview, setExpandedReview] = useState(null);

  useEffect(() => {
    dispatch(fetchAllReviewsAdmin());
  }, [dispatch]);

  const handleApprove = async (id) => {
    try {
      await dispatch(updateReviewAdmin({ id, data: { isApproved: true } })).unwrap();
      toast.success("✅ Review approved! It will now appear on the product page.");
    } catch (error) {
      toast.error("Failed to approve review");
    }
  };

  const handleReject = async (id) => {
    try {
      await dispatch(updateReviewAdmin({ id, data: { isApproved: false } })).unwrap();
      toast.success("❌ Review rejected");
    } catch (error) {
      toast.error("Failed to reject review");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this review permanently?")) {
      try {
        await dispatch(deleteReviewAdmin(id)).unwrap();
        toast.success("🗑️ Review deleted");
      } catch (error) {
        toast.error("Failed to delete review");
      }
    }
  };

  const handleReply = async (id) => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }
    try {
      await dispatch(updateReviewAdmin({ id, data: { reply: replyText } })).unwrap();
      toast.success("💬 Reply added!");
      setReplyingId(null);
      setReplyText("");
    } catch (error) {
      toast.error("Failed to add reply");
    }
  };

  // Filter reviews
  const filteredReviews = adminReviews.filter(review => {
    if (filter === "pending") return !review.isApproved;
    if (filter === "approved") return review.isApproved;
    return true;
  });

  const pendingCount = adminReviews.filter(r => !r.isApproved).length;

  // Render stars
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? "text-yellow-400" : "text-gray-300"}>
        ★
      </span>
    ));
  };

  // Truncate text
  const truncateText = (text, max = 60) => {
    if (text.length <= max) return text;
    return text.substring(0, max) + "...";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">📝 Review Management</h2>
          {pendingCount > 0 && (
            <p className="text-sm text-yellow-600 mt-1">
              ⚠️ {pendingCount} review{pendingCount > 1 ? 's' : ''} pending approval
            </p>
          )}
        </div>
        
        {/* Filter Buttons */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === "all" 
                ? "bg-blue-500 text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All ({adminReviews.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === "pending" 
                ? "bg-yellow-500 text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === "approved" 
                ? "bg-green-500 text-white" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Approved
          </button>
        </div>
      </div>

      {/* Reviews Cards - Mobile Friendly */}
      <div className="space-y-4">
        {filteredReviews.length > 0 ? (
          filteredReviews.map((review) => (
            <div key={review._id} className="bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition">
              {/* Top Row - Customer Info & Status */}
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-sm">
                    {review.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{review.name}</p>
                    <p className="text-xs text-gray-400">{review.email}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <FaClock className="text-[10px]" />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    review.isApproved 
                      ? "bg-green-100 text-green-700" 
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {review.isApproved ? "✅ Approved" : "⏳ Pending"}
                  </span>
                  <div className="flex">
                    {renderStars(review.rating)}
                  </div>
                </div>
              </div>

              {/* Review Content */}
              <div className="mt-3">
                <p className="text-gray-600 text-sm">
                  {expandedReview === review._id 
                    ? review.comment 
                    : truncateText(review.comment, 80)}
                </p>
                {review.comment.length > 80 && (
                  <button
                    onClick={() => setExpandedReview(expandedReview === review._id ? null : review._id)}
                    className="text-xs text-blue-500 hover:text-blue-700 mt-1"
                  >
                    {expandedReview === review._id ? "Show less" : "Read more"}
                  </button>
                )}
              </div>

              {/* Admin Reply */}
              {review.reply && (
                <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-100">
                  <p className="text-xs text-blue-600 font-semibold">👤 Admin Reply:</p>
                  <p className="text-sm text-gray-600">{review.reply}</p>
                </div>
              )}

              {/* Reply Input */}
              {replyingId === review._id && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleReply(review._id)}
                  />
                  <button
                    onClick={() => handleReply(review._id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition"
                  >
                    Send
                  </button>
                  <button
                    onClick={() => {
                      setReplyingId(null);
                      setReplyText("");
                    }}
                    className="bg-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mt-3 flex flex-wrap gap-2 pt-3 border-t border-gray-100">
                {!review.isApproved ? (
                  <>
                    <button
                      onClick={() => handleApprove(review._id)}
                      className="bg-green-500 text-white px-4 py-1.5 rounded-lg text-xs hover:bg-green-600 transition flex items-center gap-1"
                    >
                      <FaCheck /> Approve
                    </button>
                    <button
                      onClick={() => handleReject(review._id)}
                      className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-xs hover:bg-red-600 transition flex items-center gap-1"
                    >
                      <FaTimes /> Reject
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleReject(review._id)}
                    className="bg-yellow-500 text-white px-4 py-1.5 rounded-lg text-xs hover:bg-yellow-600 transition"
                  >
                    Unapprove
                  </button>
                )}
                <button
                  onClick={() => setReplyingId(review._id)}
                  className="bg-blue-500 text-white px-4 py-1.5 rounded-lg text-xs hover:bg-blue-600 transition flex items-center gap-1"
                >
                  <FaReply /> Reply
                </button>
                <button
                  onClick={() => handleDelete(review._id)}
                  className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-xs hover:bg-red-700 transition flex items-center gap-1"
                >
                  <FaTrash /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-4xl mb-2">📭</p>
            <p className="text-lg text-gray-500">No reviews found</p>
            <p className="text-sm text-gray-400">Reviews will appear here once customers submit them</p>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-xl p-4 shadow">
          <p className="text-2xl font-bold text-gray-800">{adminReviews.length}</p>
          <p className="text-sm text-gray-500">Total Reviews</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow">
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          <p className="text-sm text-gray-500">Pending</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow">
          <p className="text-2xl font-bold text-green-600">{adminReviews.filter(r => r.isApproved).length}</p>
          <p className="text-sm text-gray-500">Approved</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow">
          <p className="text-2xl font-bold text-blue-600">
            {adminReviews.length > 0 
              ? (adminReviews.reduce((acc, r) => acc + r.rating, 0) / adminReviews.length).toFixed(1)
              : "0"
            }
          </p>
          <p className="text-sm text-gray-500">Avg Rating</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewManagement;