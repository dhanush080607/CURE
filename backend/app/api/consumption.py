from fastapi import APIRouter
from pydantic import BaseModel

from app.risk.consumption_engine import calculate_average_consumption

router = APIRouter(
    prefix="/consumption",
    tags=["Consumption"],
)


class ConsumptionRequest(BaseModel):
    consumption_history: list[float]


@router.post("/average")
def consumption_average(data: ConsumptionRequest):
    return calculate_average_consumption(
        consumption_history=data.consumption_history
    )