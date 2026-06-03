const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { run, get, all } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// GET /api/sessions — list all sessions for the user
router.get('/', protect, (req, res) => {
  try {
    const sessions = all(
      'SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );
    res.json({
      sessions: sessions.map(s => ({
        _id: s.id,
        id: s.id,
        title: s.title,
        type: s.type,
        role: s.role,
        difficulty: s.difficulty,
        status: s.status,
        score: s.score,
        questionsAsked: s.questions_asked,
        createdAt: s.created_at,
        messages: JSON.parse(s.messages || '[]')
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// GET /api/sessions/:id — get a single session
router.get('/:id', protect, (req, res) => {
  try {
    const session = get(
      'SELECT * FROM sessions WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    if (!session) return res.status(404).json({ error: 'Session not found' });

    res.json({
      session: {
        _id: session.id,
        id: session.id,
        title: session.title,
        type: session.type,
        role: session.role,
        difficulty: session.difficulty,
        status: session.status,
        score: session.score,
        questionsAsked: session.questions_asked,
        createdAt: session.created_at,
        messages: JSON.parse(session.messages || '[]')
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch session' });
  }
});

// DELETE /api/sessions/:id — delete a session
router.delete('/:id', protect, (req, res) => {
  try {
    run(
      'DELETE FROM sessions WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ message: 'Session deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete session' });
  }
});

module.exports = router;
