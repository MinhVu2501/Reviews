const client = require('./client');
const { 
  createUser, 
  fetchUsers, 
  getUserById, 
  loginUser, 
  validateUser 
} = require('./users');

const { 
  createMovie, 
  getAllMovies, 
  getMovieById, 
  deleteMovie 
} = require('./movies');

const {
  createReview,
  getAllReviews,
  getReviewById,
  updateReview,
  deleteReview,
} = require('./reviews');

const dropTables = async () => {
  try {
    console.log("Dropping tables...");
    // Drop in reverse dependency order
    await client.query(`DROP TABLE IF EXISTS reviews;`);
    await client.query(`DROP TABLE IF EXISTS movies;`);
    await client.query(`DROP TABLE IF EXISTS users;`);
    console.log("Tables dropped.");
  } catch (err) {
    console.error('Error dropping tables:', err);
  }
};

const createTables = async () => {
  try {
    console.log("Creating tables...");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(30) UNIQUE NOT NULL,
        password VARCHAR(60) NOT NULL
      );
    `);

    await client.query(`
      CREATE TABLE movies (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        genre VARCHAR(100),
        year INT,
        poster_url TEXT,
        summary TEXT
      );
    `);

    await client.query(`
      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        movie_id INT REFERENCES movies(id) ON DELETE CASCADE,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("Tables created.");
  } catch (err) {
    console.error('Error creating tables:', err);
  }
};

const syncAndSeed = async () => {
  try {
    await client.connect();
    console.log('Connected to DB');

    await dropTables();
    await createTables();

    console.log('Creating users...');
    const user1 = await createUser({
      email: 'user1@example.com',
      username: 'user1',
      password: 'testtest'
    });

    const bob = await createUser({
      email: 'bob@example.com',
      username: 'bob',
      password: 'hunter2'
    });

    const charlie = await createUser({
      email: 'charlie@example.com',
      username: 'charlie',
      password: 'charliePass456'
    });

    const dana = await createUser({
      email: 'dana@example.com',
      username: 'dana',
      password: 'dana123'
    });

    const alice = await createUser({
      email: 'alice@example.com',
      username: 'alice',
      password: 'superSecretPassword123'
    });
    console.log('Users created.');

    console.log('Logging in user1...');
    await loginUser('user1', 'testtest');
    console.log('Logged in successfully.');

    console.log('Creating movies...');
    const inception = await createMovie({
      title: 'Inception',
      genre: 'Sci-Fi',
      year: 2010,
      poster_url: 'http://example.com/inception.jpg',
      summary: 'A mind-bending thriller...',
    });

    const godfather = await createMovie({
      title: 'The Godfather',
      genre: 'Crime',
      year: 1972,
      poster_url: 'http://example.com/godfather.jpg',
      summary: 'Classic mafia drama.',
    });

    const matrix = await createMovie({
      title: 'The Matrix',
      genre: 'Action',
      year: 1999,
      poster_url: 'http://example.com/matrix.jpg',
      summary: 'Reality is not what it seems.'
    });

    console.log('Movies created.');

    console.log('Creating reviews...');
    await createReview({
      userId: user1.id,
      movieId: inception.id,
      rating: 4,
      comment: 'Really enjoyed this movie!'
    });

    await createReview({
      userId: bob.id,
      movieId: godfather.id,
      rating: 5,
      comment: 'Masterpiece.'
    });

    await createReview({
      userId: charlie.id,
      movieId: godfather.id,
      rating: 3,
      comment: 'Pretty good!'
    });

    await createReview({
      userId: dana.id,
      movieId: matrix.id,
      rating: 5,
      comment: 'Mind-blowing action and concept.'
    });

    await createReview({
      userId: alice.id,
      movieId: matrix.id,
      rating: 4,
      comment: 'Loved the visuals and story.'
    });

    console.log('Reviews created.');

    console.log('Fetching all users...');
    console.log(await fetchUsers());

    console.log('Fetching user by ID (alice)...');
    console.log(await getUserById(alice.id));

    console.log('Fetching all movies...');
    console.log(await getAllMovies());

    console.log('Fetching movie by ID (inception)...');
    console.log(await getMovieById(inception.id));

    console.log('Fetching all reviews...');
    console.log(await getAllReviews());

    console.log('Fetching review by ID (first review)...');
    const allReviews = await getAllReviews();
    if (allReviews.length > 0) {
      console.log(await getReviewById(allReviews[0].id));
    }

    await client.end();
    console.log('Disconnected from DB');
  } catch (error) {
    console.error('Error in syncAndSeed:', error);
    await client.end();
  }
};

syncAndSeed();
