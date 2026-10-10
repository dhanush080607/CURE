"""API-level checks for auth, rate limiting, validation and cache bounds.

Runs standalone (``python test_api.py``) and is collectable by pytest.
Uses a throwaway SQLite file so the real database is never touched.
"""

from __future__ import annotations

import os
import pathlib
import sys
import tempfile

# Must be set before the app package is imported: config reads it at import time.
_TMP_DB = pathlib.Path(tempfile.gettempdir()) / "cure_test_api.db"
if _TMP_DB.exists():
    _TMP_DB.unlink()
os.environ["CURE_DB_PATH"] = str(_TMP_DB)
os.environ["CURE_OLLAMA_ENABLED"] = "false"
os.environ.pop("CURE_API_KEY", None)

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))

from fastapi.testclient import TestClient  # noqa: E402

from app import config  # noqa: E402
from app.api.deps import reset_rate_limits  # noqa: E402
from app.main import app, on_startup  # noqa: E402
from app.services import http_client  # noqa: E402

client = TestClient(app)

# TestClient only runs lifespan inside a `with` block, so create the schema
# up front rather than depending on startup hooks.
on_startup()

GOOD_RISK = {
    "tank_capacity_liters": 50000,
    "tank_level_percent": 62,
    "consumption_history": [7200, 7600, 7400, 8000, 7300, 7700, 7500],
    "latitude": 13.6288,
    "longitude": 78.48,
}


def _reset() -> None:
    reset_rate_limits()


# --------------------------------------------------------------------------
# auth
# --------------------------------------------------------------------------


def test_weather_is_open_without_auth():
    assert client.get("/health").status_code == 200


def test_tanks_reachable_when_auth_disabled():
    assert config.API_KEY == ""
    assert client.get("/tanks").status_code == 200


def test_tanks_require_api_key_when_enabled():
    original = config.API_KEY
    config.API_KEY = "s3cret-value"
    try:
        assert client.get("/tanks").status_code == 401
        assert client.get("/tanks", headers={"X-API-Key": "wrong"}).status_code == 401
        assert client.get("/tanks", headers={"X-API-Key": "s3cret-value"}).status_code == 200
    finally:
        config.API_KEY = original


def test_water_risk_requires_api_key_when_enabled():
    original = config.API_KEY
    config.API_KEY = "s3cret-value"
    try:
        assert client.post("/water/risk", json=GOOD_RISK).status_code == 401
        assert client.get("/water/history").status_code == 401
        assert client.post("/ai/ask", json={"question": "hi", "risk_data": {}}).status_code == 401
    finally:
        config.API_KEY = original


# --------------------------------------------------------------------------
# rate limiting
# --------------------------------------------------------------------------


def test_search_is_rate_limited():
    _reset()
    statuses = [client.get("/weather/search", params={"q": f"pl{x}"}).status_code for x in range(45)]
    assert 429 in statuses, "expected a 429 after exceeding the search budget"
    assert statuses[0] == 200 or statuses[0] in (429,)


def test_rate_limit_resets():
    _reset()
    assert client.get("/weather/search", params={"q": "resetcheck"}).status_code != 429


# --------------------------------------------------------------------------
# validation
# --------------------------------------------------------------------------


def test_risk_request_rejects_bad_values():
    _reset()
    bad = [
        {**GOOD_RISK, "tank_capacity_liters": 0},
        {**GOOD_RISK, "tank_level_percent": 150},
        {**GOOD_RISK, "consumption_history": [-5]},
        {**GOOD_RISK, "latitude": 999},
    ]
    for payload in bad:
        assert client.post("/water/risk", json=payload).status_code == 422


def test_ask_rejects_oversized_risk_data():
    _reset()
    huge = {"k": "A" * 20000, "risk_level": "LOW"}
    r = client.post("/ai/ask", json={"question": "why?", "risk_data": huge})
    assert r.status_code == 422


def test_ask_rejects_too_many_keys():
    _reset()
    many = {f"k{i}": "v" for i in range(200)}
    r = client.post("/ai/ask", json={"question": "why?", "risk_data": many})
    assert r.status_code == 422


# --------------------------------------------------------------------------
# cache bound
# --------------------------------------------------------------------------


def test_cache_is_bounded():
    http_client._cache.clear()
    for i in range(http_client.CACHE_MAX_ENTRIES + 50):
        http_client._cache[f"k{i}"] = (float(i), {})
        http_client._evict_if_full()
        assert len(http_client._cache) <= http_client.CACHE_MAX_ENTRIES
    http_client._cache.clear()


# --------------------------------------------------------------------------
# error disclosure
# --------------------------------------------------------------------------


def test_upstream_error_does_not_leak_exception_text():
    from app.api.weather import _upstream_error

    exc = _upstream_error(RuntimeError("secret internal host 10.0.0.5"), "Weather")
    assert "10.0.0.5" not in exc.detail
    assert "secret internal host" not in exc.detail


def _run_all() -> int:
    tests = [
        (n, f) for n, f in sorted(globals().items()) if n.startswith("test_") and callable(f)
    ]
    failed = 0
    for name, fn in tests:
        try:
            fn()
            print(f"PASS  {name}")
        except AssertionError as exc:
            failed += 1
            print(f"FAIL  {name}: {exc}")
        except Exception as exc:  # noqa: BLE001
            failed += 1
            print(f"ERROR {name}: {type(exc).__name__}: {exc}")
    print(f"\n{len(tests) - failed}/{len(tests)} passed")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(_run_all())