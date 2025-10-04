#!/bin/bash

echo "Starting Online Store Development Environment..."
echo

echo "Starting Backend Server (PHP)..."
cd backend && php -S localhost:3000 -t . &
BACKEND_PID=$!

echo "Waiting for backend to start..."
sleep 3

echo "Starting Frontend Server (React)..."
cd ../frontend && npm run dev &
FRONTEND_PID=$!

echo
echo "Both servers are starting..."
echo "Backend: http://localhost:3000"
echo "Frontend: http://localhost:8080"
echo
echo "Default Accounts:"
echo "- Superadmin: superadmin / password"
echo "- Admin: admin / password"
echo
echo "Press Ctrl+C to stop both servers..."

# Function to cleanup on exit
cleanup() {
    echo "Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit
}

# Trap Ctrl+C
trap cleanup INT

# Wait for user to stop
wait
