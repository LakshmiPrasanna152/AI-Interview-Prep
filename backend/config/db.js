const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.SQLITE_PATH || path.join(__dirname, '../data/app.db');
const dataDir = path.dirname(DB_PATH);
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

let db;

const SCHEMA = `
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    firebase_uid TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    avatar TEXT DEFAULT '',
    role TEXT DEFAULT 'user',
    target_role TEXT DEFAULT '',
    experience TEXT DEFAULT 'fresher',
    skills TEXT DEFAULT '[]',
    resume_text TEXT DEFAULT '',
    stats_total_sessions INTEGER DEFAULT 0,
    stats_total_questions INTEGER DEFAULT 0,
    stats_avg_score REAL DEFAULT 0,
    stats_streak INTEGER DEFAULT 0,
    stats_last_active TEXT,
    badges TEXT DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT DEFAULT 'Interview Session',
    type TEXT DEFAULT 'technical',
    role TEXT DEFAULT '',
    difficulty TEXT DEFAULT 'medium',
    messages TEXT DEFAULT '[]',
    status TEXT DEFAULT 'active',
    score REAL DEFAULT 0,
    feedback TEXT DEFAULT '',
    questions_asked INTEGER DEFAULT 0,
    correct_answers INTEGER DEFAULT 0,
    duration INTEGER DEFAULT 0,
    start_time TEXT DEFAULT (datetime('now')),
    end_time TEXT,
    tags TEXT DEFAULT '[]',
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`;

const connectDB = async () => {
  try {
    const initSqlJs = require('sql.js');
    const SQL = await initSqlJs();

    // Load existing DB from disk if it exists
    if (fs.existsSync(DB_PATH)) {
      const fileBuffer = fs.readFileSync(DB_PATH);
      db = new SQL.Database(fileBuffer);
    } else {
      db = new SQL.Database();
    }

    db.run(SCHEMA);
    saveDB(); // initial save

    // Auto-save every 5 seconds
    setInterval(saveDB, 5000);

    console.log('✅ SQLite (sql.js) Connected:', DB_PATH);
  } catch (error) {
    console.error('❌ SQLite Error:', error.message);
    process.exit(1);
  }
};

const saveDB = () => {
  if (!db) return;
  try {
    const data = db.export();
    fs.writeFileSync(DB_PATH, Buffer.from(data));
  } catch (e) {
    // ignore write errors during shutdown
  }
};

// Save on exit
process.on('exit', saveDB);
process.on('SIGINT', () => { saveDB(); process.exit(); });
process.on('SIGTERM', () => { saveDB(); process.exit(); });

const getDB = () => {
  if (!db) throw new Error('Database not initialized.');
  return db;
};

// Helper: run a statement and return last insert info
const run = (sql, params = []) => {
  getDB().run(sql, params);
};

// Helper: get one row
const get = (sql, params = []) => {
  const stmt = getDB().prepare(sql);
  stmt.bind(params);
  if (stmt.step()) {
    const row = stmt.getAsObject();
    stmt.free();
    return row;
  }
  stmt.free();
  return null;
};

// Helper: get all rows
const all = (sql, params = []) => {
  const stmt = getDB().prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
};

module.exports = { connectDB, getDB, saveDB, run, get, all };
