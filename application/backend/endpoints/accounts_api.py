from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from crud.account_crud import create_account, get_account, get_account_by_email
from database.db import get_db
from schemas.account_schemas import AccountCreate, AccountResponse


router = APIRouter()


@router.post("/accounts/", response_model=AccountCreate)
def create_new_account(account: AccountCreate, db: Session = Depends(get_db)):
    return create_account(db, account)


@router.get("/accounts/{account_id}", response_model=AccountResponse)
def read_account(account_id: int, db: Session = Depends(get_db)):
    return get_account(db, account_id)


@router.get("/by_email/{email}", response_model=AccountResponse)
def get_new_account_by_email(email: str, db: Session = Depends(get_db)):
    return get_account_by_email(db, email)
