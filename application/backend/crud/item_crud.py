from sqlalchemy.orm import Session
from models.item import Item
from fastapi import HTTPException
from schemas.item_schema import ItemCreate, ItemUpdate
from models.item import Item


def create_item(item: ItemCreate, db: Session) -> Item:
    existing_item = db.query(Item).filter(Item.name == item.name).first()

    if existing_item:
        raise HTTPException(
            status_code=400, detail=f"Item with name '{item.name}' already exists."
        )

    new_item = Item(
        name=item.name,
        description=item.description or "",
        category=item.category,
        unit_price=item.unit_price,
    )

    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item


def get_all_items_from_db(db: Session):
    item = db.query(Item).all()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")
    return item


def get_item(item_id: int, db: Session):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")
    return item


def get_item_by_category(category: str, db: Session):
    item = db.query(Item).filter(Item.category == category).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")
    return item


def get_item_by_name(item_name: str, db: Session):
    item = db.query(Item).filter(Item.name == item_name).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")
    return item


def update_item(item_id: int, updated_item: ItemUpdate, db: Session):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")

    if updated_item.name:
        item.name = updated_item.name
    if updated_item.description:
        item.description = updated_item.description
    if updated_item.category:
        item.category = updated_item.category
    if updated_item.unit_price is not None:
        item.unit_price = updated_item.unit_price

    db.commit()
    db.refresh(item)
    return item


def delete_item_from_database(item_id: int, db: Session):
    item = db.query(Item).filter(Item.id == item_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found.")

    db.delete(item)
    db.commit()
    return item