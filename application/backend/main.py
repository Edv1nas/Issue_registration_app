from fastapi import FastAPI
from database.base import Base
from database.db import engine
from models.task_status import TaskStatus
from models.task_priority import TaskPriority
from router.router import api_router
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database.db import get_db
from tasks_status_creation import create_initial_task_statuses
from tasks_priority_creation import create_initial_task_priorities


app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://192.168.1.140:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

@app.on_event("startup")
def startup_event():
    db: Session = next(get_db())
    try:
        create_initial_task_statuses(db)
        create_initial_task_priorities(db)
    except Exception as e:
        print(f"Startup error: {e}")
        raise
    finally:
        db.close()

app.include_router(api_router, prefix="/api/v1")
