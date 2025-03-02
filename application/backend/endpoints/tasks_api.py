from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from crud.task_crud import (
    create_task,
    get_task,
    get_all_tasks_from_db,
    get_tasks_by_client_email,
)
from database.db import get_db
from schemas.task_schemas import TaskCreate, TaskResponse


router = APIRouter()


@router.post("/tasks/", response_model=TaskCreate)
def create_new_task(task: TaskCreate, db: Session = Depends(get_db)):
    return create_task(task, db)


@router.get("/tasks/", response_model=list[TaskResponse])
def get_all_tasks(db: Session = Depends(get_db)):
    return get_all_tasks_from_db(db)


@router.get("/tasks/{task_id}", response_model=TaskResponse)
def read_task(task_id: int, db: Session = Depends(get_db)):
    db_task = get_task(task_id, db)
    return db_task


@router.get("/tasks/by_email/{client_email}", response_model=list[TaskResponse])
def read_tasks_by_client_email(client_email: str, db: Session = Depends(get_db)):
    db_task = get_tasks_by_client_email(client_email, db)
    return db_task


@router.delete("/tasks/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)):
    db_task = get_task(task_id, db)
    db.delete(db_task)
    db.commit()
    return {"message": f"Task {db_task.description} deleted successfully."}
