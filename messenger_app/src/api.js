import axios from "axios";

const api = axios.create({
  baseURL: "https://whatsapp-backend-15.onrender.com/api",
  withCredentials: true,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error:", error?.response?.data || error.message);
    return Promise.reject(error?.response?.data || { error: "Network error" });
  }
);

export const me = async () => {
  try {
    console.log("Sending request to /auth/me..."); // Add logging
    const res = await api.get("/auth/me");
    console.log("me response:", res.data); // Add logging
    return { success: res.data.success, user: res.data.user };
  } catch (err) {
    console.error("me error:", err?.error || err.message); // Enhanced logging
    console.error("me error details:", err); // Full error object
    return { success: false, user: null };
  }
};

// ... (rest of the file unchanged)
export const register = async (data) => {
  try {
    const res = await api.post("/auth/register", data);
    return { success: res.data.success, user: res.data.user, message: res.data.message };
  } catch (err) {
    return { success: false, error: err.error || "Registration failed" };
  }
};

export const login = async (data) => {
  try {
    const res = await api.post("/auth/login", data);
    return { success: res.data.success, user: res.data.user, message: res.data.message };
  } catch (err) {
    return { success: false, error: err.error || "Login failed" };
  }
};

export const logout = async () => {
  try {
    const res = await api.post("/auth/logout");
    return { success: res.data.success, message: res.data.message };
  } catch (err) {
    return { success: false, error: err.error || "Logout failed" };
  }
};

export const addContact = async (email) => {
  try {
    const res = await api.post("/auth/add-contact", { email });
    return { success: res.data.success, user: res.data.user, message: res.data.message };
  } catch (err) {
    return { success: false, error: err.error || "Failed to add contact" };
  }
};

export const getMessages = async (contactId) => {
  try {
    const res = await api.get(`/chat/messages/${contactId}`);
    return { success: res.data.success, messages: res.data.messages, message: res.data.message };
  } catch (err) {
    return { success: false, error: err.error || "Failed to fetch messages" };
  }
};