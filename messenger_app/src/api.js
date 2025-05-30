import axios from "axios";

const api = axios.create({
  baseURL: "https://whatsapp-backend-15.onrender.com/api",
  withCredentials: true,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`Request to ${config.url}:`, {
      withCredentials: config.withCredentials,
      headers: config.headers,
    });
    return config;
  },
  (error) => Promise.reject(error)
);

export const me = async () => {
  try {
    console.log("Sending request to /auth/me...");
    const res = await api.get("/auth/me");
    console.log("me response:", res.data);
    return { success: res.data.success, user: res.data.user };
  } catch (err) {
    console.error("me error:", err?.error || err.message);
    console.error("me error details:", err);
    return { success: false, user: null };
  }
};

export const getMessages = async (contactId) => {
  try {
    console.log(`Fetching messages for contact ${contactId}...`);
    const res = await api.get(`/chat/messages/${contactId}`);
    console.log("getMessages response:", res.data);
    return { success: res.data.success, messages: res.data.messages, message: res.data.message };
  } catch (err) {
    console.error("getMessages error:", err?.error || err.message);
    console.error("getMessages error details:", err);
    return { success: false, error: err.error || "Failed to fetch messages" };
  }
};

// ... (other functions unchanged)
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
    console.log("login response:", res.data);
    console.log("login headers (Set-Cookie):", res.headers["set-cookie"]); // Log cookie
    return { success: res.data.success, user: res.data.user, message: res.data.message };
  } catch (err) {
    console.error("login error:", err?.error || err.message);
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