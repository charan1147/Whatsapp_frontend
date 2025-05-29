import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getMessages } from "../api";
import socket from "../socket";
import { useAuth } from "./AuthContext";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  const loadMessages = useCallback(async (contactId) => {
    try {
      setError(null);
      const res = await getMessages(contactId);
      if (res && res.success) {
        setMessages(Array.isArray(res.messages) ? res.messages : []);
      } else {
        setMessages([]);
        setError(res.error || "Failed to load messages");
      }
    } catch (err) {
      setMessages([]);
      setError("Failed to load messages");
    }
  }, []);

  const sendChatMessage = (data) => {
    if (!user) {
      return { success: false, error: "User not authenticated" };
    }
    socket.emit("sendMessage", { ...data, sender: user.id });
    return { success: true };
  };

  useEffect(() => {
    const handleMessage = (newMessage) => {
      setMessages((prev) => {
        const updatedMessages = [...(Array.isArray(prev) ? prev : []), newMessage];
        console.log("Updated messages:", updatedMessages);
        return updatedMessages;
      });
    };

    socket.on("message", handleMessage);
    return () => socket.off("message", handleMessage);
  }, []);

  return (
    <ChatContext.Provider value={{ messages, loadMessages, sendChatMessage, error }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);