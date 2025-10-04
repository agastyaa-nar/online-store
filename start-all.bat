@echo off
echo Starting Online Store Development Environment...
echo.

echo Starting Backend Server (PHP)...
start "Backend Server" cmd /k "cd backend && php -S localhost:3000 -t ."

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server (React)...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:3000
echo Frontend: http://localhost:8080
echo.
echo Default Accounts:
echo - Superadmin: superadmin / password
echo - Admin: admin / password
echo.
echo Press any key to exit...
pause > nul
