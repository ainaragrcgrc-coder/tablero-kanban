@echo off
cd /d "%~dp0"

start "Kanban Server" cmd /k "npm.cmd start"

timeout /t 3 /nobreak >nul

start "" "http://localhost:3000"