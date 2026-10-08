from fastapi import APIRouter
from pydantic import BaseModel

from app.risk.heat_engine import calculate_heat_adjustment

router = APIRouter(prefix="/heat", tags=["Heat"])


class HeatRequest(BaseModel):
    max_temperature_c: float
    heat_warning: bool


@router.post("/adjustment")
def heat_adjustment(data: HeatRequest):
    return calculate_heat_adjustment(
        max_temperature_c=data.max_temperature_c,
        heat_warning=data.heat_warning,
    )