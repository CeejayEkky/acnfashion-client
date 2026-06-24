// frontend/src/redux/slices/messageSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "sonner";

// ✅ Helper to convert Date objects to strings
const serializeMessage = (msg) => {
  if (!msg) return msg;
  return {
    ...msg,
    createdAt: msg.createdAt ? new Date(msg.createdAt).toISOString() : null,
    updatedAt: msg.updatedAt ? new Date(msg.updatedAt).toISOString() : null,
    readAt: msg.readAt ? new Date(msg.readAt).toISOString() : null,
    repliedAt: msg.repliedAt ? new Date(msg.repliedAt).toISOString() : null,
  };
};

const serializeMessages = (messages) => {
  if (!Array.isArray(messages)) return [];
  return messages.map(serializeMessage);
};

// ✅ Submit message (public)
export const submitMessage = createAsyncThunk(
  "messages/submitMessage",
  async (messageData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/messages`,
        messageData
      );
      
      toast.success("Message sent successfully! ✅");
      
      // ✅ Serialize the response
      const data = response.data;
      if (data.data) {
        data.data = serializeMessage(data.data);
      }
      
      return data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to send message";
      toast.error(errorMsg);
      return rejectWithValue(error.response?.data || { message: errorMsg });
    }
  }
);

// ✅ Fetch all messages (admin)
export const fetchMessagesAdmin = createAsyncThunk(
  "messages/fetchMessagesAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const cleanToken = token?.trim().replace(/^"|"$/g, '').replace(/\s/g, '');
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/messages/admin`,
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
          },
        }
      );
      
      // ✅ Serialize all messages
      return {
        ...response.data,
        messages: serializeMessages(response.data.messages),
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch messages" });
    }
  }
);

// ✅ Get unread count (admin)
export const getUnreadCount = createAsyncThunk(
  "messages/getUnreadCount",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const cleanToken = token?.trim().replace(/^"|"$/g, '').replace(/\s/g, '');
      
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/messages/admin/unread-count`,
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
          },
        }
      );
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { unreadCount: 0 });
    }
  }
);

// ✅ Mark message as read (admin)
export const markMessageRead = createAsyncThunk(
  "messages/markMessageRead",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const cleanToken = token?.trim().replace(/^"|"$/g, '').replace(/\s/g, '');
      
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/messages/admin/${id}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
          },
        }
      );
      
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to mark as read" });
    }
  }
);

// ✅ Reply to message (admin)
export const replyMessage = createAsyncThunk(
  "messages/replyMessage",
  async ({ id, reply }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const cleanToken = token?.trim().replace(/^"|"$/g, '').replace(/\s/g, '');
      
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/messages/admin/${id}/reply`,
        { reply },
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
          },
        }
      );
      
      toast.success("Reply sent! ✅");
      
      // ✅ Serialize the response
      const data = response.data;
      if (data.data) {
        data.data = serializeMessage(data.data);
      }
      
      return { id, data };
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to send reply";
      toast.error(errorMsg);
      return rejectWithValue(error.response?.data || { message: errorMsg });
    }
  }
);

// ✅ Delete message (admin)
export const deleteMessage = createAsyncThunk(
  "messages/deleteMessage",
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("userToken");
      const cleanToken = token?.trim().replace(/^"|"$/g, '').replace(/\s/g, '');
      
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/messages/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${cleanToken}`,
          },
        }
      );
      
      toast.success("Message deleted! 🗑️");
      return id;
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to delete message";
      toast.error(errorMsg);
      return rejectWithValue(error.response?.data || { message: errorMsg });
    }
  }
);

// ✅ Get message by ID (customer)
export const fetchMessageById = createAsyncThunk(
  "messages/fetchMessageById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/messages/${id}`
      );
      
      // ✅ Serialize the message
      if (response.data.message) {
        response.data.message = serializeMessage(response.data.message);
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch message" });
    }
  }
);

// ✅ Get messages by email (customer)
export const fetchMessagesByEmail = createAsyncThunk(
  "messages/fetchMessagesByEmail",
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/messages/customer/${encodeURIComponent(email)}`
      );
      
      // ✅ Serialize all messages
      return {
        ...response.data,
        messages: serializeMessages(response.data.messages),
      };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: "Failed to fetch messages" });
    }
  }
);

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    unreadCount: 0,
    total: 0,
    loading: false,
    submitting: false,
    error: null,
    lastUpdated: null,
    currentMessage: null,
    customerMessages: [],
  },
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
      state.unreadCount = 0;
      state.customerMessages = [];
    },
    // ✅ Real-time update for new messages
    addNewMessage: (state, action) => {
      const msg = serializeMessage(action.payload);
      state.messages.unshift(msg);
      state.unreadCount += 1;
      state.total += 1;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit message
      .addCase(submitMessage.pending, (state) => {
        state.submitting = true;
        state.error = null;
      })
      .addCase(submitMessage.fulfilled, (state) => {
        state.submitting = false;
      })
      .addCase(submitMessage.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload?.message || "Failed to send message";
      })
      
      // Fetch messages
      .addCase(fetchMessagesAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessagesAdmin.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload.messages || [];
        state.unreadCount = action.payload.unreadCount || 0;
        state.total = action.payload.total || 0;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchMessagesAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch messages";
      })
      
      // Get unread count
      .addCase(getUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.unreadCount || 0;
      })
      
      // Mark as read
      .addCase(markMessageRead.fulfilled, (state, action) => {
        const index = state.messages.findIndex(m => m._id === action.payload.id);
        if (index !== -1) {
          state.messages[index].isRead = true;
          state.messages[index].readAt = new Date().toISOString();
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })
      
      // Reply
      .addCase(replyMessage.fulfilled, (state, action) => {
        const index = state.messages.findIndex(m => m._id === action.payload.id);
        if (index !== -1 && action.payload.data?.data) {
          state.messages[index] = { 
            ...state.messages[index], 
            ...action.payload.data.data 
          };
        }
      })
      
      // Delete
      .addCase(deleteMessage.fulfilled, (state, action) => {
        state.messages = state.messages.filter(m => m._id !== action.payload);
        state.total = Math.max(0, state.total - 1);
      })
      
      // Fetch message by ID
      .addCase(fetchMessageById.fulfilled, (state, action) => {
        state.currentMessage = action.payload.message || null;
      })
      
      // Fetch messages by email
      .addCase(fetchMessagesByEmail.fulfilled, (state, action) => {
        state.customerMessages = action.payload.messages || [];
        state.total = action.payload.total || 0;
      });
  },
});

export const { clearMessages, addNewMessage } = messageSlice.actions;
export default messageSlice.reducer;