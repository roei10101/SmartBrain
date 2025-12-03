from sqlalchemy.orm import Session
import models, schemas
from auth import get_password_hash

# User
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Tasks
def get_tasks(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Task).filter(models.Task.user_id == user_id).offset(skip).limit(limit).all()

def create_task(db: Session, task: schemas.TaskCreate, user_id: int):
    db_task = models.Task(**task.dict(), user_id=user_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: int, task: schemas.TaskCreate, user_id: int):
    db_task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.user_id == user_id).first()
    if db_task:
        for key, value in task.dict().items():
            setattr(db_task, key, value)
        db.commit()
        db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int, user_id: int):
    db_task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.user_id == user_id).first()
    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task

# Projects
def get_projects(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Project).filter(models.Project.user_id == user_id).offset(skip).limit(limit).all()

def create_project(db: Session, project: schemas.ProjectCreate, user_id: int):
    db_project = models.Project(**project.dict(), user_id=user_id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

# Grades
def get_grades(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Grade).filter(models.Grade.user_id == user_id).offset(skip).limit(limit).all()

def create_grade(db: Session, grade: schemas.GradeCreate, user_id: int):
    db_grade = models.Grade(**grade.dict(), user_id=user_id)
    db.add(db_grade)
    db.commit()
    db.refresh(db_grade)
    return db_grade

# Events
def get_events(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Event).filter(models.Event.user_id == user_id).offset(skip).limit(limit).all()

def create_event(db: Session, event: schemas.EventCreate, user_id: int):
    db_event = models.Event(**event.dict(), user_id=user_id)
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event

# Notes
def get_notes(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Note).filter(models.Note.user_id == user_id).offset(skip).limit(limit).all()

def create_note(db: Session, note: schemas.NoteCreate, user_id: int):
    db_note = models.Note(**note.dict(), user_id=user_id)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note

def update_note(db: Session, note_id: int, note: schemas.NoteCreate, user_id: int):
    db_note = db.query(models.Note).filter(models.Note.id == note_id, models.Note.user_id == user_id).first()
    if db_note:
        for key, value in note.dict().items():
            setattr(db_note, key, value)
        db.commit()
        db.refresh(db_note)
    return db_note

def delete_note(db: Session, note_id: int, user_id: int):
    db_note = db.query(models.Note).filter(models.Note.id == note_id, models.Note.user_id == user_id).first()
    if db_note:
        db.delete(db_note)
        db.commit()
    return db_note

# Resources
def get_resources(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Resource).filter(models.Resource.user_id == user_id).offset(skip).limit(limit).all()

def create_resource(db: Session, resource: schemas.ResourceCreate, user_id: int):
    db_resource = models.Resource(**resource.dict(), user_id=user_id)
    db.add(db_resource)
    db.commit()
    db.refresh(db_resource)
    return db_resource

def delete_resource(db: Session, resource_id: int, user_id: int):
    db_resource = db.query(models.Resource).filter(models.Resource.id == resource_id, models.Resource.user_id == user_id).first()
    if db_resource:
        db.delete(db_resource)
        db.commit()
    return db_resource

# Study Sessions
def get_study_sessions(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    sessions = db.query(models.StudySession).filter(models.StudySession.user_id == user_id).offset(skip).limit(limit).all()
    with open("backend_debug.log", "a") as f:
        f.write(f"DEBUG: get_study_sessions for user {user_id}: found {len(sessions)} sessions\n")
    return sessions

def create_study_session(db: Session, study_session: schemas.StudySessionCreate, user_id: int):
    with open("backend_debug.log", "a") as f:
        f.write(f"DEBUG: create_study_session for user {user_id}: {study_session}\n")
    db_study_session = models.StudySession(**study_session.dict(), user_id=user_id)
    db.add(db_study_session)
    db.commit()
    db.refresh(db_study_session)
    with open("backend_debug.log", "a") as f:
        f.write(f"DEBUG: created session id {db_study_session.id}\n")
    return db_study_session

def update_study_session(db: Session, session_id: int, study_session: schemas.StudySessionCreate, user_id: int):
    db_session = db.query(models.StudySession).filter(models.StudySession.id == session_id, models.StudySession.user_id == user_id).first()
    if db_session:
        for key, value in study_session.dict().items():
            setattr(db_session, key, value)
        db.commit()
        db.refresh(db_session)
    return db_session

def delete_study_session(db: Session, session_id: int, user_id: int):
    db_session = db.query(models.StudySession).filter(models.StudySession.id == session_id, models.StudySession.user_id == user_id).first()
    if db_session:
        db.delete(db_session)
        db.commit()
    return db_session

# Stats
def get_stats(db: Session, user_id: int):
    pending_tasks = db.query(models.Task).filter(models.Task.user_id == user_id, models.Task.is_completed == False).count()
    notes_count = db.query(models.Note).filter(models.Note.user_id == user_id).count()
    
    # Calculate total study hours
    study_sessions = db.query(models.StudySession).filter(models.StudySession.user_id == user_id).all()
    total_minutes = sum([s.duration_minutes for s in study_sessions])
    study_hours = round(total_minutes / 60, 1)
    
    return {
        "pending_tasks": pending_tasks,
        "notes_created": notes_count,
        "study_hours": study_hours,
        "focus_score": "85%" # Placeholder logic for now
    }
