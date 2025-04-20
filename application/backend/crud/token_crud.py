from fastapi import FastAPI, Depends, HTTPException
from database.base import Base
from database.db import engine
from jose import jwt, JWTError
from datetime import datetime, timedelta
from typing import Union
from utils import SECRET_KEY, ALGORITHM, oauth2_scheme


def create_access_token(data: dict, expires_delta: Union[timedelta, None] = None):
    to_encode = data.copy()

    # Get current UTC time
    now = datetime.utcnow()

    # If expires_delta is provided, use it, else default to 15 minutes
    if expires_delta:
        expire = now + expires_delta
    else:
        expire = now + timedelta(minutes=15)

    # Add expiration time to the data
    to_encode.update({"exp": expire})

    # Encode the JWT with the payload and secret key
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token or expired")
        return payload
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token or expired")


def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
