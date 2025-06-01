from sqlalchemy.orm import Session
from models.task_priority import TaskPriority

def create_initial_task_priorities(db: Session):
    if db.query(TaskPriority).count() == 0:
        priorities = [
            {"name": "Low"},
            {"name": "Medium"},
            {"name": "High"},
            {"name": "Critical"}
        ]
        
        for priority in priorities:
            db.add(TaskPriority(**priority))
        
        db.commit()