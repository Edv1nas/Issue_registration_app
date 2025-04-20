from sqlalchemy.orm import Session
from models.task_status import TaskStatus

def create_initial_task_statuses(db: Session):
    if db.query(TaskStatus).count() == 0:
        statuses = [
            {"name": "Waiting for support"},
            {"name": "In progress"},
            {"name": "Done"}
        ]
        
        for status in statuses:
            db.add(TaskStatus(**status))
        
        db.commit()