from pydantic import BaseModel
from datetime import datetime


class CommentCreate(BaseModel):
    comment_text: str


class CommentResponse(CommentCreate):
    id: int
    task_id: int
    author: str
    created_at: datetime

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "task_id": 1,
                "comment_text": "comment",
                "author": "bob",
                "created_at": "2023-08-26 20:43:56.984731",
            }
        }
