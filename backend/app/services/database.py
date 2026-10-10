"""SQLite persistence for tanks and their consumption history."""

import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone
from typing import Any, Iterator

from app.config import DATABASE_PATH

SCHEMA = """
CREATE TABLE IF NOT EXISTS tanks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    capacity_liters REAL NOT NULL CHECK (capacity_liters > 0),
    level_percent REAL NOT NULL CHECK (level_percent >= 0 AND level_percent <= 100),
    latitude REAL NOT NULL CHECK (latitude >= -90 AND latitude <= 90),
    longitude REAL NOT NULL CHECK (longitude >= -180 AND longitude <= 180),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS consumption_readings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tank_id INTEGER NOT NULL REFERENCES tanks(id) ON DELETE CASCADE,
    liters REAL NOT NULL CHECK (liters >= 0),
    recorded_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_readings_tank
    ON consumption_readings (tank_id, recorded_at);
"""


def _now() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds")


@contextmanager
def connect() -> Iterator[sqlite3.Connection]:
    DATABASE_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db() -> None:
    with connect() as conn:
        conn.executescript(SCHEMA)


def _row_to_tank(row: sqlite3.Row, readings: list[float] | None = None) -> dict[str, Any]:
    data = {
        "id": row["id"],
        "name": row["name"],
        "tank_capacity_liters": row["capacity_liters"],
        "tank_level_percent": row["level_percent"],
        "latitude": row["latitude"],
        "longitude": row["longitude"],
        "created_at": row["created_at"],
        "updated_at": row["updated_at"],
    }
    if readings is not None:
        data["consumption_history"] = readings
    return data


def list_tanks(limit: int = 50) -> list[dict[str, Any]]:
    with connect() as conn:
        rows = conn.execute(
            "SELECT * FROM tanks ORDER BY updated_at DESC LIMIT ?", (limit,)
        ).fetchall()
        return [_row_to_tank(r) for r in rows]


def get_tank(tank_id: int) -> dict[str, Any] | None:
    with connect() as conn:
        row = conn.execute("SELECT * FROM tanks WHERE id = ?", (tank_id,)).fetchone()
        if row is None:
            return None
        readings = get_readings(conn, tank_id)
        return _row_to_tank(row, readings)


def create_tank(
    name: str,
    capacity_liters: float,
    level_percent: float,
    latitude: float,
    longitude: float,
) -> dict[str, Any]:
    stamp = _now()
    with connect() as conn:
        cur = conn.execute(
            """
            INSERT INTO tanks
                (name, capacity_liters, level_percent, latitude, longitude,
                 created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            (name, capacity_liters, level_percent, latitude, longitude, stamp, stamp),
        )
        tank_id = cur.lastrowid
    return get_tank(tank_id)  # type: ignore[return-value]


# API field name -> database column name
TANK_FIELD_MAP = {
    "name": "name",
    "tank_capacity_liters": "capacity_liters",
    "tank_level_percent": "level_percent",
    "latitude": "latitude",
    "longitude": "longitude",
}


def update_tank(tank_id: int, **fields: Any) -> dict[str, Any] | None:
    columns: dict[str, Any] = {}
    for api_field, value in fields.items():
        column = TANK_FIELD_MAP.get(api_field)
        if column and value is not None:
            columns[column] = value

    if not columns:
        return get_tank(tank_id)

    # Column names are interpolated, so they must provably come from the
    # allowlist above. Values stay parameterised regardless.
    unknown = [c for c in columns if c not in TANK_FIELD_MAP.values()]
    if unknown:
        raise ValueError(f"Refusing to update unknown columns: {unknown}")

    assignments = ", ".join(f"{col} = ?" for col in columns)
    params = [*columns.values(), _now(), tank_id]

    with connect() as conn:
        conn.execute(
            f"UPDATE tanks SET {assignments}, updated_at = ? WHERE id = ?", params
        )
    return get_tank(tank_id)


def delete_tank(tank_id: int) -> bool:
    with connect() as conn:
        cur = conn.execute("DELETE FROM tanks WHERE id = ?", (tank_id,))
        return cur.rowcount > 0


def get_readings(conn: sqlite3.Connection, tank_id: int, limit: int = 30) -> list[float]:
    rows = conn.execute(
        """
        SELECT liters FROM consumption_readings
        WHERE tank_id = ? ORDER BY recorded_at DESC LIMIT ?
        """,
        (tank_id, limit),
    ).fetchall()
    return [r["liters"] for r in reversed(rows)]


def add_reading(tank_id: int, liters: float) -> list[float]:
    with connect() as conn:
        exists = conn.execute("SELECT 1 FROM tanks WHERE id = ?", (tank_id,)).fetchone()
        if exists is None:
            raise LookupError(f"Tank {tank_id} not found")
        conn.execute(
            "INSERT INTO consumption_readings (tank_id, liters, recorded_at) VALUES (?, ?, ?)",
            (tank_id, liters, _now()),
        )
        return get_readings(conn, tank_id)


def seed_if_empty() -> int:
    """Insert a demo tank so the CURE screen is usable on first run."""

    with connect() as conn:
        count = conn.execute("SELECT COUNT(*) AS n FROM tanks").fetchone()["n"]
        if count:
            return 0

        stamp = _now()
        cur = conn.execute(
            """
            INSERT INTO tanks
                (name, capacity_liters, level_percent, latitude, longitude,
                 created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            ("Campus Tank 1", 50000, 62, 13.6288, 78.48, stamp, stamp),
        )
        tank_id = cur.lastrowid
        for liters in (7200, 7600, 7400, 8000, 7300, 7700, 7500):
            conn.execute(
                "INSERT INTO consumption_readings (tank_id, liters, recorded_at) VALUES (?, ?, ?)",
                (tank_id, liters, stamp),
            )
        return 1
