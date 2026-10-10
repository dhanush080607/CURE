from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field

from app.services import database

router = APIRouter(prefix="/tanks", tags=["Tanks"])


class TankCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=80)
    tank_capacity_liters: float = Field(..., gt=0)
    tank_level_percent: float = Field(..., ge=0, le=100)
    latitude: float = Field(..., ge=-90, le=90)
    longitude: float = Field(..., ge=-180, le=180)


class TankUpdate(BaseModel):
    name: str | None = Field(None, min_length=1, max_length=80)
    tank_capacity_liters: float | None = Field(None, gt=0)
    tank_level_percent: float | None = Field(None, ge=0, le=100)
    latitude: float | None = Field(None, ge=-90, le=90)
    longitude: float | None = Field(None, ge=-180, le=180)


class ReadingCreate(BaseModel):
    liters: float = Field(..., ge=0)


@router.get("")
async def list_tanks():
    return {"tanks": database.list_tanks()}


@router.post("", status_code=201)
async def create_tank(payload: TankCreate):
    tank = database.create_tank(
        name=payload.name,
        capacity_liters=payload.tank_capacity_liters,
        level_percent=payload.tank_level_percent,
        latitude=payload.latitude,
        longitude=payload.longitude,
    )
    return tank


@router.get("/{tank_id}")
async def read_tank(tank_id: int):
    tank = database.get_tank(tank_id)
    if tank is None:
        raise HTTPException(status_code=404, detail="Tank not found")
    return tank


@router.patch("/{tank_id}")
async def patch_tank(tank_id: int, payload: TankUpdate):
    tank = database.update_tank(tank_id, **payload.model_dump(exclude_none=True))
    if tank is None:
        raise HTTPException(status_code=404, detail="Tank not found")
    return tank


@router.delete("/{tank_id}", status_code=204)
async def remove_tank(tank_id: int):
    if not database.delete_tank(tank_id):
        raise HTTPException(status_code=404, detail="Tank not found")


@router.post("/{tank_id}/readings", status_code=201)
async def add_reading(tank_id: int, payload: ReadingCreate):
    try:
        history = database.add_reading(tank_id, payload.liters)
    except LookupError:
        raise HTTPException(status_code=404, detail="Tank not found")
    return {"tank_id": tank_id, "consumption_history": history}
