from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from crud.task_crud import (
    create_task,
    get_task,
    get_all_tasks_from_db,
    get_tasks_by_client_email,
    update_task_status,
    update_task_image_path
)
from database.db import get_db
from schemas.task_schemas import TaskCreate, TaskResponse
import logging

logger = logging.getLogger("sLogger")

router = APIRouter()


@router.post("/tasks/", response_model=TaskResponse)
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
    return {"message": f"Task {db_task.summary} deleted successfully."}


@router.put("/tasks/{task_id}/status", response_model=TaskResponse)
def change_task_status(
    task_id: int, status_name: str, db: Session = Depends(get_db)
):
    updated_task = update_task_status(db, task_id, status_name)
    return updated_task


@router.put("/tasks/{task_id}")
def update_task(task_id: int, update_data: dict, db: Session = Depends(get_db)):
    try:
        updated_task = update_task_image_path(db, task_id=task_id, update_data=update_data)
        if not updated_task:
            raise HTTPException(status_code=404, detail="Task not found")
        return updated_task
    except HTTPException as http_exc:
        raise http_exc
    except Exception as e:
        logger.exception(f"Failed to update task {task_id}")
        raise HTTPException(status_code=500, detail="Task update failed")