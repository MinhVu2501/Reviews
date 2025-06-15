import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function MovieDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const res = await fetch(`https://movies-reviews-ly21.onrender.com/api/movies/${id}`);
        if (!res.ok) throw new Error("Movie not found");
        const data = await res.json();
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchMovie();
  }, [id]);

  if (loading) return <p>Loading movie...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>{movie.title} ({movie.year || "N/A"})</h2>
      <img
        src={movie.poster_url || "https://via.placeholder.com/150x225?text=No+Image"}
        alt={`Poster of ${movie.title}`}
        style={{ width: 150, height: 225, objectFit: "cover" }}
      />
      <p>{movie.summary}</p>
      <p>Genre: {movie.genre}</p>
      <p>Director: {movie.director || "N/A"}</p>
      <button onClick={() => navigate(-1)}>Back</button>
    </div>
  );
}
