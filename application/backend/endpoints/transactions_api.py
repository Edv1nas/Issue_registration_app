from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from schemas.transaction_schema import TransactionCreate, Transaction
from database.db import get_db
from crud.transaction_crud import (
    create_transaction,
    get_transaction,
    get_transactions_by_item,
    get_stock_by_location,
)

router = APIRouter()


@router.post("/transactions/", response_model=Transaction)
def create_new_transaction(
    transaction: TransactionCreate, db: Session = Depends(get_db)
):
    return create_transaction(db, transaction)


@router.get("/transactions/{transaction_id}", response_model=Transaction)
def get_transaction_info(transaction_id: int, db: Session = Depends(get_db)):
    return get_transaction(db, transaction_id)


@router.get("/transactions/item/{item_id}", response_model=list[Transaction])
def list_transactions(item_id: int, db: Session = Depends(get_db)):
    return get_transactions_by_item(db, item_id)


@router.get("/stock-by-location/")
def list_stock_by_location(db: Session = Depends(get_db)):
    return get_stock_by_location(db)