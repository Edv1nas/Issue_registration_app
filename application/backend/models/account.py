from sqlalchemy import Column, Integer, String, TIMESTAMP

from datetime import datetime

from database.db import Base


class Account(Base):
    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    created_at = Column(TIMESTAMP, default=datetime.now())
    last_login = Column(TIMESTAMP, nullable=True)
