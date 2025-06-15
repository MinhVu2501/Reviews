require('dotenv').config();
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const client = require('./db/client');

const {
  createUser, fetchUsers, getUserById, loginUser, deleteUser,
} = require('./db/users');

const {
  createMovie, getAllMovies, getMovieById, updateMovie, deleteMovie,
} = require('./db/movies');

const {
  createReview, getAllReviews, getReviewById, updateReview, deleteReview,
} = require('./db/reviews');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// Connect to DB and start server
client.connect()
  .then(() => {
    console.log('✅ Connected to DB');
    app.listen(process.env.PORT || 3000, () => {
      console.log(`🚀 Server listening on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error connecting to DB:', err);
  });

/* AUTH ROUTES */
app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res.status(400).json({ error: 'Missing login or password' });
    }
    const { token, user } = await loginUser(identifier, password);
    res.json({ token, user });
  } catch (err) {
    console.error('Login error:', err);
    res.status(401).json({ error: err.message });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
      return res.status(400).json({ error: 'Missing email, username, or password' });
    }
    const user = await createUser({ email, username, password });

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1w' });
    res.json({ token, user });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ error: err.message });
  }
});

/* USER ROUTES */
app.get('/api/users', async (req, res) => {
  try {
    const users = await fetchUsers();
    res.json(users);
  } catch (err) {
    console.error('Fetch users error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid user ID' });

  try {
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(`Fetch user by ID ${id} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid user ID' });

  try {
    await deleteUser(id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(`Delete user ${id} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

/* MOVIE ROUTES */
app.post('/api/movies', async (req, res) => {
  const { title, director, year } = req.body; // Use 'year' here
  if (!title || typeof title !== 'string') {
    return res.status(400).json({ error: 'Title is required and must be a string' });
  }
  if (director !== undefined && typeof director !== 'string') {
    return res.status(400).json({ error: 'Director must be a string' });
  }
  if (year !== undefined && (typeof year !== 'number' || year < 1800 || year > 2100)) {
    return res.status(400).json({ error: 'Year must be a valid number between 1800 and 2100' });
  }

  try {
    const movie = await createMovie({ title, director, year });
    res.status(201).json(movie);
  } catch (err) {
    console.error('Create movie error:', err);
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/movies', async (req, res) => {
  try {
    const movies = await getAllMovies();
    res.json(movies);
  } catch (err) {
    console.error('Fetch movies error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/movies/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid movie ID' });

  try {
    const movie = await getMovieById(id);
    if (!movie) return res.status(404).json({ error: 'Movie not found' });
    res.json(movie);
  } catch (err) {
    console.error(`Fetch movie by ID ${id} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/movies/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid movie ID' });

  const { title, director, year } = req.body;

  if (title !== undefined && typeof title !== 'string') {
    return res.status(400).json({ error: 'Title must be a string' });
  }
  if (director !== undefined && typeof director !== 'string') {
    return res.status(400).json({ error: 'Director must be a string' });
  }
  if (year !== undefined && (typeof year !== 'number' || year < 1800 || year > 2100)) {
    return res.status(400).json({ error: 'Year must be a valid number between 1800 and 2100' });
  }

  try {
    const updatedMovie = await updateMovie({ id, title, director, year });
    res.json(updatedMovie);
  } catch (err) {
    console.error(`Update movie ${id} error:`, err);
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/movies/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid movie ID' });

  try {
    await deleteMovie(id);
    res.json({ message: 'Movie deleted' });
  } catch (err) {
    console.error(`Delete movie ${id} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

/* REVIEW ROUTES */
app.post('/api/reviews', async (req, res) => {
  const { userId, movieId, rating, comment } = req.body;

  if (!userId || !movieId || rating === undefined) {
    return res.status(400).json({ error: 'userId, movieId, and rating are required' });
  }
  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
  }
  if (comment !== undefined && typeof comment !== 'string') {
    return res.status(400).json({ error: 'Comment must be a string' });
  }

  try {
    const review = await createReview({ userId, movieId, rating, comment });
    res.status(201).json(review);
  } catch (err) {
    console.error('Create review error:', err);
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/reviews', async (req, res) => {
  try {
    const reviews = await getAllReviews();
    res.json(reviews);
  } catch (err) {
    console.error('Fetch reviews error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/reviews/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid review ID' });

  try {
    const review = await getReviewById(id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.json(review);
  } catch (err) {
    console.error(`Fetch review by ID ${id} error:`, err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/reviews/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid review ID' });

  const { rating, comment } = req.body;
  if (rating !== undefined && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
    return res.status(400).json({ error: 'Rating must be a number between 1 and 5' });
  }
  if (comment !== undefined && typeof comment !== 'string') {
    return res.status(400).json({ error: 'Comment must be a string' });
  }

  try {
    const updated = await updateReview({ id, rating, comment });
    res.json(updated);
  } catch (err) {
    console.error(`Update review ${id} error:`, err);
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/reviews/:id', async (req, res) => {
  const id = Number(req.params.id);
  if (isNaN(id)) return res.status(400).json({ error: 'Invalid review ID' });

  try {
    await deleteReview(id);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error(`Delete review ${id} error:`, err);
    res.status(500).json({ error: err.message });
  }
});
