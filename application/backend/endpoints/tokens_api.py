from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from crud.token_crud import create_access_token, verify_token
from schemas.token_schemas import Token
from crud.account_crud import authenticate_account
from database.base import Base
from database.db import engine
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta
from fastapi import status
from utils import ACCESS_TOKEN_EXPIRE_MINUTES

router = APIRouter()


@router.post("/token", response_model=Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)
):
    account = authenticate_account(db, form_data.username, form_data.password)
    if not account:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": account.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/verify_token/{token}")
def verify_account_token(token: str):
    try:
        payload = verify_token(token=token)
        return {"message": "Token is valid", "data": payload}
    except HTTPException as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail)
