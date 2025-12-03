from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from database import Base, engine
import models, auth, crud, schemas
import os
from dotenv import load_dotenv

load_dotenv()

def init_db():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created.")

    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()

    email = "test@test.com"
    password = "test"

    try:
        user = crud.get_user_by_email(db, email=email)
        if not user:
            print(f"Creating user {email}...")
            user_in = schemas.UserCreate(email=email, password=password)
            crud.create_user(db, user_in)
            print("User created.")
        else:
            print(f"User {email} already exists.")
            # Verify password
            if auth.verify_password(password, user.hashed_password):
                print("Password verification successful.")
            else:
                print("Password verification FAILED.")
                # Update password
                print("Updating password...")
                user.hashed_password = auth.get_password_hash(password)
                db.commit()
                print("Password updated.")

    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
