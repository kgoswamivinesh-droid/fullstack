const express = require('express');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = 'your_secret_key';

const SAMPLE_USERS = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'mod', password: 'mod123', role: 'moderator' },
  { username: 'user', password: 'user123', role: 'user' }
];

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user) return res.status(403).json({ error: 'Unauthorized' });
  if (!allowedRoles.includes(req.user.role)) return res.status(403).json({ error: 'Access denied' });
  next();
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = SAMPLE_USERS.find(u => u.username === username && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ username: user.username, role: user.role }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

app.get('/admin', authenticateToken, authorizeRoles('admin'), (req, res) => {
  res.json({ message: `Hello ${req.user.username}, welcome to the admin area.` });
});

app.get('/moderator', authenticateToken, authorizeRoles('admin', 'moderator'), (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you have moderator access.` });
});

app.get('/user', authenticateToken, authorizeRoles('admin', 'moderator', 'user'), (req, res) => {
  res.json({ message: `Hello ${req.user.username}, you are a regular user.` });
});

app.get('/public', (req, res) => {
  res.json({ message: 'This is a public route, accessible without login.' });
});

app.listen(3000, () => console.log('Server running on port 3000'));
