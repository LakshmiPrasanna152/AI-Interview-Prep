# 🚀 How to Run AI Interview Prep

**No build tools required!** Uses pure-JavaScript SQLite (sql.js) — works on Windows, Mac, Linux without Visual Studio or Xcode.

---

## Prerequisites

Only **Node.js 18+** needed → https://nodejs.org (download LTS)

Check: `node --version` (should say v18 or higher)

> ⚠️ You have Node v24 — that's perfect, fully supported.

---

## Step 1 — Enable Firebase Auth (One-time, ~2 min)

1. Go to https://console.firebase.google.com
2. Click project **ai-interview-prep-assistant**
3. Left sidebar → **Authentication** → **Get started** → **Sign-in method**
4. Enable **Email/Password** → Save
5. Enable **Google** → add your Gmail as support email → Save

All API keys are already pre-filled in the `.env` files. No other setup needed.

---

## Step 2 — Run Backend

Open **PowerShell** or **Command Prompt** in the project folder:

```
cd backend
npm install
npm start
```

✅ Success looks like:
```
✅ SQLite (sql.js) Connected: ./data/app.db
✅ Firebase Admin initialized
🚀 Server running on port 5000
```

---

## Step 3 — Run Frontend

Open a **second** PowerShell/Command Prompt window:

```
cd frontend
npm install
npm start
```

Browser opens automatically at **http://localhost:3000** 🎉

---

## Windows Quick Start (Double-click)

Just double-click **`START.bat`** in the project root — it installs and starts both servers automatically in separate windows.

---

## URLs

| | URL |
|--|--|
| App | http://localhost:3000 |
| API | http://localhost:5000/api |
| Health | http://localhost:5000/api/health |

---

## Troubleshooting

**`npm install` fails** — delete the `node_modules` folder and try again:
```
rmdir /s /q node_modules
npm install
```

**Port already in use:**
```
# Find and kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <number> /F
```

**Google sign-in popup blocked** — click "Allow popups" in the browser address bar.

**`fetch is not defined` error** — upgrade Node.js to v18+ (fetch is built-in from v18).
