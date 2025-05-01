from pydantic import BaseModel
from fastapi import UploadFile

class ImageUploadRequest(BaseModel):
    task_id: int 