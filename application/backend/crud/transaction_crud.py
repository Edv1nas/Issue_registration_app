from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.sql import func, case
from models.transaction import Transaction
from models.item import Item
from schemas.transaction_schema import TransactionCreate


def create_transaction(db: Session, transaction: TransactionCreate):
    item = db.query(Item).filter(Item.id == transaction.item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")

    db_transaction = Transaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction


def get_transaction(db: Session, transaction_id: int):
    transaction = db.query(Transaction).filter(Transaction.id == transaction_id).first()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction


def get_transactions_by_item(db: Session, item_id: int):
    transaction = db.query(Transaction).filter(Transaction.item_id == item_id).all()
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction


def get_stock_by_location(db: Session):
    results = (
        db.query(
            Transaction.item_id,
            Transaction.location,
            func.sum(
                case(
                    (
                        Transaction.transaction_type == "in",
                        Transaction.quantity,
                    ),
                    (
                        Transaction.transaction_type == "out",
                        -Transaction.quantity,
                    ),
                    else_=0,
                )
            ).label("current_quantity"),
        )
        .group_by(Transaction.item_id, Transaction.location)
        .all()
    )

    if not results:
        raise HTTPException(status_code=404, detail="Stock not found")

    return [
        {
            "item_id": result.item_id,
            "location": result.location,
            "current_quantity": result.current_quantity,
        }
        for result in results
    ]