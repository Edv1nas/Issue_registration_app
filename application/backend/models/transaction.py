from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from database.db import Base


class Transaction(Base):
    __tablename__ = "transactions"
    id = Column(Integer, primary_key=True, index=True)
    item_id = Column(Integer, ForeignKey("items.id"), nullable=False)
    quantity = Column(Integer, nullable=False)
    location = Column(String, nullable=False)
    transaction_type = Column(String, nullable=False)
    transaction_date = Column(DateTime, default=datetime.utcnow)

    item = relationship("Item", back_populates="transactions")