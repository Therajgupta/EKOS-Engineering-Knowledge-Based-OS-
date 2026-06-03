# Stop stale servers that keep Qdrant locked, then start the API.
$ErrorActionPreference = "Stop"
$root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $root

Write-Host "Stopping old Python processes on port 8000..."
Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }

Start-Sleep -Seconds 1

$python = Join-Path $root "venv\Scripts\python.exe"
if (-not (Test-Path $python)) {
    Write-Error "venv not found. Run: python -m venv venv && .\venv\Scripts\python.exe -m pip install -r requirements.txt"
}

Write-Host "Starting EKOS API on http://0.0.0.0:8000 ..."
# Local Qdrant file storage does not support uvicorn --reload (two processes = lock error).
& $python -m uvicorn backend.api:app --host 0.0.0.0 --port 8000
