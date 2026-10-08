from fastapi import APIRouter
from pydantic import BaseModel

from app.ai.agent import ask_cure


router = APIRouter(
    prefix="/ai",
    tags=["AI"],
)


class AIRequest(BaseModel):
    question: str
    risk_data: dict


@router.post("/ask")
def ask_cure_endpoint(data: AIRequest):

    prompt = f"""
Here is the latest CURE water-risk data:

{data.risk_data}

User question:
{data.question}

Analyze ONLY the provided data.

Do not invent measurements, weather information, or risk levels.
Give a concise, practical answer.
"""

    result = ask_cure(prompt)

    return {
        "question": data.question,
        "answer": result,
    }