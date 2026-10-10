# CURE - start backend and frontend together
#
#   .\start.ps1              start both
#   .\start.ps1 -BackendOnly just the API
#   .\start.ps1 -FrontendOnly just the UI

param(
    [switch]$BackendOnly,
    [switch]$FrontendOnly
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

function Start-Tab {
    param([string]$Title, [string]$Dir, [string]$Cmd)

    Write-Host "  starting $Title ..." -ForegroundColor DarkGray
    Start-Process -FilePath "powershell.exe" `
        -ArgumentList "-NoExit", "-Command", "Set-Location '$Dir'; $Cmd" `
        -WorkingDirectory $Dir | Out-Null
}

if (-not $FrontendOnly) {
    Start-Tab -Title "backend (:8000)" -Dir "$root\backend" -Cmd "python run.py --reload"
    Start-Sleep -Seconds 2
}

if (-not $BackendOnly) {
    Start-Tab -Title "frontend (:5173)" -Dir "$root\frontend" -Cmd "npm run dev"
}

Write-Host ""
Write-Host "  API      http://127.0.0.1:8000/docs" -ForegroundColor Cyan
Write-Host "  Frontend http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
