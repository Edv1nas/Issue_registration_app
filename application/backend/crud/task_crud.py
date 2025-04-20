from sqlalchemy.orm import Session
from models.task import Task
from fastapi import HTTPException
from schemas.task_schemas import TaskCreate
from models.task_status import TaskStatus
from datetime import datetime



def create_task(task: TaskCreate, db: Session) -> Task:
    waiting_status = db.query(TaskStatus).filter(TaskStatus.name == "Waiting for support").first()

    if not waiting_status:
        raise HTTPException(status_code=404, detail="Default status 'Waiting for support' not found")


    new_task = Task(
        client_email=task.client_email,
        description=task.description,
        summary=task.summary,
        status_id=waiting_status.id
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


def update_task_status(db: Session, task_id: int, new_status: TaskStatus):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        return None
    task.status = new_status
    db.commit()
    db.refresh(task)
    return task


def update_task_status(db: Session, task_id: int, status_name: str):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    status = db.query(TaskStatus).filter(TaskStatus.name == status_name).first()

    if not status:
        raise HTTPException(status_code=404, detail="Status not found")

    task.status_id = status.id
    task.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(task)
    return task
