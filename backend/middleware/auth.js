const { admin } = require('../config/firebase');
const { run, get } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) return res.status(401).json({ error: 'Not authorized, no token' });

  try {
    const decoded = await admin.auth().verifyIdToken(token);

    let user = get('SELECT * FROM users WHERE firebase_uid = ?', [decoded.uid]);

    if (!user) {
      const id = uuidv4();
      run(
        'INSERT INTO users (id, firebase_uid, name, email, avatar) VALUES (?, ?, ?, ?, ?)',
        [id, decoded.uid, decoded.name || decoded.email?.split('@')[0] || 'User', decoded.email || '', decoded.picture || '']
      );
      user = get('SELECT * FROM users WHERE id = ?', [id]);
    }

    req.user = formatUser(user);
    next();
  } catch (err) {
    console.error('Auth error:', err.message);
    res.status(401).json({ error: 'Not authorized, invalid token' });
  }
};

const formatUser = (row) => {
  if (!row) return null;
  return {
    _id: row.id,
    id: row.id,
    firebaseUid: row.firebase_uid,
    name: row.name,
    email: row.email,
    avatar: row.avatar || '',
    role: row.role || 'user',
    targetRole: row.target_role || '',
    experience: row.experience || 'fresher',
    skills: JSON.parse(row.skills || '[]'),
    resumeText: row.resume_text || '',
    badges: JSON.parse(row.badges || '[]'),
    stats: {
      totalSessions: row.stats_total_sessions || 0,
      totalQuestions: row.stats_total_questions || 0,
      avgScore: row.stats_avg_score || 0,
      streak: row.stats_streak || 0,
      lastActive: row.stats_last_active
    }
  };
};

module.exports = { protect, formatUser };
