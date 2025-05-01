from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import List, Optional
from schemas.comment_schemas import CommentResponse

class TaskStatusResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "name": "Waiting for support",
            }
        }

class TaskCreate(BaseModel):
    client_email: EmailStr
    summary: str
    description: str
    image_path: Optional[str] = None

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "client_email": "bob@hotmail.com",
                "summary": "summary",
                "description": "description",
                "image_path": "/uploads/example.jpg"
            }
        }


class TaskResponse(BaseModel):
    id: int
    client_email: EmailStr
    summary: str
    description: str
    created_at: datetime
    updated_at: datetime
    status: TaskStatusResponse
    comments: List[CommentResponse]
    image_path: Optional[str] = None

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "client_email": "bob@hotmail.com",
                "summary": "summary",
                "description": "description",
                "created_at": "2023-08-26 20:43:56.984731",
                "updated_at": "2023-08-26 20:43:56.984731",
                "status": {
                    "id": 1,
                    "name": "Waiting for support",  
                },
                "comments": [
                    {
                        "id": 1,
                        "task_id": 1,
                        "comment_text": "This is a comment",
                        "author": "bob",
                        "created_at": "2025-03-16T12:34:56",
                    }
                ],
                "image_path": "/uploads/example.jpg",
            }
        }
