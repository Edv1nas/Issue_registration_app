from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database.db import Base

class TaskStatus(Base):
    __tablename__ = "task_statuses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)

    tasks = relationship("Task", back_populates="status")