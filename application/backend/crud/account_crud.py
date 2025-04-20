import logging.config
from sqlalchemy.orm import Session
from schemas.account_schemas import AccountCreate
from models.account import Account
from typing import Optional, Dict, Union
from utils import pwd_context


logging.config.fileConfig("logging.conf")
logger = logging.getLogger("sLogger")


def create_account(db: Session, account: AccountCreate) -> Account:
    try:
        hashed_password = pwd_context.hash(account.password)
        db_account = Account(
            username=account.username,
            email=account.email,
            password=hashed_password,
        )
        db.add(db_account)
        db.commit()
        db.refresh(db_account)
        return db_account
    except Exception as e:
        db.rollback()
        logger.error("Error occurred while creating an account.", e)
        return None


def get_account_by_id(db: Session, account_id: int) -> Optional[Account]:
    try:
        return db.query(Account).filter(Account.id == account_id).first()
    except Exception as e:
        logger.error("Error occurred while fetching an account.", e)
        return None


def get_account_by_username(db: Session, account_username: str) -> Optional[Account]:
    try:
        return db.query(Account).filter(Account.username == account_username).first()
    except Exception as e:
        logger.error("Error occurred while fetching an account.", e)
        return None


def fetch_account_by_email(db: Session, email: str) -> Optional[Account]:
    try:
        return db.query(Account).filter(Account.email == email).first()
    except Exception as e:
        logger.error("Error occurred while fetching an account by email.", e)
        return None


def authenticate_account(db: Session, username: str, password: str):
    account = get_account_by_username(db, username)
    if not account:
        return False
    if not pwd_context.verify(password, account.password):
        return False
    return account
