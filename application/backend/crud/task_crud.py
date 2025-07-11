from sqlalchemy.orm import Session
from models.task import Task
from fastapi import HTTPException
from schemas.task_schemas import TaskCreate
from models.task_status import TaskStatus
from models.task_priority import TaskPriority
from crud.account_crud import get_system_user
from datetime import datetime
import logging


logger = logging.getLogger("sLogger")


def create_task(task: TaskCreate, db: Session) -> Task:
    waiting_status = db.query(TaskStatus).filter(TaskStatus.name == "Waiting for support").first()
    first_priority = db.query(TaskPriority).filter(TaskPriority.name == "Low").first()

    if not waiting_status:
        raise HTTPException(status_code=404, detail="Default status 'Waiting for support' not found")

    if not first_priority:
        raise HTTPException(status_code=404, detail="Default priority 'Low' not found")
    
    system_user = get_system_user(db)
    if not system_user:
        raise HTTPException(status_code=404, detail="System user not found")

    new_task = Task(
        client_email=task.client_email,
        description=task.description,
        summary=task.summary,
        status_id=waiting_status.id,
        priority_id=first_priority.id,
        assigned_account_id=system_user.id
    )

    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task


def get_all_tasks_from_db(db: Session):
    task = db.query(Task).order_by(Task.id.asc()).all()
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


def update_task_priority(db: Session, task_id: int, priority_name: str):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    priority = db.query(TaskPriority).filter(TaskPriority.name == priority_name).first()

    if not priority:
        raise HTTPException(status_code=404, detail="Priority not found")

    task.priority_id = priority.id
    task.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(task)
    return task


def update_task_assignee(db: Session, task_id: int, user_id: int):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    task.assigned_account_id = user_id
    task.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(task)
    return task

def update_task_image_path(db: Session, task_id: int, update_data: dict):
    try:
        task = db.query(Task).filter(Task.id == task_id).first()
        if not task:
            logger.warning(f"Task with ID {task_id} not found for update.")
            return None

        for key, value in update_data.items():
            if hasattr(task, key):
                setattr(task, key, value)

        db.commit()
        db.refresh(task)
        logger.info(f"Task {task_id} updated successfully with data: {update_data}")
        return task

    except Exception as e:
        logger.error(f"Error updating task {task_id}: {e}")
        db.rollback()
        raise
