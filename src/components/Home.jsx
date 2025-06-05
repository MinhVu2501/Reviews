import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../css/Home.css';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="home-container">
      <header className="navbar">
        <div className="logo">MovieVerse</div>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/reviews">Reviews</Link>
          <Link to="/top-rated">Top Rated</Link>
          <Link to="/about">About</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/login" className="auth-link">Login</Link>
          <Link to="/register" className="auth-link">Register</Link>
        </nav>
      </header>

      <section className="hero">
        <h1>Discover & Review Your Favorite Movies</h1>
        <p>From blockbusters to indie gems, find honest reviews and ratings.</p>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for a movie..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            aria-label="Search movies"
          />
          <button onClick={handleSearch} aria-label="Search">
            Search
          </button>
        </div>
      </section>

      <section className="featured-reviews">
        <h2>Featured Reviews</h2>
        <div className="review-cards">
          <div className="card">
            <img />
            <h3>Inception</h3>
            <p>A mind-bending thriller from Christopher Nolan that keeps you on edge.</p>
          </div>
          <div className="card">
            <img />
            <h3>The Matrix</h3>
            <p>A brilliant social commentary wrapped in an unpredictable thriller.</p>
          </div>
          <div className="card">
            <img />
            <h3>The God Father</h3>
            <p>Heath Ledger’s iconic Joker performance steals the show.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
