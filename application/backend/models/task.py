from sqlalchemy import Column, Integer, String, TIMESTAMP

from datetime import datetime

from database.db import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    client_email = Column(String, unique=True, index=True)
    description = Column(String(255), nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.now())
