import React, { useState } from "react";
import ContactList from "../components/ContactList";
import Chat from "../components/Chat";
import { ChatProvider } from "../context/ChatContext";

const ChatPage = () => {
  const [selectedContact, setSelectedContact] = useState(null);

  return (
    <ChatProvider>
      <div style={{ display: "flex", height: "100vh" }}>
        <div style={{ width: "30%", borderRight: "1px solid #ccc", padding: "1rem" }}>
          <ContactList onSelectContact={setSelectedContact} />
        </div>
        <div style={{ width: "70%", padding: "1rem" }}>
          {selectedContact ? (
            <Chat selectedContact={selectedContact} />
          ) : (
            <p>Select a contact to start chatting</p>
          )}
        </div>
      </div>
    </ChatProvider>
  );
};

export default ChatPage;