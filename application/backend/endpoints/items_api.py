from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from crud.item_crud import (
    create_item,
    get_all_items_from_db,
    get_item_by_category,
    get_item,
    delete_item_from_database,
    update_item,
)
from database.db import get_db
from schemas.item_schema import ItemCreate, ItemResponse, ItemUpdate


router = APIRouter()


@router.post("/items/", response_model=ItemCreate)
def create_new_item(item: ItemCreate, db: Session = Depends(get_db)):
    return create_item(item, db)


@router.get("/items/", response_model=list[ItemResponse])
def get_all_items(db: Session = Depends(get_db)):
    return get_all_items_from_db(db)


@router.get("/items/{item_id}", response_model=ItemResponse)
def read_item(item_id: int, db: Session = Depends(get_db)):
    db_item = get_item(item_id, db)
    return db_item


@router.get("/items/by_category/{category}", response_model=ItemResponse)
def read_item_by_category(category: str, db: Session = Depends(get_db)):
    db_item = get_item_by_category(category, db)
    return db_item


@router.put("/items/{item_id}", response_model=ItemUpdate)
def update_item_endpoint(
    item_id: int, updated_item: ItemUpdate, db: Session = Depends(get_db)
):
    return update_item(item_id, updated_item, db)


@router.delete("/items/{item_id}")
def delete_item(item_id: int, db: Session = Depends(get_db)):
    db_item = delete_item_from_database(item_id, db)
    return {"message": f"Item {db_item.name} deleted successfully."}