#!/bin/bash

echo "Starting Online Store Development Environment (PostgreSQL)"
echo

echo "1. Setting up PostgreSQL database..."
echo "Make sure PostgreSQL is running and database 'online_store' exists"
cd backend
php setup.php
echo

echo "2. Starting PHP backend server..."
php -S localhost:80 -t . &
BACKEND_PID=$!
cd ..

echo "3. Starting React frontend..."
cd frontend && npm run dev &
FRONTEND_PID=$!

echo
echo "Development environment started!"
echo "Backend: http://localhost"
echo "Frontend: http://localhost:5173"
echo "Database: PostgreSQL (localhost:5432)"
echo
echo "Press Ctrl+C to stop all servers"

# Wait for user to stop
wait
