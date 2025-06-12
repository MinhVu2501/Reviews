import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/Home.css";

const Home = ({ user, onLogout }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = () => {
    onLogout();
    navigate("/");
  };

  return (
    <div className="home-container">
      <header className="navbar">
        <div className="logo">MovieVerse</div>
        <nav className="nav-links" aria-label="Primary navigation">
          <Link to="/">Home</Link>
          <Link to="/reviews">Reviews</Link>
          <Link to="/top-rated">Top Rated</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          {!user ? (
            <>
              <Link to="/login" className="auth-link">
                Login
              </Link>
              <Link to="/register" className="auth-link">
                Register
              </Link>
            </>
          ) : (
            <>
              <span className="welcome-text">Welcome, {user.username}!</span>
              <button
                onClick={handleLogout}
                className="logout-button"
                aria-label="Logout"
                style={{ marginLeft: "1rem" }}
              >
                Logout
              </button>
            </>
          )}
        </nav>
      </header>

      <section className="hero" aria-label="Site introduction">
        <h1>Discover & Review Your Favorite Movies</h1>
        <p>From blockbusters to indie gems, find honest reviews and ratings.</p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for a movie..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search movies"
          />
          <button onClick={handleSearch} aria-label="Search">
            Search
          </button>
        </div>
      </section>

      <section className="featured-reviews" aria-label="Featured movie reviews">
        <h2>Featured Reviews</h2>
        <div className="review-cards">
          <article className="card">
            <img
              //src="/images/inception.jpg"
              alt="Poster of the movie Inception"
              loading="lazy"
            />
            <h3>Inception</h3>
            <p>A mind-bending thriller from Christopher Nolan that keeps you on edge.</p>
          </article>

          <article className="card">
            <img
              //src="/images/matrix.jpg"
              alt="Poster of the movie The Matrix"
              loading="lazy"
            />
            <h3>The Matrix</h3>
            <p>A brilliant social commentary wrapped in an unpredictable thriller.</p>
          </article>

          <article className="card">
            <img
              //src="/images/godfather.jpg"
              alt="Poster of the movie The Godfather"
              loading="lazy"
            />
            <h3>The Godfather</h3>
            <p>An epic tale of crime, family, and power in the mafia world.</p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Home;
