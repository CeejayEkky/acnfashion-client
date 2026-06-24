// frontend/src/pages/MessageStatus.js
import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchMessageById, 
  fetchMessagesByEmail 
} from "../redux/slices/messageSlice";
import { 
  FaCheckCircle, 
  FaClock, 
  FaArrowLeft, 
  FaSpinner,
  FaSearch,
  FaCalendarAlt
} from "react-icons/fa";
import { toast } from "sonner";

const MessageStatus = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentMessage, customerMessages, loading } = useSelector((state) => state.messages);
  
  const [email, setEmail] = useState("");
  const [searching, setSearching] = useState(false);
  const [showAllMessages, setShowAllMessages] = useState(false);
  const [searched, setSearched] = useState(false);

  // ✅ If ID is provided, fetch single message
  useEffect(() => {
    if (id) {
      dispatch(fetchMessageById(id));
    } else {
      setShowAllMessages(true);
    }
  }, [dispatch, id]);

  // ✅ Search messages by email
  const searchByEmail = async (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error("Please enter a valid email address");
      return;
    }

    setSearching(true);
    setSearched(true);
    try {
      await dispatch(fetchMessagesByEmail(email)).unwrap();
    } catch (error) {
      toast.error("Failed to fetch messages");
    } finally {
      setSearching(false);
    }
  };

  // ✅ Format date
  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ✅ If loading
  if (loading && id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-3xl text-blue-500" />
      </div>
    );
  }

  // ✅ Show single message (from link)
  if (id && currentMessage) {
    const msg = currentMessage;
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-blue-100/30 px-4 py-8">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">
            Message Status
          </h1>
          
          <div className="border-b border-gray-200 pb-4 mb-4">
            <p className="text-xs text-gray-400">Subject</p>
            <p className="font-medium text-gray-800">{msg.subject}</p>
          </div>

          <div className="border-b border-gray-200 pb-4 mb-4">
            <p className="text-xs text-gray-400">Your Message</p>
            <p className="text-gray-600">{msg.message}</p>
          </div>

          {/* Status */}
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              msg.isReplied ? "bg-green-100" : "bg-yellow-100"
            }`}>
              {msg.isReplied ? (
                <FaCheckCircle className="text-2xl text-green-500" />
              ) : (
                <FaClock className="text-2xl text-yellow-500" />
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-800">
                {msg.isReplied ? "Replied ✅" : "Awaiting Reply ⏳"}
              </p>
              <p className="text-sm text-gray-500">
                {msg.isReplied 
                  ? `Replied on ${formatDate(msg.repliedAt)}`
                  : "Our team will respond within 24 hours"
                }
              </p>
            </div>
          </div>

          {/* Admin Reply */}
          {msg.isReplied && msg.reply && (
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <p className="text-xs text-blue-600 font-semibold">👤 Admin Reply:</p>
              <p className="text-gray-700 mt-1">{msg.reply}</p>
            </div>
          )}

          <div className="text-xs text-gray-400 text-center pt-4 border-t border-gray-100">
            <p>Sent: {formatDate(msg.createdAt)}</p>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition"
            >
              <FaArrowLeft />
              Back to Home
            </Link>
            <button
              onClick={() => navigate("/message-status")}
              className="inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition"
            >
              <FaSearch />
              Check Another Message
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Show message search (no ID provided)
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-blue-100/30 px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
            📬 Check Your Messages
          </h1>
          <p className="text-gray-500 text-center mb-6">
            Enter your email to see all your messages and their status
          </p>

          {/* Search Form */}
          <form onSubmit={searchByEmail} className="flex gap-2 mb-8">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
            <button
              type="submit"
              disabled={searching}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {searching ? <FaSpinner className="animate-spin" /> : <FaSearch />}
              Search
            </button>
          </form>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center py-8">
              <FaSpinner className="animate-spin text-2xl text-blue-500" />
            </div>
          )}

          {/* Messages List */}
          {!loading && customerMessages.length > 0 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Found {customerMessages.length} message{customerMessages.length > 1 ? 's' : ''}
              </p>
              
              {customerMessages.map((msg) => (
                <div key={msg._id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-gray-800">{msg.subject}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          msg.isReplied 
                            ? "bg-green-100 text-green-700" 
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {msg.isReplied ? "✅ Replied" : "⏳ Pending"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{msg.message}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt />
                          {formatDate(msg.createdAt)}
                        </span>
                        {msg.isReplied && msg.reply && (
                          <span className="text-green-600">Has reply</span>
                        )}
                      </div>
                    </div>
                    <Link
                      to={`/message-status/${msg._id}`}
                      className="text-blue-500 hover:text-blue-700 text-sm font-medium ml-4 whitespace-nowrap"
                    >
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && searched && customerMessages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-4xl mb-2">📭</p>
              <p className="text-gray-500">No messages found for this email</p>
              <p className="text-sm text-gray-400 mt-1">Send us a message and we'll get back to you!</p>
            </div>
          )}

          <Link
            to="/"
            className="mt-6 inline-flex items-center justify-center gap-2 w-full bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition"
          >
            <FaArrowLeft />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MessageStatus;