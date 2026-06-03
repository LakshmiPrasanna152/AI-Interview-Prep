# InterviewAI 🤖

An AI-powered mock interview platform built with React, Node.js, Firebase Auth, SQLite, and Claude (via OpenRouter).

---

## Features

- **Multiple interview types** — Technical, HR, System Design, Behavioral, Full Mock
- **Real-time AI feedback** — Scores and feedback after every answer
- **Model answers** — See ideal answers for any question during practice
- **Performance reports** — Detailed post-session analysis with strengths & improvements
- **Session history** — All past sessions saved and reviewable
- **Resume upload** — AI personalizes questions based on your resume
- **Progress tracking** — Stats, streaks, and score history

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, React Router, React Markdown |
| Backend | Node.js, Express |
| Database | SQLite (via sql.js) |
| Auth | Firebase Authentication |
| AI | Claude Sonnet (via OpenRouter) |

---

## Project Structure

```
ai-interview-prep/
├── frontend/               # React app
│   ├── src/
│   │   ├── pages/          # HomePage, ChatPage, DashboardPage, etc.
│   │   ├── components/     # Sidebar, shared UI
│   │   ├── context/        # AuthContext (Firebase + API)
│   │   └── config/         # Firebase client config
│   └── package.json
│
├── backend/                # Express API
│   ├── routes/
│   │   ├── ai.js           # /api/ai/chat, /api/ai/report
│   │   ├── auth.js         # /api/auth/me
│   │   ├── sessions.js     # /api/sessions CRUD
│   │   ├── user.js         # /api/user/profile
│   │   └── resume.js       # /api/resume/upload
│   ├── middleware/
│   │   └── auth.js         # Firebase token verification
│   ├── config/
│   │   ├── db.js           # sql.js SQLite setup
│   │   └── firebase.js     # Firebase Admin SDK
│   └── server.js
│
└── README.md
```

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git
cd YOUR_REPO
```

### 2. Backend

```bash
cd backend
npm install
```

Create a `.env` file in `/backend` (see `.env.example`):

```env
PORT=5000
SQLITE_PATH=./data/app.db
OPENROUTER_API_KEY=your_openrouter_key
OPENROUTER_MODEL=anthropic/claude-sonnet-4
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your_service_account@project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

```bash
npm start
```

### 3. Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `/frontend` (see `.env.example`):

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_FIREBASE_API_KEY=your_firebase_web_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

```bash
npm start
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

Never commit `.env` files. Use the `.env.example` templates in each folder as a reference.

- **OpenRouter API key** — Get one at [openrouter.ai](https://openrouter.ai)
- **Firebase** — Create a project at [Firebase Console](https://console.firebase.google.com), enable Authentication, and download the Admin SDK service account JSON

---

## License

MIT
