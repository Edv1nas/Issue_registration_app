from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class ItemCreate(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    unit_price: float

    class Config:
        orm_mode = True
        json_schema_extra = {
            "example": {
                "name": "SSD 129 GB Samsung 2.5 inch",
                "description": "SSD 129 GB with power button",
                "category": "SSD",
                "unit_price": 112.00,
            }
        }


class ItemResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    category: Optional[str] = None
    unit_price: float
    created_at: datetime

    class Config:
        orm_mode = True
        json_schema_extra = {
            "example": {
                "item_id": 1,
                "name": "SSD 129 GB Samsung 2.5 inch",
                "description": "SSD 129 GB with power button",
                "category": "SSD",
                "unit_price": 112.00,
                "created_at": "2023-08-26 20:43:56.984731",
            }
        }


class ItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    unit_price: Optional[float] = None

    class Config:
        orm_mode = True
        json_schema_extra = {
            "example": {
                "name": "SSD 129 GB Samsung 2.5 inch",
                "description": "SSD 129 GB with power button",
                "category": "SSD",
                "unit_price": 112.00,
            }
        }