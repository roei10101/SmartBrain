from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.database import Base, get_db
from backend import models, auth, crud, schemas
import os
from dotenv import load_dotenv
from pathlib import Path

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / "backend" / ".env")

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def verify_user(email, password):
    db = SessionLocal()
    try:
        user = crud.get_user_by_email(db, email=email)
        if user:
            print(f"User {email} found.")
            print(f"Hashed password in DB: {user.hashed_password}")
            is_valid = auth.verify_password(password, user.hashed_password)
            print(f"Password '{password}' valid? {is_valid}")
            
            # Double check hashing
            new_hash = auth.get_password_hash(password)
            print(f"New hash of '{password}': {new_hash}")
            print(f"Verify new hash: {auth.verify_password(password, new_hash)}")
        else:
            print(f"User {email} not found. Creating...")
            user_in = schemas.UserCreate(email=email, password=password)
            user = crud.create_user(db, user_in)
            print(f"User {email} created.")
            is_valid = auth.verify_password(password, user.hashed_password)
            print(f"Password '{password}' valid immediately after creation? {is_valid}")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    print("Verifying test7@example.com...")
    verify_user("test7@example.com", "password123")
    print("\nVerifying test9@example.com...")
    verify_user("test9@example.com", "password123")
