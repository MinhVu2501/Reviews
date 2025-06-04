const client = require('./client');
const { createUser, fetchUsers, getUserById, loginUser, validateUser } = require('./users');
const { createMovie, getAllMovies, getMovieById, deleteMovie } = require('./movies');

const dropTables = async () => {
  try {
    await client.query(`
      DROP TABLE IF EXISTS reviews;
      DROP TABLE IF EXISTS movies;
      DROP TABLE IF EXISTS users;
    `);
  } catch (err) {
    console.error('Error dropping tables:', err);
  }
};

const createTables = async () => {
  try {
    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(30) UNIQUE NOT NULL,
        password VARCHAR(60) NOT NULL
      );

      CREATE TABLE movies (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        genre VARCHAR(100),
        year INT,
        poster_url TEXT,
        summary TEXT
      );

      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        movie_id INT REFERENCES movies(id) ON DELETE CASCADE,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
  } catch (err) {
    console.error('Error creating tables:', err);
  }
};

const syncAndSeed = async () => {
  try {
    await client.connect();
    console.log('CONNECTED TO DB');

    console.log('DROPPING TABLES');
    await dropTables();
    console.log('TABLES DROPPED');

    console.log('CREATING TABLES');
    await createTables();
    console.log('TABLES CREATED');

    console.log('CREATING USERS');
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
    console.log('USERS CREATED');

    console.log('Logging in...');
    await loginUser('user1', 'testtest');
    console.log('Logged in!');

    console.log('CREATING MOVIES');
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

    console.log('MOVIES CREATED');
    
    console.log('FETCHING ALL USERS');
    console.log(await fetchUsers());

    console.log('FETCHING USER BY ID (alice)');
    console.log(await getUserById(alice.id));

    console.log('FETCHING ALL MOVIES');
    console.log(await getAllMovies());

    console.log('FETCHING MOVIE BY ID (inception)');
    console.log(await getMovieById(inception.id));
   
    await client.end();
    console.log('DISCONNECTED FROM DB');
  } catch (error) {
    console.error('Error in syncAndSeed:', error);
    await client.end();
  }
};

syncAndSeed();
