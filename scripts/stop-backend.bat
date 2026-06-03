@echo off
REM Stop any EKOS API process using port 8000 (releases Qdrant file lock).
cd /d "%~dp0.."
echo Stopping processes on port 8000...
powershell -NoProfile -ExecutionPolicy Bypass -Command "Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }"
ping 127.0.0.1 -n 3 >nul
echo Done. You can start the API again with scripts\start-backend.bat
