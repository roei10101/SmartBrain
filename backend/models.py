from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey, Float
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)

    tasks = relationship("Task", back_populates="owner")
    notes = relationship("Note", back_populates="owner")
    resources = relationship("Resource", back_populates="owner")
    projects = relationship("Project", back_populates="owner")
    grades = relationship("Grade", back_populates="owner")
    events = relationship("Event", back_populates="owner")
    study_sessions = relationship("StudySession", back_populates="owner")

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    deadline = Column(Date, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    
    tasks = relationship("Task", back_populates="project")
    owner = relationship("User", back_populates="projects")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    is_completed = Column(Boolean, default=False)
    due_date = Column(Date, nullable=True)
    priority = Column(String, default="Medium") # Low, Medium, High
    status = Column(String, default="Todo") # Todo, In Progress, Done
    tags = Column(String, nullable=True) # Comma separated tags
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    project = relationship("Project", back_populates="tasks")
    owner = relationship("User", back_populates="tasks")

class Note(Base):
    __tablename__ = "notes"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    content = Column(String, nullable=True) # Rich Text / Markdown
    tags = Column(String, nullable=True)
    created_at = Column(Date, nullable=True)
    updated_at = Column(Date, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="notes")

class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    url = Column(String, nullable=True)
    type = Column(String, nullable=True) # Link, PDF, Video, etc.
    tags = Column(String, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="resources")

class Grade(Base):
    __tablename__ = "grades"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String, index=True)
    score = Column(Float)
    weight = Column(Float, default=1.0)
    date = Column(Date, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="grades")

class Event(Base):
    __tablename__ = "events"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    start_time = Column(String) # Storing as ISO string for simplicity
    end_time = Column(String)
    recurrence = Column(String, nullable=True) # e.g., "weekly"
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="events")

class StudySession(Base):
    __tablename__ = "study_sessions"

    id = Column(Integer, primary_key=True, index=True)
    subject = Column(String, index=True)
    duration_minutes = Column(Integer)
    date = Column(Date, nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="study_sessions")
