from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import Optional


class AccountCreate(BaseModel):
    username: str
    password: str
    email: EmailStr

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "username": "Bob",
                "password": "hotbob112",
                "email": "bob@hotmail.com",
            }
        }


class AccountResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    created_at: datetime
    last_login: Optional[datetime]
    is_active: bool

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "username": "Bob",
                "email": "bob@hotmail.com",
                "created_at": "2023-08-26 20:43:56.984731",
                "last_login": "2023-08-26 20:43:56.984731",
                "is_active": True,
            }
        }
