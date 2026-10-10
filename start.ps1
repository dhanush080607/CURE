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

    # -EncodedCommand takes UTF-16LE base64, so a path containing spaces or
    # a single quote cannot break out of the quoted Set-Location argument.
    $script = "Set-Location -LiteralPath '$($Dir.Replace("'", "''"))'`n$Cmd"
    $bytes = [System.Text.Encoding]::Unicode.GetBytes($script)
    $encoded = [Convert]::ToBase64String($bytes)

    Start-Process -FilePath "powershell.exe" `
        -ArgumentList "-NoExit", "-EncodedCommand", $encoded `
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
if (-not $FrontendOnly) {
    Write-Host "  API      http://127.0.0.1:8000/docs" -ForegroundColor Cyan
}
if (-not $BackendOnly) {
    Write-Host "  Frontend http://localhost:5173" -ForegroundColor Cyan
}
Write-Host ""
