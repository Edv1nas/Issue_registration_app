import logging
import logging.config
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from schemas.comment_schemas import CommentCreate, CommentResponse
from database.db import get_db
from crud.token_crud import get_current_user
from crud.comment_crud import (
    create_comment,
    get_comments_by_task,
    update_comment,
    delete_comment,
)

logging.config.fileConfig("logging.conf")
logger = logging.getLogger("sLogger")

router = APIRouter()


@router.post("/task/{task_id}/comment/", response_model=CommentResponse)
def create_new_comment(
    task_id: int,
    comment_data: CommentCreate,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user),
):
    try:
        return create_comment(
            db,
            task_id,
            comment_data,
            current_user,
        )
    except Exception as error:
        logger.error("Failed to create new comment.", error)
        raise HTTPException(status_code=500, detail="Failed to create new comment.")


@router.get("/tasks/{task_id}/comments", response_model=list[CommentResponse])
def get_comments(task_id: int, db: Session = Depends(get_db)):
    try:
        comments = get_comments_by_task(db, task_id)

        logger.info(f"Retrieved {len(comments)} comments for task ID {task_id}")
        return comments

    except HTTPException as http_err:
        raise http_err

    except Exception as e:
        logger.error(f"Unexpected error retrieving comments for task {task_id}: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.put("/comments/{comment_id}", response_model=CommentResponse)
def modify_comment(comment_id: int, updated_text: str, db: Session = Depends(get_db)):
    try:
        comment = update_comment(db, comment_id, updated_text)
        logger.info(f"Updated comment ID {comment_id}")
        return comment
    except HTTPException as e:
        logger.warning(f"Failed to update comment ID {comment_id}: {e.detail}")
        raise
    except Exception as e:
        logger.error(f"Error updating comment {comment_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")


@router.delete("/comments/{comment_id}")
def remove_comment(comment_id: int, db: Session = Depends(get_db)):

    try:
        response = delete_comment(db, comment_id)
        logger.info(f"Deleted comment ID {comment_id}")
        return response
    except HTTPException as e:
        logger.warning(f"Failed to delete comment ID {comment_id}: {e.detail}")
        raise
    except Exception as e:
        logger.error(f"Error deleting comment {comment_id}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal Server Error")
