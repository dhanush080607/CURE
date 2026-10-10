"""Shared route dependencies: API-key auth and a fixed-window rate limiter."""

from __future__ import annotations

import secrets
import time
from collections import defaultdict

from fastapi import HTTPException, Request, Security
from fastapi.security import APIKeyHeader

from app import config

_api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


def auth_enabled() -> bool:
    # Read through the module so tests and runtime env changes are honoured.
    return bool(config.API_KEY)


async def require_api_key(key: str | None = Security(_api_key_header)) -> None:
    """No-op when no key is configured; otherwise demands an exact match."""

    if not auth_enabled():
        return
    if not key or not secrets.compare_digest(key, config.API_KEY):
        raise HTTPException(status_code=401, detail="Invalid or missing API key.")


# path -> (max requests, window seconds)
_LIMITS: dict[str, tuple[int, float]] = {
    # The picker debounces, but a fast typist still produces a burst, so this is
    # generous enough to stay invisible while still capping abuse.
    "/weather/search": (60, 60.0),
    "/water/risk": (20, 60.0),
    "/water/history": (60, 60.0),
    "/ai/ask": (20, 60.0),
    "/tanks": (120, 60.0),
}
_DEFAULT_LIMIT: tuple[int, float] = (120, 60.0)

_hits: dict[tuple[str, str], list[float]] = defaultdict(list)


def limit_for(path: str) -> tuple[int, float]:
    return _LIMITS.get(path, _DEFAULT_LIMIT)


async def rate_limit(request: Request) -> None:
    """Sliding-window limiter keyed on client IP + path."""

    limit, window = limit_for(request.url.path)
    client = request.client.host if request.client else "unknown"
    now = time.monotonic()

    bucket = _hits[(client, request.url.path)]
    bucket[:] = [t for t in bucket if now - t < window]

    if len(bucket) >= limit:
        retry_after = max(1, int(window - (now - bucket[0])))
        raise HTTPException(
            status_code=429,
            detail="Too many requests.",
            headers={"Retry-After": str(retry_after)},
        )

    bucket.append(now)


def reset_rate_limits() -> None:
    """Test helper."""

    _hits.clear()