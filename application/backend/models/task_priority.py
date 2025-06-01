from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database.db import Base

class TaskPriority(Base):
    __tablename__ = "task_priorities"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)

    tasks = relationship("Task", back_populates="priority")