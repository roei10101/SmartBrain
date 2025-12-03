from pydantic import BaseModel
from typing import List, Optional, Union
from datetime import date

class TaskBase(BaseModel):
    title: str
    description: Optional[str] = None
    due_date: Optional[date] = None
    is_completed: bool = False
    priority: str = "Medium"
    status: str = "Todo"
    tags: Optional[str] = None
    project_id: Optional[int] = None

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    class Config:
        orm_mode = True

class NoteBase(BaseModel):
    title: str
    content: Optional[str] = None
    tags: Optional[str] = None
    created_at: Optional[date] = None
    updated_at: Optional[date] = None

class NoteCreate(NoteBase):
    pass

class Note(NoteBase):
    id: int
    class Config:
        orm_mode = True

class ResourceBase(BaseModel):
    title: str
    url: Optional[str] = None
    type: Optional[str] = None
    tags: Optional[str] = None

class ResourceCreate(ResourceBase):
    pass

class Resource(ResourceBase):
    id: int
    class Config:
        orm_mode = True

class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    deadline: Optional[date] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    tasks: List[Task] = []
    class Config:
        orm_mode = True

class GradeBase(BaseModel):
    subject: str
    score: float
    weight: float = 1.0
    date: Optional[date] = None

class GradeCreate(GradeBase):
    pass

class Grade(GradeBase):
    id: int
    class Config:
        orm_mode = True

class EventBase(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: str
    end_time: str
    recurrence: Optional[str] = None

class EventCreate(EventBase):
    pass

class Event(EventBase):
    id: int
    class Config:
        orm_mode = True

class StudySessionBase(BaseModel):
    subject: str
    duration_minutes: int
    date: Union[date, None] = None

class StudySessionCreate(StudySessionBase):
    pass

class StudySession(StudySessionBase):
    id: int
    class Config:
        orm_mode = True

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool = True
    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None


