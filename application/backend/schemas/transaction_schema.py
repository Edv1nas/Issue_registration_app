
from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TransactionBase(BaseModel):
    item_id: int
    quantity: int
    transaction_type: str
    location: str

    class Config:
        orm_mode = True
        json_schema_extra = {
            "example": {
                "item_id": 1,
                "quantity": 10,
                "transaction_type": "in",
                "location": "A1",
            }
        }


class TransactionCreate(TransactionBase):
    pass


class Transaction(TransactionBase):
    id: int
    transaction_date: datetime

    class Config:
        orm_mode = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "item_id": 1,
                "quantity": 10,
                "transaction_type": "in",
                "location": "A1",
                "transaction_date": "2023-08-26 20:43:56.984731",
            }
        }
