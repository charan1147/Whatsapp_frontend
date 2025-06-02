import React, { useState, useEffect, useRef } from "react";
import { useChat } from "../context/ChatContext";
import { useAuth } from "../context/AuthContext";

const Chat = ({ selectedContact }) => {
  const { messages, loadMessages, sendChatMessage, error } = useChat();
  const { user } = useAuth();
  const [newMessage, setNewMessage] = useState("");
  const [sendError, setSendError] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedContact) {
      loadMessages(selectedContact._id);
    }
  }, [selectedContact, loadMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) {
      setSendError("Message cannot be empty");
      return;
    }
    const data = {
      receiver: selectedContact._id,
      content: newMessage,
    };
    const res = sendChatMessage(data);
    if (!res.success) {
      setSendError(res.error || "Failed to send message");
    } else {
      setSendError("");
      setNewMessage("");
    }
  };

  if (!user) {
    return <p>Please log in to view chats.</p>;
  }

  return (
    <div>
      <h3>
        Chat with {selectedContact ? selectedContact.email : "Select a contact"}
      </h3>
      {(error || sendError) && <p style={{ color: "red" }}>{error || sendError}</p>}
      <div style={{ border: "1px solid #ccc", height: "300px", overflowY: "scroll", padding: "0.5rem" }}>
        {messages?.length > 0 ? (
          messages.map((msg) => (
            <div key={msg._id}>
              <strong>{msg.sender === user.id ? "You" : selectedContact?.email}</strong>: {msg.content}
              <span style={{ color: "#888", fontSize: "0.8em", marginLeft: "10px" }}>
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))
        ) : (
          <p>No messages yet.</p>
        )}
        <div ref={messagesEndRef} />
      </div>
      {selectedContact && (
        <form onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            required
          />
          <button type="submit">Send</button>
        </form>
      )}
    </div>
  );
};

export default Chat;