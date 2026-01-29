require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const PORT = process.env.PORT || 4000;

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',
  logging: false,
});

// Define User model
const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  username: { type: DataTypes.STRING, unique: true, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  githubId: { type: DataTypes.STRING, unique: true, allowNull: true },
});

// Sync DB
sequelize.sync();

// Middleware
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// JWT secret
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

// Passport GitHub OAuth strategy
passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID || 'your_github_client_id',
  clientSecret: process.env.GITHUB_CLIENT_SECRET || 'your_github_client_secret',
  callbackURL: process.env.GITHUB_CALLBACK_URL || 'http://localhost:4000/auth/github/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ where: { githubId: profile.id } });
    if (!user) {
      user = await User.create({
        githubId: profile.id,
        username: profile.username,
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.username}@github.com`,
        passwordHash: '', // no password for OAuth users
      });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Routes

// Register new user
app.post('/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing username, email or password' });
  }
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, passwordHash });
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user.id, username, email }, token });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login user
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Missing email or password' });
  }
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user: { id: user.id, username: user.username, email }, token });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GitHub OAuth routes
app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/auth/failure' }),
  (req, res) => {
    // Successful authentication, issue JWT and redirect or respond
    const token = jwt.sign({ id: req.user.id }, JWT_SECRET, { expiresIn: '7d' });
    // For simplicity, redirect with token in query (in real app, use cookies or other secure methods)
    res.redirect(`http://localhost:3000/auth?token=${token}`);
  }
);

app.get('/auth/failure', (req, res) => {
  res.status(401).json({ error: 'GitHub authentication failed' });
});

// Get current user
app.get('/auth/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.substring(7);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ id: user.id, username: user.username, email: user.email });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Get projects
app.get('/projects', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  const token = authHeader.substring(7);
  try {
    // For demo, return empty array or seed data
    res.json([]);
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`SynergySphere server running on port ${PORT}`);
});
