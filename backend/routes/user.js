const express = require('express');
const router = express.Router();
const { protect, formatUser } = require('../middleware/auth');
const { run, get } = require('../config/db');

router.get('/profile', protect, (req, res) => res.json({ user: req.user }));

router.put('/profile', protect, (req, res) => {
  try {
    const { name, targetRole, experience, skills } = req.body;
    run('UPDATE users SET name = ?, target_role = ?, experience = ?, skills = ? WHERE id = ?',
      [name, targetRole, experience, JSON.stringify(skills || []), req.user.id]);
    const updated = get('SELECT * FROM users WHERE id = ?', [req.user.id]);
    res.json({ user: formatUser(updated) });
  } catch (err) {
    res.status(500).json({ error: 'Profile update failed' });
  }
});

router.put('/password', protect, (req, res) => {
  res.status(400).json({ error: 'Password management is handled by Firebase. Use the "Forgot password?" link on the sign-in page.' });
});

module.exports = router;
