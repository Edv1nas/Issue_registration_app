from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database.db import Base



class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    client_email = Column(String, index=True, nullable=False)
    summary = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    status_id = Column(Integer, ForeignKey("task_statuses.id"), nullable=False)
    priority_id = Column(Integer, ForeignKey("task_priorities.id"), nullable=False)
    assigned_account_id = Column(Integer, ForeignKey("public.accounts.id"), nullable=True)

    status = relationship("TaskStatus", back_populates="tasks")
    priority = relationship("TaskPriority", back_populates="tasks")

    comments = relationship(
        "Comment", back_populates="task", cascade="all, delete-orphan"
    )
    uploads = relationship("ImageUpload", back_populates="task", cascade="all, delete")
    assigned_account = relationship("Account", back_populates="tasks")

