from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
import os
from models.image import ImageUpload
from database.db import get_db
from crud.upload_image_crud import create_image_upload
import logging.config


logging.config.fileConfig("logging.conf")
logger = logging.getLogger("sLogger")


router = APIRouter()

UPLOAD_DIRECTORY = "./uploads"  

if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)



@router.post("/upload-image/")
async def upload_image(task_id: int, file: UploadFile = File(...), db: Session = Depends(get_db),):
    try:
        file_location = os.path.join(UPLOAD_DIRECTORY, file.filename)
        
        with open(file_location, "wb") as buffer:
            buffer.write(await file.read())
        
        image_upload = create_image_upload(db=db, task_id=task_id, file_path=file_location)
        logger.info(f"Image uploaded successfully for task_id {task_id}: {file_location}")
        return {"filename": file.filename, "file_location": file_location, "task_id": task_id}

    except Exception as e:
        logger.error(f"Failed to upload image for task_id {task_id}: {e}")
        raise HTTPException(status_code=500, detail="Image upload failed")

