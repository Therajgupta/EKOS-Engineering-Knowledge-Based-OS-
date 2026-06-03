@echo off
REM Start EKOS API (stops any old server first so Qdrant is not locked).
cd /d "%~dp0.."
call "%~dp0stop-backend.bat"
echo.
echo Starting EKOS API at http://127.0.0.1:8000 ...
echo Press Ctrl+C to stop.
echo.
venv\Scripts\python.exe -m uvicorn backend.api:app --host 0.0.0.0 --port 8000
if errorlevel 1 pause
