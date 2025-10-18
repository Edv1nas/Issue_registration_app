import logging
import logging.config
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from crud.account_crud import (
    create_account,
    fetch_account_by_email,
    get_account_by_username,
    get_all_users_from_db
)
from database.db import get_db
from schemas.account_schemas import AccountCreate, AccountResponse
from typing import List

logging.config.fileConfig("logging.conf")
logger = logging.getLogger("sLogger")


router = APIRouter()


@router.post("", response_model=AccountCreate)
def create_new_account(account: AccountCreate, db: Session = Depends(get_db)):
    try:
        return create_account(db, account)
    except Exception as error:
        logger.error("Failed to create new account.", error)
        raise HTTPException(status_code=500, detail="Failed to create new account.")


@router.get("/{username}", response_model=AccountResponse)
def read_account_by_username(username: str, db: Session = Depends(get_db)):
    db_account = get_account_by_username(db, username)
    if db_account is None:
        logger.error("Account not found")
        raise HTTPException(status_code=404, detail="Account not found")
    return db_account


@router.get("/{email}", response_model=AccountResponse)
def get_account_by_email(email: str, db: Session = Depends(get_db)):
    account = fetch_account_by_email(db, email=email)
    if not account:
        logger.error("Account not found")
        raise HTTPException(status_code=404, detail="Account not found")
    return account


@router.get("", response_model=List[AccountResponse])
def get_all_users(db: Session = Depends(get_db)):
    return get_all_users_from_db(db)