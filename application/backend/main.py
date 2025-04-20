from fastapi import FastAPI
from database.base import Base
from database.db import engine
from router.router import api_router
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database.db import get_db
from tasks_status_creation import create_initial_task_statuses

Base.metadata.create_all(bind=engine)

db: Session = next(get_db())

create_initial_task_statuses(db)

app = FastAPI()

origins = [
    "http://192.168.1.140:3000",
    "http://yourfrontenddomain.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(api_router, prefix="/api/v1")
