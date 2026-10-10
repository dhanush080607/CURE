@echo off
setlocal

echo.
echo   Starting CURE backend...
echo.

cd /d "%~dp0backend"
python run.py --reload

if errorlevel 1 (
    echo.
    echo   Backend failed to start. See the message above.
    echo.
    pause
)
