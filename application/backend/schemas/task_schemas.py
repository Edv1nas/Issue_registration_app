from datetime import datetime
from pydantic import BaseModel, EmailStr


class TaskCreate(BaseModel):
    client_email: EmailStr
    description: str

    class Config:
        orm_mode = True
        json_schema_extra = {
            "example": {
                "client_email": "bob@hotmail.com",
                "description": "description",
            }
        }


class TaskResponse(BaseModel):
    id: int
    client_email: EmailStr
    description: str
    created_at: datetime

    class Config:
        orm_mode = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "client_email": "bob@hotmail.com",
                "description": "description",
                "created_at": "2023-08-26 20:43:56.984731",
            }
        }
