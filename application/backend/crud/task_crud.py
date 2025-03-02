from sqlalchemy.orm import Session
from models.task import Task
from fastapi import HTTPException
from schemas.task_schemas import TaskCreate, TaskResponse
from models.task import Task
from typing import List


def create_task(task: TaskCreate, db: Session) -> Task:

    new_task = Task(
        client_email=task.client_email,
        description=task.description,
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


def get_all_tasks_from_db(db: Session):
    task = db.query(Task).all()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")
    return task


def get_task(task_id: int, db: Session):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")
    return task


def get_tasks_by_client_email(client_email: int, db: Session):
    tasks = db.query(Task).filter(Task.client_email == client_email).all()
    if not tasks:
        raise HTTPException(status_code=404, detail="Tasks not found.")
    return tasks


def delete_task_from_database(task_id: int, db: Session):
    db_task = get_task(task_id, db)
    db.delete(db_task)
    db.commit()
    return db_task
