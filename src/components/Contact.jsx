import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Contact.css"
export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, message } = formData;

    if (!name || !email || !message) {
      setStatus("Please fill out all fields.");
      return;
    }


    setStatus("Thanks for reaching out! We'll get back to you soon.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-container">
      <h1>Contact Us</h1>
      <p>Have questions or feedback? Send us a message!</p>

      <form onSubmit={handleSubmit} aria-label="Contact form">
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          aria-required="true"
        />

        <label htmlFor="email">Email:</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          aria-required="true"
        />

        <label htmlFor="message">Message:</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          aria-required="true"
        />

        <button type="submit" aria-label="Send message">
          Send
        </button>
      </form>

      {status && <p role="alert">{status}</p>}

      <button onClick={() => navigate(-1)} style={{ marginTop: "1rem" }}>
        Back
      </button>
    </div>
  );
}
