import React, { useEffect, useState } from 'react';

const API_BASE = "https://movies-reviews-ly21.onrender.com/api";

export default function TopRated() {
  const [topMovies, setTopMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/100x150?text=No+Image';
    if (url.startsWith('http')) return url;
    const filename = url.startsWith('/img/') ? url.slice(5) : url;
    return `/img/${filename}`;
  };

  useEffect(() => {
    async function fetchTopRated() {
      try {
        setLoading(true);
        setError(null);

        const moviesRes = await fetch(`${API_BASE}/movies`);
        if (!moviesRes.ok) throw new Error('Failed to fetch movies');
        const movies = await moviesRes.json();
        
         // DEBUG: Log the poster_url for Inception
      const inceptionMovie = movies.find(movie => movie.title === "Inception");
      console.log("Inception movie data:", inceptionMovie);

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

        moviesWithAvg.sort(
          (a, b) => b.avgRating - a.avgRating || b.ratingCount - a.ratingCount
        );
        setTopMovies(moviesWithAvg.slice(0, 5));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTopRated();
  }, []);

  function goBack() {
    window.history.back();
  }

  if (loading) return <p>Loading top rated movies...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Top Rated Movies</h2>
      {topMovies.length === 0 && <p>No ratings available yet.</p>}
      <ul>
        {topMovies.map(movie => (
          <li key={movie.id} style={{ marginBottom: '1rem' }}>
            <strong>{movie.title}</strong> ({movie.year || 'N/A'}) <br />
            Average Rating: {movie.avgRating.toFixed(2)} ({movie.ratingCount} reviews) <br />
            <img
              src={getImageUrl(movie.poster_url)}
              alt={`Poster of ${movie.title}`}
              style={{ width: 100, height: 150, objectFit: 'cover', marginTop: '0.5rem' }}
            />
          </li>
        ))}
      </ul>
      <button onClick={goBack} style={{ marginTop: '1rem' }}>Back</button>
    </div>
  );
}
