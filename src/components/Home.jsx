import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
        <div
          className="logo"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/")}
          aria-label="Go to home page"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") navigate("/");
          }}
        >
          MovieVerse
        </div>
        <nav className="nav-links" aria-label="Primary navigation">
          <button
            onClick={() => navigate("/")}
            className="nav-button"
            aria-label="Home"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/reviews")}
            className="nav-button"
            aria-label="Reviews"
          >
            Reviews
          </button>
          <button
            onClick={() => navigate("/top-rated")}
            className="nav-button"
            aria-label="Top Rated"
          >
            Top Rated
          </button>
          <button
            onClick={() => navigate("/about")}
            className="nav-button"
            aria-label="About"
          >
            About
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="nav-button"
            aria-label="Contact"
          >
            Contact
          </button>
          {!user ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="auth-link nav-button"
                aria-label="Login"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="auth-link nav-button"
                aria-label="Register"
              >
                Register
              </button>
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
            <p>
              A mind-bending thriller from Christopher Nolan that keeps you on
              edge.
            </p>
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
