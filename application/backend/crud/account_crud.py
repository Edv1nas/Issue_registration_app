from sqlalchemy.orm import Session
from fastapi import HTTPException
from schemas.account_schemas import AccountCreate
from models.account import Account


def create_account(db: Session, account: AccountCreate):
    account = Account(**account.dict())
    db.add(account)
    db.commit()
    db.refresh(account)
    return account


def get_account(db: Session, account_id: int):
    account = db.query(Account).filter(Account.id == account_id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account


def get_account_by_email(db: Session, email: str):
    account = db.query(Account).filter(Account.email == email).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account
