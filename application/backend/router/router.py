from fastapi import APIRouter

from endpoints import accounts_api, tasks_api


api_router = APIRouter()

api_router.include_router(accounts_api.router, prefix="/accounts", tags=["accounts"])
api_router.include_router(tasks_api.router, prefix="/tasks", tags=["tasks"])
