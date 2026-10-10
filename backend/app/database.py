
import sqlite3
from pathlib import Path

DATABASE_PATH = Path(__file__).resolve().parent.parent / "cure.db"


def get_connection():
    connection = sqlite3.connect(DATABASE_PATH)
    connection.row_factory = sqlite3.Row
    return connection


def init_database():
    with get_connection() as connection:
        connection.execute(
            """
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
            )
            """
        )


def save_water_risk(request_data: dict, result: dict) -> int:
    import json

    max_records = 1000

    with get_connection() as connection:
        cursor = connection.execute(
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

        connection.execute(
            """
            DELETE FROM water_risk_history
            WHERE id NOT IN (
                SELECT id
                FROM water_risk_history
                ORDER BY id DESC
                LIMIT ?
            )
            """,
            (max_records,),
        )

        return history_id


def get_water_history(limit: int = 20) -> list[dict]:
    with get_connection() as connection:
        rows = connection.execute(
            """
            SELECT *
            FROM water_risk_history
            ORDER BY id DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()

        return [dict(row) for row in rows]
