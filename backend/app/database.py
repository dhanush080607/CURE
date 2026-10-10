"""Persistence for recorded water risk assessments.

Shares the connection factory and database file with
``app.services.database`` so the whole app uses a single SQLite store.
"""

import json

from app.services.database import connect

SCHEMA = """
CREATE TABLE IF NOT EXISTS water_risk_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL DEFAULT (
        strftime('%Y-%m-%dT%H:%M:%fZ', 'now')
    ),
    tank_capacity_liters REAL NOT NULL,
    tank_level_percent REAL NOT NULL,
    available_water_liters REAL,
    average_daily_consumption_liters REAL,
    projected_daily_consumption_liters REAL,
    max_temperature_c REAL,
    water_runway_days REAL,
    risk_level TEXT NOT NULL,
    risk_reason TEXT,
    consumption_trend TEXT,
    recommendation TEXT,
    consumption_history TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_water_risk_history_created
    ON water_risk_history (created_at);
"""

MAX_RECORDS = 1000


def init_database() -> None:
    with connect() as conn:
        conn.executescript(SCHEMA)


def save_water_risk(request_data: dict, result: dict) -> int:
    """Store one assessment and prune older rows beyond ``MAX_RECORDS``."""

    with connect() as conn:
        cursor = conn.execute(
            """
            INSERT INTO water_risk_history (
                tank_capacity_liters,
                tank_level_percent,
                available_water_liters,
                average_daily_consumption_liters,
                projected_daily_consumption_liters,
                max_temperature_c,
                water_runway_days,
                risk_level,
                risk_reason,
                consumption_trend,
                recommendation,
                consumption_history
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                request_data["tank_capacity_liters"],
                request_data["tank_level_percent"],
                result.get("available_water_liters"),
                result.get("average_daily_consumption_liters"),
                result.get("projected_daily_consumption_liters"),
                result.get("max_temperature_c"),
                result.get("water_runway_days"),
                result["risk_level"],
                result.get("risk_reason"),
                result.get("consumption_trend"),
                result.get("recommendation"),
                json.dumps(request_data["consumption_history"]),
            ),
        )

        history_id = cursor.lastrowid

        conn.execute(
            """
            DELETE FROM water_risk_history
            WHERE id NOT IN (
                SELECT id
                FROM water_risk_history
                ORDER BY id DESC
                LIMIT ?
            )
            """,
            (MAX_RECORDS,),
        )

        return history_id


def get_water_history(limit: int = 20) -> list[dict]:
    with connect() as conn:
        rows = conn.execute(
            """
            SELECT *
            FROM water_risk_history
            ORDER BY id DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()

        return [dict(row) for row in rows]