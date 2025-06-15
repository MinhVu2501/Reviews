import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://movies-reviews-ly21.onrender.com";

export default function Reviews({ user }) {
  const [movies, setMovies] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);

 
  const [mode, setMode] = useState("existing"); 
  const [selectedMovieId, setSelectedMovieId] = useState("");
  const [newMovieTitle, setNewMovieTitle] = useState("");
  const [newMovieDirector, setNewMovieDirector] = useState("");
  const [newMovieYear, setNewMovieYear] = useState("");
  const [rating, setRating] = useState(3);
  const [comment, setComment] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchMovies();
    fetchReviews();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/movies`);
      if (!res.ok) throw new Error(`Failed to fetch movies: ${res.status}`);
      const data = await res.json();
      setMovies(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/reviews`);
      if (!res.ok) throw new Error(`Failed to fetch reviews: ${res.status}`);
      const data = await res.json();
      setReviews(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleReturnHome = () => {
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!user) {
      setError("Please login to submit a review.");
      return;
    }

    let movieId;

    if (mode === "existing") {
      if (!selectedMovieId) {
        setError("Please select an existing movie.");
        return;
      }
      movieId = selectedMovieId;
    } else if (mode === "new") {
      if (!newMovieTitle.trim()) {
        setError("Please enter the new movie's title.");
        return;
      }
      try {
        const resMovie = await fetch(`${API_BASE}/api/movies`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: newMovieTitle.trim(),
            director: newMovieDirector.trim() || null,
            year: newMovieYear ? Number(newMovieYear) : null,
          }),
        });
        if (!resMovie.ok) {
          const errData = await resMovie.json();
          throw new Error(errData.error || "Failed to create movie");
        }
        const createdMovie = await resMovie.json();
        movieId = createdMovie.id;

        await fetchMovies();

        // Clear new movie inputs after creation
        setNewMovieTitle("");
        setNewMovieDirector("");
        setNewMovieYear("");
      } catch (err) {
        setError(err.message);
        return;
      }
    }

    try {
      const resReview = await fetch(`${API_BASE}/api/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          movieId: Number(movieId),
          rating: Number(rating),
          comment: comment.trim(),
        }),
      });

      if (!resReview.ok) {
        const errData = await resReview.json();
        throw new Error(errData.error || "Failed to create review");
      }

      await fetchReviews();

      // Reset form
      setRating(3);
      setComment("");
      setSelectedMovieId("");
      setMode("existing");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2>Reviews</h2>

      <button onClick={handleReturnHome} style={{ marginBottom: "1rem" }}>
        Return Home
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {!user ? (
        <p>
          You must <button onClick={() => navigate("/login")}>Login</button> to
          add a review.
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <fieldset>
            <legend>Add a Review</legend>

            <div>
              <label>
                <input
                  type="radio"
                  name="movieMode"
                  value="existing"
                  checked={mode === "existing"}
                  onChange={() => setMode("existing")}
                />
                Select existing movie
              </label>
              <label style={{ marginLeft: "1rem" }}>
                <input
                  type="radio"
                  name="movieMode"
                  value="new"
                  checked={mode === "new"}
                  onChange={() => setMode("new")}
                />
                Add new movie
              </label>
            </div>

            {mode === "existing" && (
              <label htmlFor="existing-movie-select">
                Choose a movie:
                <select
                  id="existing-movie-select"
                  value={selectedMovieId}
                  onChange={(e) => setSelectedMovieId(e.target.value)}
                  required
                >
                  <option value="">--Choose a movie--</option>
                  {movies.map((movie) => (
                    <option key={movie.id} value={movie.id}>
                      {movie.title} {movie.year ? `(${movie.year})` : ""}
                    </option>
                  ))}
                </select>
              </label>
            )}

            {mode === "new" && (
              <>
                <label htmlFor="new-movie-title">
                  Title:
                  <input
                    id="new-movie-title"
                    type="text"
                    value={newMovieTitle}
                    onChange={(e) => setNewMovieTitle(e.target.value)}
                    required
                  />
                </label>
                <br />
                <label htmlFor="new-movie-director">
                  Director:
                  <input
                    id="new-movie-director"
                    type="text"
                    value={newMovieDirector}
                    onChange={(e) => setNewMovieDirector(e.target.value)}
                  />
                </label>
                <br />
                <label htmlFor="new-movie-year">
                  Year:
                  <input
                    id="new-movie-year"
                    type="number"
                    value={newMovieYear}
                    onChange={(e) => setNewMovieYear(e.target.value)}
                  />
                </label>
                <br />
              </>
            )}

            <label htmlFor="rating-input">
              Rating (1-5):
              <input
                id="rating-input"
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                required
              />
            </label>
            <br />

            <label htmlFor="comment-textarea">
              Review:
              <textarea
                id="comment-textarea"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Optional"
              />
            </label>
            <br />

            <button type="submit">Submit Review</button>
          </fieldset>
        </form>
      )}

      <h3>Existing Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        <ul>
          {reviews.map((r) => (
            <li key={r.id}>
              <strong>{r.username}</strong> rated{" "}
              <em>{r.movieTitle || "Unknown Movie"}</em> {r.rating}/5
              <br />
              {r.comment && <span>Review: {r.comment}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
