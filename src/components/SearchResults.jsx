import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function SearchResults() {
  const query = useQuery().get('query') || '';
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) return;

    async function fetchMovies() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://movies-reviews-ly21.onrender.com/api/movies');
        if (!res.ok) throw new Error('Failed to fetch movies');
        const allMovies = await res.json();

        const filtered = allMovies.filter(movie =>
          movie.title.toLowerCase().includes(query.toLowerCase())
        );

        setMovies(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, [query]);

  if (!query) return <p>Please enter a search query.</p>;
  if (loading) return <p>Loading search results...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Search Results for "{query}"</h2>
      {movies.length === 0 ? (
        <p>No movies found.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {movies.map(movie => (
            <li key={movie.id} style={{ marginBottom: '1rem' }}>
              <strong>{movie.title}</strong> ({movie.year || 'N/A'})<br />
              <img
                src={movie.poster_url || 'https://via.placeholder.com/100x150?text=No+Image'}
                alt={`Poster of ${movie.title}`}
                style={{ width: 100, height: 150, objectFit: 'cover', marginTop: '0.5rem' }}
              />
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate(-1)} style={{ marginTop: '1rem' }}>Back</button>
    </div>
  );
}
