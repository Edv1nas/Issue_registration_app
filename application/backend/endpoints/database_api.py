import logging
import logging.config
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db


logging.config.fileConfig("logging.conf")
logger = logging.getLogger("sLogger")


router = APIRouter()



@router.get("/test-db")
def test_db_connection(db: Session = Depends(get_db)):
    try:
        db.execute("SELECT 1")
        return {"message": "Database connection successful"}
    except Exception as e:
        logger.error(f"Database connection error: {e}")
        raise HTTPException(status_code=500, detail="Database connection failed")