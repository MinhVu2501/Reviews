import React, { useEffect, useState } from 'react';

const API_BASE = "https://movies-reviews-ly21.onrender.com/api";

export default function TopRated() {
  const [topMovies, setTopMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTopRated() {
      try {
        setLoading(true);
        setError(null);

        const moviesRes = await fetch(`${API_BASE}/movies`);
        if (!moviesRes.ok) throw new Error('Failed to fetch movies');
        const movies = await moviesRes.json();

        const reviewsRes = await fetch(`${API_BASE}/reviews`);
        if (!reviewsRes.ok) throw new Error('Failed to fetch reviews');
        const reviews = await reviewsRes.json();

        const ratingsMap = {};
        reviews.forEach(({ movieId, rating }) => {
          if (!ratingsMap[movieId]) ratingsMap[movieId] = { total: 0, count: 0 };
          ratingsMap[movieId].total += rating;
          ratingsMap[movieId].count++;
        });

        const moviesWithAvg = movies.map(movie => {
          const stats = ratingsMap[movie.id];
          return {
            ...movie,
            avgRating: stats ? stats.total / stats.count : 0,
            ratingCount: stats ? stats.count : 0,
          };
        });

        moviesWithAvg.sort((a, b) => b.avgRating - a.avgRating || b.ratingCount - a.ratingCount);
        setTopMovies(moviesWithAvg.slice(0, 5));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTopRated();
  }, []);

  function goHome() {
    window.location.href = '/';
  }

  if (loading) return <p>Loading top rated movies...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Top Rated Movies</h2>
      <button onClick={goHome} style={{ marginBottom: '1rem' }}>Home</button>
      {topMovies.length === 0 && <p>No ratings available yet.</p>}
      <ul>
        {topMovies.map(movie => (
          <li key={movie.id} style={{ marginBottom: '1rem' }}>
            <strong>{movie.title}</strong> ({movie.year || 'N/A'}) <br />
            Average Rating: {movie.avgRating.toFixed(2)} ({movie.ratingCount} reviews) <br />
            <img
              src={movie.poster_url || 'https://via.placeholder.com/100x150?text=No+Image'}
              alt={movie.title}
              style={{ width: 100, height: 150, objectFit: 'cover', marginTop: '0.5rem' }}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
