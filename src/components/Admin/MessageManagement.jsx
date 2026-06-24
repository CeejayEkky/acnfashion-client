// frontend/src/components/Admin/MessageManagement.js
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
  fetchMessagesAdmin, 
  markMessageRead, 
  replyMessage, 
  deleteMessage,
  getUnreadCount
} from "../../redux/slices/messageSlice";
import { FaReply, FaTrash, FaCheck, FaEnvelope, FaEnvelopeOpen, FaUser, FaClock, FaSpinner } from "react-icons/fa";
import { toast } from "sonner";

const MessageManagement = () => {
  const dispatch = useDispatch();
  const { messages, unreadCount, loading } = useSelector((state) => state.messages);
  const [replyingId, setReplyingId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedMessage, setExpandedMessage] = useState(null);

  useEffect(() => {
    dispatch(fetchMessagesAdmin());
    
    // ✅ Poll for new messages every 5 seconds (real-time)
    const interval = setInterval(() => {
      dispatch(getUnreadCount());
    }, 5000);
    
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleMarkRead = async (id) => {
    try {
      await dispatch(markMessageRead(id)).unwrap();
      toast.success("Marked as read");
    } catch (error) {
      toast.error("Failed to mark as read");
    }
  };

  const handleReply = async (id) => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply");
      return;
    }
    try {
      await dispatch(replyMessage({ id, reply: replyText })).unwrap();
      setReplyingId(null);
      setReplyText("");
      dispatch(fetchMessagesAdmin());
    } catch (error) {
      toast.error("Failed to send reply");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await dispatch(deleteMessage(id)).unwrap();
        dispatch(fetchMessagesAdmin());
      } catch (error) {
        toast.error("Failed to delete message");
      }
    }
  };

  // Filter messages
  const filteredMessages = messages.filter(msg => {
    if (filter === "unread") return !msg.isRead;
    if (filter === "read") return msg.isRead;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-3xl text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">📬 Messages</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-blue-600 mt-1">
              🔵 {unreadCount} unread message{unreadCount > 1 ? 's' : ''}
            </p>
          )}
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === "all" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === "unread" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setFilter("read")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === "read" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Read
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg) => (
            <div 
              key={msg._id} 
              className={`bg-white rounded-xl shadow-md p-4 border-l-4 transition ${
                !msg.isRead ? "border-blue-500 bg-blue-50/30" : "border-gray-200"
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    !msg.isRead ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                  }`}>
                    {!msg.isRead ? <FaEnvelope /> : <FaEnvelopeOpen />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800">{msg.name}</p>
                      {!msg.isRead && (
                        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">New</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{msg.email}</p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <FaClock className="text-[10px]" />
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {!msg.isRead && (
                    <button
                      onClick={() => handleMarkRead(msg._id)}
                      className="text-xs bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                    >
                      <FaCheck /> Mark Read
                    </button>
                  )}
                  <button
                    onClick={() => setReplyingId(msg._id)}
                    className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                  >
                    <FaReply /> Reply
                  </button>
                  <button
                    onClick={() => handleDelete(msg._id)}
                    className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>

              {/* Subject */}
              <p className="text-sm font-medium text-gray-700 mt-2">
                Subject: {msg.subject}
              </p>

              {/* Message */}
              <p className="text-sm text-gray-600 mt-1">
                {expandedMessage === msg._id ? msg.message : msg.message.substring(0, 150)}
                {msg.message.length > 150 && (
                  <button
                    onClick={() => setExpandedMessage(expandedMessage === msg._id ? null : msg._id)}
                    className="text-xs text-blue-500 hover:text-blue-700 ml-1"
                  >
                    {expandedMessage === msg._id ? "Show less" : "...Read more"}
                  </button>
                )}
              </p>

              {/* Phone */}
              {msg.phone && (
                <p className="text-xs text-gray-400 mt-1">📞 Phone: {msg.phone}</p>
              )}

              {/* Reply */}
              {msg.reply && (
                <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs text-green-600 font-semibold">👤 Admin Reply:</p>
                  <p className="text-sm text-gray-600">{msg.reply}</p>
                  {msg.repliedAt && (
                    <p className="text-xs text-gray-400 mt-1">
                      Replied: {new Date(msg.repliedAt).toLocaleString()}
                    </p>
                  )}
                </div>
              )}

              {/* Reply Input */}
              {replyingId === msg._id && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleReply(msg._id)}
                  />
                  <button
                    onClick={() => handleReply(msg._id)}
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
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-4xl mb-2">📭</p>
            <p className="text-lg text-gray-500">No messages yet</p>
            <p className="text-sm text-gray-400">Messages from customers will appear here</p>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-xl p-4 shadow">
          <p className="text-2xl font-bold text-gray-800">{messages.length}</p>
          <p className="text-sm text-gray-500">Total Messages</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow">
          <p className="text-2xl font-bold text-blue-600">{unreadCount}</p>
          <p className="text-sm text-gray-500">Unread</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow">
          <p className="text-2xl font-bold text-green-600">{messages.filter(m => m.isReplied).length}</p>
          <p className="text-sm text-gray-500">Replied</p>
        </div>
      </div>
    </div>
  );
};

export default MessageManagement;