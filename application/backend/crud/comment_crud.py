import logging.config
from sqlalchemy.orm import Session
from datetime import datetime
from fastapi import HTTPException
from models.comment import Comment
from schemas.comment_schemas import CommentCreate
from models.task import Task

logging.config.fileConfig("logging.conf")
logger = logging.getLogger("sLogger")


def create_comment(db: Session, task_id: int, comment_data: CommentCreate, user: str):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    db_comment = Comment(
        comment_text=comment_data.comment_text,
        task_id=task_id,
        author=user,
        created_at=datetime.utcnow(),
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment


def get_comments_by_task(db: Session, task_id: int):
    try:
        return db.query(Comment).filter(Comment.task_id == task_id).all()
    except Exception as e:
        logger.error(f"Database error while fetching comments for task {task_id}: {e}")
        raise HTTPException(status_code=500, detail="Database Error")


def update_comment(db: Session, comment_id: int, updated_comment: str):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    comment.comment_text = updated_comment

    db.commit()
    db.refresh(comment)
    return comment


def delete_comment(db: Session, comment_id: int):
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(status_code=404, detail="Comment not found")

    db.delete(comment)
    db.commit()
    return {"message": "Comment deleted successfully"}
