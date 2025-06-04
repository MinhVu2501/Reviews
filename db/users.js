const client = require('./client.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createUser = async ({ email, username, password }) => {
  const hashedPW = await bcrypt.hash(password, 10);
  try {
    const { rows } = await client.query(`
      INSERT INTO users (email, username, password)
      VALUES ($1, $2, $3)
      RETURNING id, email, username;
    `, [email, username, hashedPW]);

    return rows[0];
  } catch (error) {
    throw new Error('Error creating user: ' + error.message);
  }
};

const loginUser = async (login, password) => {
  try {
    const { rows } = await client.query(`
      SELECT * FROM users WHERE username = $1 OR email = $1;
    `, [login]);

    const user = rows[0];
    if (!user) throw new Error('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: '1w' });
    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    };
  } catch (err) {
    throw new Error('Login failed: ' + err.message);
  }
};


const validateUser = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const { rows } = await client.query(`
      SELECT id, email, username FROM users WHERE id = $1;
    `, [decoded.id]);

    const user = rows[0];
    if (!user) throw new Error('Invalid token');
    return user;
  } catch (error) {
    throw new Error('Token validation failed: ' + error.message);
  }
};

const fetchUsers = async () => {
  try {
    const { rows } = await client.query(`
      SELECT id, email, username FROM users;
    `);
    return rows;
  } catch (error) {
    throw new Error('Error fetching users: ' + error.message);
  }
};

const getUserById = async (id) => {
  try {
    const { rows } = await client.query(`
      SELECT id, email, username FROM users WHERE id = $1;
    `, [id]);
    return rows[0];
  } catch (error) {
    throw new Error('Error fetching user by ID: ' + error.message);
  }
};

const deleteUser = async (userId) => {
  try {
    await client.query(`
      DELETE FROM users WHERE id = $1;
    `, [userId]);
  } catch (error) {
    throw new Error('Error deleting user: ' + error.message);
  }
};

module.exports = {
  createUser,
  loginUser,
  validateUser,
  fetchUsers,
  getUserById,
  deleteUser
};
