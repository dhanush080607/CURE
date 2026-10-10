"""Async HTTP helpers with a small in-process TTL cache."""

import asyncio
import time
from typing import Any

import httpx

from app.config import WEATHER_CACHE_SECONDS

# Upper bound on distinct cached responses. Geocoding queries are attacker
# controlled, so an unbounded dict would let a caller grow memory without
# limit. Oldest entries are dropped first.
CACHE_MAX_ENTRIES = 512

_cache: dict[str, tuple[float, Any]] = {}
_lock = asyncio.Lock()


def _evict_if_full() -> None:
    while len(_cache) >= CACHE_MAX_ENTRIES:
        oldest = min(_cache.items(), key=lambda kv: kv[1][0])[0]
        del _cache[oldest]


async def fetch_json(
    url: str,
    *,
    params: dict[str, Any] | None = None,
    timeout: float = 12.0,
    cache_seconds: int = WEATHER_CACHE_SECONDS,
    retries: int = 1,
) -> Any:
    """GET a URL and return decoded JSON.

    Results are cached by (url, sorted params) for `cache_seconds`.
    A single retry is attempted on transient network failure.
    """

    key = f"{url}?{sorted((params or {}).items())}"
    now = time.monotonic()

    async with _lock:
        hit = _cache.get(key)
        if hit and now - hit[0] < cache_seconds:
            return hit[1]

    last_error: Exception | None = None

    for attempt in range(retries + 1):
        try:
            async with httpx.AsyncClient(timeout=timeout) as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                data = response.json()
            async with _lock:
                _evict_if_full()
                _cache[key] = (time.monotonic(), data)
            return data
        except (httpx.HTTPError, ValueError) as exc:
            last_error = exc
            if attempt < retries:
                await asyncio.sleep(0.4 * (attempt + 1))

    raise last_error  # type: ignore[misc]


def cache_stats() -> dict[str, Any]:
    now = time.monotonic()
    fresh = sum(1 for ts, _ in _cache.values() if now - ts < WEATHER_CACHE_SECONDS)
    return {
        "entries": len(_cache),
        "fresh": fresh,
        "max_entries": CACHE_MAX_ENTRIES,
    }
