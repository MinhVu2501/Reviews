const client = require('./client');

// Create a new movie
const createMovie = async ({ title, director, releaseYear }) => {
  if (!title) {
    throw new Error('Title is required');
  }

  try {
    const { rows } = await client.query(`
      INSERT INTO movies (title, director, release_year)
      VALUES ($1, $2, $3)
      RETURNING *;
    `, [title, director || null, releaseYear || null]);

    return rows[0];
  } catch (error) {
    throw new Error('Error creating movie: ' + error.message);
  }
};

// Get all movies
const getAllMovies = async () => {
  try {
    const { rows } = await client.query(`
      SELECT id, title, director, release_year
      FROM movies
      ORDER BY title ASC;
    `);
    return rows;
  } catch (error) {
    throw new Error('Error fetching movies: ' + error.message);
  }
};

// Get a single movie by ID
const getMovieById = async (id) => {
  if (!id) throw new Error('Movie ID is required');
  try {
    const { rows } = await client.query(`
      SELECT id, title, director, release_year
      FROM movies
      WHERE id = $1;
    `, [id]);

    if (!rows[0]) throw new Error('Movie not found');
    return rows[0];
  } catch (error) {
    throw new Error('Error fetching movie by ID: ' + error.message);
  }
};

// Update movie
const updateMovie = async ({ id, title, director, releaseYear }) => {
  if (!id) throw new Error('Movie ID is required');
  const fields = [];
  const values = [];
  let idx = 1;

  if (title !== undefined) {
    fields.push(`title = $${idx++}`);
    values.push(title);
  }
  if (director !== undefined) {
    fields.push(`director = $${idx++}`);
    values.push(director);
  }
  if (releaseYear !== undefined) {
    fields.push(`release_year = $${idx++}`);
    values.push(releaseYear);
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
