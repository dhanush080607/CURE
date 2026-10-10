"""Optional local AI explanation.

Ollama is optional. When it is disabled or unreachable, the API returns a
deterministic, template-based explanation instead of failing, so the CURE
screen keeps working on machines without Ollama installed.
"""

from typing import Any

import httpx

from app.config import OLLAMA_ENABLED, OLLAMA_HOST, OLLAMA_MODEL

SYSTEM_PROMPT = """
You are CURE, the Climate & Utility Risk Engine assistant.

Your ONLY job is to explain the water-risk result calculated by the system.

STRICT RULES:
1. Use ONLY the facts explicitly provided in the user's input.
2. Do NOT interpret, judge, or infer the data.
3. Do NOT calculate or modify any value.
4. Do NOT create a new risk reason.
5. Do NOT create a new recommendation.
6. Repeat the provided risk level exactly.
7. Keep the response to 2-3 short sentences.
8. Do not use Markdown or bullet points.
"""


def is_available() -> bool:
    return OLLAMA_ENABLED


def build_explanation(risk: dict[str, Any]) -> str:
    """Deterministic explanation used when no AI backend is available."""

    level = risk.get("risk_level", "UNKNOWN")
    runway = risk.get("water_runway_days")
    reason = risk.get("risk_reason") or "No risk reason provided."
    recommendation = risk.get("recommendation") or "No recommendation provided."
    trend = risk.get("consumption_trend", "UNKNOWN")

    if runway is None:
        opening = (
            "Water runway could not be calculated because projected daily "
            "consumption is zero."
        )
    else:
        opening = (
            f"Water runway is {round(runway, 2)} days with a risk level of {level}."
        )

    trend_line = {
        "INCREASING": "Recent usage is increasing.",
        "DECREASING": "Recent usage is decreasing.",
        "STABLE": "Recent usage is relatively stable.",
        "UNKNOWN": "",
    }.get(trend, "")

    parts = [opening, reason]
    if trend_line:
        parts.append(trend_line)
    parts.append(recommendation)

    return " ".join(p for p in parts if p)


def build_prompt(risk: dict[str, Any]) -> str:
    return "\n".join(
        [
            "Explain the following CURE water-risk result.",
            "Use ONLY the provided data.",
            "",
            f"Available water: {risk.get('available_water_liters')} liters",
            f"Average daily consumption: {risk.get('average_daily_consumption_liters')} liters",
            f"Projected daily consumption: {risk.get('projected_daily_consumption_liters')} liters",
            f"Consumption trend: {risk.get('consumption_trend')}",
            f"Water runway: {risk.get('water_runway_days')}",
            f"Maximum temperature: {risk.get('max_temperature_c')} C",
            f"Heat adjustment: {risk.get('heat_adjustment_percent')}%",
            f"Risk level: {risk.get('risk_level')}",
            f"Risk reason: {risk.get('risk_reason')}",
            f"System recommendation: {risk.get('recommendation')}",
            "",
            "Return a concise plain-text explanation. Do not use Markdown.",
        ]
    )


async def explain(risk: dict[str, Any]) -> dict[str, Any]:
    """Return an explanation plus which backend produced it."""

    if not OLLAMA_ENABLED:
        return {
            "ai_advice": build_explanation(risk),
            "ai_backend": "deterministic",
        }

    try:
        async with httpx.AsyncClient(timeout=45.0) as client:
            response = await client.post(
                f"{OLLAMA_HOST}/api/chat",
                json={
                    "model": OLLAMA_MODEL,
                    "stream": False,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {"role": "user", "content": build_prompt(risk)},
                    ],
                },
            )
            response.raise_for_status()
            content = response.json()["message"]["content"].strip()
            return {"ai_advice": content, "ai_backend": "ollama"}
    except Exception:
        return {
            "ai_advice": build_explanation(risk),
            "ai_backend": "deterministic",
        }


async def answer(question: str, risk_data: dict[str, Any]) -> dict[str, Any]:
    """Grounded Q&A over a risk payload."""

    if not OLLAMA_ENABLED:
        level = risk_data.get("risk_level", "UNKNOWN")
        reason = risk_data.get("risk_reason") or "No risk reason provided."
        recommendation = risk_data.get("recommendation") or "No recommendation provided."
        return {
            "answer": f"Risk level is {level}. {reason} {recommendation}",
            "ai_backend": "deterministic",
        }

    try:
        async with httpx.AsyncClient(timeout=45.0) as client:
            response = await client.post(
                f"{OLLAMA_HOST}/api/chat",
                json={
                    "model": OLLAMA_MODEL,
                    "stream": False,
                    "messages": [
                        {"role": "system", "content": SYSTEM_PROMPT},
                        {
                            "role": "user",
                            "content": (
                                f"CURE risk data:\n{risk_data}\n\n"
                                f"Question: {question}\n\n"
                                "Answer only from the data above."
                            ),
                        },
                    ],
                },
            )
            response.raise_for_status()
            content = response.json()["message"]["content"].strip()
            return {"answer": content, "ai_backend": "ollama"}
    except Exception:
        level = risk_data.get("risk_level", "UNKNOWN")
        reason = risk_data.get("risk_reason") or "No risk reason provided."
        recommendation = risk_data.get("recommendation") or "No recommendation provided."
        return {
            "answer": f"Risk level is {level}. {reason} {recommendation}",
            "ai_backend": "deterministic",
        }
