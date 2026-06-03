const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// GET /api/auth/me — return current user from Firebase token
router.get('/me', protect, (req, res) => {
  res.json({ user: req.user });
});

// POST /api/auth/verify — alias used by some frontend flows
router.post('/verify', protect, (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
