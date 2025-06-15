import React from "react";
import { useNavigate } from "react-router-dom";
import "../css/About.css"

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="about-container">
      <h1>About MovieVerse</h1>
      <p>
        <strong>MovieVerse</strong> is your go-to platform for discovering, reviewing,
        and sharing your thoughts on movies. Whether you're into timeless
        classics or the latest blockbusters, MovieVerse helps you explore and
        rate films from all genres.
      </p>

      <h2>Features</h2>
      <ul>
        <li>🔍 Search for movies and view details</li>
        <li>📝 Read and write reviews</li>
        <li>🌟 Check out top-rated films</li>
        <li>💬 Join a community of movie lovers</li>
      </ul>

      <h2>Our Mission</h2>
      <p>
        We aim to create a space where cinema enthusiasts can connect, share,
        and discover amazing films from around the world.
      </p>

      <button onClick={() => navigate(-1)} style={{ marginTop: "1rem" }}>
        Back
      </button>
    </div>
  );
}
