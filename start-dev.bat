@echo off
echo Starting Online Store Development Environment (PostgreSQL)
echo.

echo 1. Setting up PostgreSQL database...
echo Make sure PostgreSQL is running and database 'online_store' exists
cd backend
php setup.php
echo.

echo 2. Starting PHP backend server...
start "PHP Backend" cmd /k "php -S localhost:80 -t ."
cd ..

echo 3. Starting React frontend...
start "React Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo Development environment started!
echo Backend: http://localhost
echo Frontend: http://localhost:5173
echo Database: PostgreSQL (localhost:5432)
echo.
echo Press any key to exit...
pause > nul
