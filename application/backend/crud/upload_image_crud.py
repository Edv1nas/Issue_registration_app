import logging.config
from sqlalchemy.orm import Session
from schemas.account_schemas import AccountCreate
from models.image import ImageUpload


logging.config.fileConfig("logging.conf")
logger = logging.getLogger("sLogger")


def create_image_upload(db: Session, task_id: int, file_path: str):
    upload = ImageUpload(task_id=task_id, file_path=file_path)
    db.add(upload)
    db.commit()
    db.refresh(upload)
    return upload