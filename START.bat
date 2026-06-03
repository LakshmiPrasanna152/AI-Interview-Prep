@echo off
echo.
echo 🎯 AI Interview Prep - Starting...
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
  echo Node.js not found. Install from https://nodejs.org
  pause
  exit /b 1
)

echo Installing backend...
cd backend
call npm install
if %errorlevel% neq 0 ( echo Backend install failed & pause & exit /b 1 )

echo Starting backend...
start "Backend" cmd /k "npm start"
cd ..

echo Installing frontend...
cd frontend
call npm install
if %errorlevel% neq 0 ( echo Frontend install failed & pause & exit /b 1 )

echo Starting frontend...
start "Frontend" cmd /k "npm start"
cd ..

echo.
echo Both servers starting in separate windows!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
pause
