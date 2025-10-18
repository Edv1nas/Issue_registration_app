import logging
import logging.config
from typing import Optional, List

from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session
from sqlalchemy import func 

from schemas.account_schemas import AccountCreate
from models.account import Account
from utils import pwd_context


logging.config.fileConfig("logging.conf", disable_existing_loggers=False)
logger = logging.getLogger("sLogger")

def create_account(db: Session, account: AccountCreate) -> Optional[Account]:
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

    except IntegrityError as e:
        db.rollback()
        logger.exception("IntegrityError while creating account")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Username or email already exists.",
        ) from e

    except SQLAlchemyError as e:
        db.rollback()
        logger.exception("Database error while creating account")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while creating account.",
        ) from e

def get_account_by_id(db: Session, account_id: int) -> Optional[Account]:
    try:
        return db.query(Account).filter(Account.id == account_id).first()
    except SQLAlchemyError:
        logger.exception("Database error while fetching account by id")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while fetching account.",
        )

def get_account_by_username(db: Session, username: str) -> Optional[Account]:
    try:
        return db.query(Account).filter(func.lower(Account.username) == username.strip().lower()).first()
    except SQLAlchemyError:
        logger.exception("Database error while fetching account by username")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while fetching account.",
        )

def fetch_account_by_email(db: Session, email: str) -> Optional[Account]:
    try:
        return db.query(Account).filter(func.lower(Account.email) == email.strip().lower()).first()
    except SQLAlchemyError:
        logger.exception("Database error while fetching account by email")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while fetching account.",
        )

def authenticate_account(db: Session, username: str, password: str) -> Optional[Account]:
    account = get_account_by_username(db, username)
    if not account:
        return None
    if not pwd_context.verify(password, account.password):
        return None
    return account

def get_system_user(db: Session, system_username: str = "admin") -> Optional[Account]:
    try:
        return db.query(Account).filter(Account.username == system_username).first()
    except SQLAlchemyError:
        logger.exception("Database error while fetching system user")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while fetching system user.",
        )

def get_all_users_from_db(db: Session) -> List[Account]:
    try:
        return db.query(Account).order_by(Account.id.asc()).all()
    except SQLAlchemyError:
        logger.exception("Database error while listing users")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error while listing users.",
        )
