const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const SECRET = process.env.JWT_SECRET || 'your_secret_key_here';

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const exists = await User.findOne({ username });
    if (exists) return res.status(400).json({ error: 'User already exists' });
    const user = new User({ username, password, role: role || 'viewer' });
    await user.save();
    res.json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ error: 'Invalid username or password' });
    const match = await user.comparePassword(password);
    if (!match) return res.status(401).json({ error: 'Invalid username or password' });
    const token = jwt.sign({ id: user._id, username: user.username, role: user.role }, SECRET, { expiresIn: '1d' });
    res.json({ token, username: user.username, role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;