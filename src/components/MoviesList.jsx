import React, { useState, useEffect } from "react";

const API_BASE = "https://movies-reviews-ly21.onrender.com";

export default function MoviesList() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchMovies() {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/api/movies`);
        if (!res.ok) throw new Error("Failed to fetch movies");
        const data = await res.json();
        setMovies(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMovies();
  }, []);

  if (loading) return <div>Loading movies...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  if (movies.length === 0) return <div>No movies found.</div>;

  return (
    <div style={{ maxWidth: 600, margin: "1rem auto" }}>
      <h2>All Movies</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {movies.map((movie) => (
          <li key={movie.id} style={{ marginBottom: "1rem" }}>
            <a href={`#/reviews/${movie.id}`} style={{ textDecoration: "none", color: "blue" }}>
              {movie.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
