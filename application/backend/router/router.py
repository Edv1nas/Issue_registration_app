from fastapi import APIRouter

from endpoints import accounts_api, comments_api, tasks_api, tokens_api, images_api


api_router = APIRouter()

api_router.include_router(accounts_api.router, prefix="/accounts", tags=["accounts"])
api_router.include_router(comments_api.router, prefix="/comments", tags=["comments"])
api_router.include_router(tasks_api.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(tokens_api.router, prefix="/tokens", tags=["tokens"])
api_router.include_router(images_api.router, prefix="/images", tags=["images"])
