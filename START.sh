#!/bin/bash
echo ""
echo "🎯 AI Interview Prep — Starting..."
echo ""

# Check Node
if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Install from https://nodejs.org"
  exit 1
fi

NODE_VER=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VER" -lt 18 ]; then
  echo "⚠️  Node.js v18+ required (you have $(node -v))"
  exit 1
fi

echo "✅ Node.js $(node -v) found"
echo ""

# Install backend deps
echo "📦 Installing backend dependencies..."
cd backend && npm install --silent
if [ $? -ne 0 ]; then echo "❌ Backend install failed"; exit 1; fi
echo "✅ Backend ready"

# Install frontend deps  
echo "📦 Installing frontend dependencies..."
cd ../frontend && npm install --silent
if [ $? -ne 0 ]; then echo "❌ Frontend install failed"; exit 1; fi
echo "✅ Frontend ready"

echo ""
echo "🚀 Starting servers..."
echo "   Backend  → http://localhost:5000"
echo "   Frontend → http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Start both
cd ../backend && npm start &
BACKEND_PID=$!
sleep 2
cd ../frontend && npm start &
FRONTEND_PID=$!

# Cleanup on exit
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo 'Servers stopped.'" EXIT
wait
