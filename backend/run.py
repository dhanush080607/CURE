"""One-command launcher for the CURE backend.

    python backend/run.py

Handles the boring parts that otherwise produce confusing errors:

* creates .venv and installs requirements on first run
* refuses to start on a port that is already taken, and says what is using it
  instead of dying with a bare `WinError 10013`
* seeds the database on boot
"""

from __future__ import annotations

import argparse
import os
import socket
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
VENV = ROOT / "venv"
PYTHON = VENV / "Scripts" / "python.exe"
REQUIREMENTS = ROOT / "requirements.txt"


def venv_python() -> Path:
    if os.name == "nt":
        return VENV / "Scripts" / "python.exe"
    return VENV / "bin" / "python"


def run(cmd: list[str], **kw) -> int:
    return subprocess.call(cmd, **kw)


def ensure_venv() -> Path:
    python = venv_python()

    if not python.exists():
        print(f"[setup] creating virtual environment in {VENV}")
        run([sys.executable, "-m", "venv", str(VENV)])
        if not python.exists():
            raise SystemExit("Failed to create the virtual environment.")

    marker = VENV / ".deps-installed"
    needs_install = not marker.exists()

    if needs_install:
        print("[setup] installing dependencies (first run only)")
        run([str(python), "-m", "pip", "install", "--upgrade", "pip"])
        run([str(python), "-m", "pip", "install", "-r", str(REQUIREMENTS)])
        marker.write_text("ok", encoding="utf-8")

    return python


def port_owner(port: int) -> str | None:
    """Return "name (pid)" for whatever is listening on `port`, if anything."""

    try:
        netstat = subprocess.run(
            ["netstat", "-ano", "-p", "TCP"],
            capture_output=True,
            text=True,
            timeout=10,
        ).stdout
    except Exception:
        return None

    for line in netstat.splitlines():
        parts = line.split()
        if len(parts) < 5 or not parts[0].upper().startswith("TCP"):
            continue
        if parts[1].rsplit(":", 1)[-1] != str(port):
            continue
        if parts[3].upper() != "LISTENING":
            continue

        pid = parts[-1]
        name = "unknown"
        try:
            tasks = subprocess.run(
                ["tasklist", "/FI", f"PID eq {pid}", "/FO", "CSV", "/NH"],
                capture_output=True,
                text=True,
                timeout=10,
            ).stdout.strip()
            cols = tasks.split('","')
            if cols and cols[0].strip('"'):
                name = cols[0].strip('"')
        except Exception:
            pass

        return f"{name} (pid {pid})"

    return None


def is_free(port: int, host: str = "127.0.0.1") -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.6)
        return s.connect_ex((host, port)) != 0


def pick_port(preferred: int, host: str, allow_scan: bool) -> int:
    if is_free(preferred, host):
        return preferred

    owner = port_owner(preferred)
    if not allow_scan:
        print()
        print(f"[error] port {preferred} is already in use.")
        if owner:
            print(f"        held by {owner}")
        print()
        print("        Stop it, or pick another port:")
        print(f"            python backend/run.py --port 8010")
        print()
        print("        To stop the current holder:")
        print(
            f"            Get-NetTCPConnection -LocalPort {preferred} -State Listen "
            "| Stop-Process -Id {$_.OwningProcess}"
        )
        raise SystemExit(1)

    for candidate in range(preferred + 1, preferred + 25):
        if is_free(candidate, host):
            print(f"[warn] port {preferred} busy, using {candidate} instead.")
            return candidate

    raise SystemExit(f"No free port found between {preferred} and {preferred + 24}.")


def main() -> None:
    parser = argparse.ArgumentParser(description="Start the CURE API server.")
    parser.add_argument("--host", default="127.0.0.1")
    parser.add_argument("--port", type=int, default=8000)
    parser.add_argument("--reload", action="store_true", help="auto-reload on edit")
    parser.add_argument(
        "--port-scan",
        action="store_true",
        help="pick the next free port if the preferred one is busy",
    )
    args = parser.parse_args()

    python = ensure_venv()
    port = pick_port(args.port, args.host, args.port_scan)

    print()
    print(f"  CURE API   http://{args.host}:{port}")
    print(f"  Swagger    http://{args.host}:{port}/docs")
    print()

    cmd = [
        str(python),
        "-m",
        "uvicorn",
        "app.main:app",
        "--host",
        args.host,
        "--port",
        str(port),
    ]
    if args.reload:
        cmd.append("--reload")

    raise SystemExit(run(cmd, cwd=str(ROOT)))


if __name__ == "__main__":
    main()
