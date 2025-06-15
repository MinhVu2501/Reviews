const client = require('./client');

const createReview = async ({ userId, movieId, rating, comment = '' }) => {
  if (!userId || !movieId || !rating) {
    throw new Error('userId, movieId, and rating are required');
  }

  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    throw new Error('Rating must be a number between 1 and 5');
  }

  try {
    const { rows } = await client.query(
      `
      INSERT INTO reviews (user_id, movie_id, rating, comment)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `,
      [userId, movieId, rating, comment]
    );
    return rows[0];
  } catch (error) {
    console.error('Error creating review:', error);
    throw new Error('Error creating review: ' + error.message);
  }
};

const getAllReviews = async () => {
  try {
    const { rows } = await client.query(`
      SELECT 
        reviews.id, 
        reviews.user_id, 
        reviews.movie_id, 
        reviews.rating, 
        reviews.comment, 
        reviews.created_at,
        users.username, 
        movies.title AS movie_title
      FROM reviews
      JOIN users ON reviews.user_id = users.id
      JOIN movies ON reviews.movie_id = movies.id
      ORDER BY reviews.created_at DESC;
    `);

    return rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      movieId: row.movie_id,
      rating: row.rating,
      comment: row.comment,
      createdAt: row.created_at,
      username: row.username,
      movieTitle: row.movie_title,
    }));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw new Error('Error fetching reviews: ' + error.message);
  }
};

const getReviewById = async (id) => {
  if (!id) throw new Error('Review ID is required');
  try {
    const { rows } = await client.query(
      `
      SELECT 
        reviews.id, 
        reviews.user_id, 
        reviews.movie_id, 
        reviews.rating, 
        reviews.comment, 
        reviews.created_at,
        users.username, 
        movies.title AS movie_title
      FROM reviews
      JOIN users ON reviews.user_id = users.id
      JOIN movies ON reviews.movie_id = movies.id
      WHERE reviews.id = $1;
    `,
      [id]
    );

    if (!rows[0]) throw new Error('Review not found');

    const row = rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      movieId: row.movie_id,
      rating: row.rating,
      comment: row.comment,
      createdAt: row.created_at,
      username: row.username,
      movieTitle: row.movie_title,
    };
  } catch (error) {
    console.error('Error fetching review by ID:', error);
    throw new Error('Error fetching review by ID: ' + error.message);
  }
};

const updateReview = async ({ id, rating, comment }) => {
  if (!id) throw new Error('Review ID is required');
  if (rating !== undefined && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
    throw new Error('Rating must be a number between 1 and 5');
  }

  const fields = [];
  const values = [];
  let idx = 1;

  if (rating !== undefined) {
    fields.push(`rating = $${idx++}`);
    values.push(rating);
  }

  if (comment !== undefined) {
    fields.push(`comment = $${idx++}`);
    values.push(comment);
  }

  if (fields.length === 0) {
    throw new Error('No fields to update');
  }

  values.push(id);

  try {
    const { rows } = await client.query(
      `
      UPDATE reviews
      SET ${fields.join(', ')}
      WHERE id = $${idx}
      RETURNING *;
    `,
      values
    );

    if (!rows[0]) throw new Error('Review not found');
    return rows[0];
  } catch (error) {
    console.error('Error updating review:', error);
    throw new Error('Error updating review: ' + error.message);
  }
};

const deleteReview = async (id) => {
  if (!id) throw new Error('Review ID is required');
  try {
    const { rows } = await client.query(
      `
      DELETE FROM reviews
      WHERE id = $1
      RETURNING *;
    `,
      [id]
    );

    if (!rows[0]) throw new Error('Review not found');
    return rows[0];
  } catch (error) {
    console.error('Error deleting review:', error);
    throw new Error('Error deleting review: ' + error.message);
  }
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
};
