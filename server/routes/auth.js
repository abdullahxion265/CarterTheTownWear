const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { JWT_SECRET, requireAuth, requireAdmin } = require('../middleware/auth');

// POST /api/auth/login
// Body: { email, password }
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email.toLowerCase().trim()]);

    if (!rows.length) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // For now: only admin can log in via this endpoint
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access only at this time' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error('[POST /auth/login]', err);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/register  (stub — disabled for public, admin only for now)
// When customer registration opens, remove the admin-only guard below.
router.post('/register', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { name, email, password, role = 'customer' } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email.toLowerCase().trim()]);
    if (existing.length) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name.trim(), email.toLowerCase().trim(), hash, role]
    );

    res.status(201).json({ id: result.insertId, name, email, role });
  } catch (err) {
    console.error('[POST /auth/register]', err);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// GET /api/auth/me — verify token and return user info
router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
