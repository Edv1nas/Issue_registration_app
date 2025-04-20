from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime, String
from sqlalchemy.orm import relationship
from datetime import datetime
from database.db import Base


class Comment(Base):
    __tablename__ = "comments"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(
        Integer, ForeignKey("tasks.id", ondelete="CASCADE"), nullable=False
    )
    comment_text = Column(Text, nullable=False)
    author = Column(String, index=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    task = relationship("Task", back_populates="comments")
