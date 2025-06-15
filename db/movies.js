const client = require('./client');

// Create a new movie
const createMovie = async ({ title, genre, year, poster_url, summary, director }) => {
  if (!title) {
    throw new Error('Title is required');
  }

  try {
    const { rows } = await client.query(`
      INSERT INTO movies (title, genre, year, poster_url, summary, director)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `, [title, genre || null, year || null, poster_url || null, summary || null, director || null]);

    return rows[0];
  } catch (error) {
    console.error('Error creating movie:', error);
    throw new Error('Error creating movie: ' + error.message);
  }
};

// Get all movies
const getAllMovies = async () => {
  try {
    const { rows } = await client.query(`
      SELECT id, title, genre, year, poster_url, summary, director
      FROM movies
      ORDER BY title ASC;
    `);
    return rows;
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw new Error('Error fetching movies: ' + error.message);
  }
};

// Get a single movie by ID
const getMovieById = async (id) => {
  if (!id) throw new Error('Movie ID is required');

  try {
    const { rows } = await client.query(`
      SELECT id, title, genre, year, poster_url, summary, director
      FROM movies
      WHERE id = $1;
    `, [id]);

    if (!rows[0]) throw new Error('Movie not found');
    return rows[0];
  } catch (error) {
    console.error('Error fetching movie by ID:', error);
    throw new Error('Error fetching movie by ID: ' + error.message);
  }
};

// Update movie
const updateMovie = async ({ id, title, genre, year, poster_url, summary, director }) => {
  if (!id) throw new Error('Movie ID is required');

  const fields = [];
  const values = [];
  let idx = 1;

  if (title !== undefined) {
    fields.push(`title = $${idx++}`);
    values.push(title);
  }
  if (genre !== undefined) {
    fields.push(`genre = $${idx++}`);
    values.push(genre);
  }
  if (year !== undefined) {
    fields.push(`year = $${idx++}`);
    values.push(year);
  }
  if (poster_url !== undefined) {
    fields.push(`poster_url = $${idx++}`);
    values.push(poster_url);
  }
  if (summary !== undefined) {
    fields.push(`summary = $${idx++}`);
    values.push(summary);
  }
  if (director !== undefined) {
    fields.push(`director = $${idx++}`);
    values.push(director);
  }

  if (fields.length === 0) throw new Error('No fields to update');

  values.push(id);

  try {
    const { rows } = await client.query(`
      UPDATE movies
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING *;
    `, values);

    if (!rows[0]) throw new Error('Movie not found');
    return rows[0];
  } catch (error) {
    console.error('Error updating movie:', error);
    throw new Error('Error updating movie: ' + error.message);
  }
};

// Delete movie
const deleteMovie = async (id) => {
  if (!id) throw new Error('Movie ID is required');

  try {
    const { rows } = await client.query(`
      DELETE FROM movies
      WHERE id = $1
      RETURNING *;
    `, [id]);

    if (!rows[0]) throw new Error('Movie not found');
    return rows[0];
  } catch (error) {
    console.error('Error deleting movie:', error);
    throw new Error('Error deleting movie: ' + error.message);
  }
};

module.exports = {
  createMovie,
  getAllMovies,
  getMovieById,
  updateMovie,
  deleteMovie,
};
