import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { addContact } from "../api";
import { useAuth } from "../context/AuthContext";

const ContactList = ({ onSelectContact }) => {
  const { user, setUser } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setContacts(user.contacts || []);
    }
  }, [user]);

  const handleAddContact = async (e) => {
    e.preventDefault();
    const res = await addContact(email);
    if (res.success) {
      setUser(res.user);
      setContacts(res.user.contacts || []);
      setEmail("");
      setMessage("Contact added successfully!");
    } else {
      setMessage(res.error || "Failed to add contact");
    }
  };

  return (
    <div>
      <h3>Your Contacts</h3>
      <ul>
        {contacts.map((contact) => (
          <li key={contact._id} style={{ cursor: "pointer", display: "flex", alignItems: "center" }}>
            <span onClick={() => onSelectContact(contact)}>{contact.email}</span>
            <Link to={`/video-call/${contact._id}`} style={{ marginLeft: "10px", color: "#007bff" }}>
              Video Call
            </Link>
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddContact}>
        <input
          type="email"
          placeholder="Add contact by email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">Add Contact</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default ContactList;