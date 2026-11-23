"""Create the tables and seed the public demo account.

The demo credentials can be overridden with DEMO_USER_EMAIL / DEMO_USER_PASSWORD.
Usage: python init_db.py
"""
import os

from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker

load_dotenv()

import auth, crud, schemas  # noqa: E402  (must be imported after load_dotenv)
from database import Base, engine  # noqa: E402

DEMO_USER_EMAIL = os.getenv("DEMO_USER_EMAIL", "test@test.com")
DEMO_USER_PASSWORD = os.getenv("DEMO_USER_PASSWORD", "test")


def init_db() -> None:
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("Tables created.")

    db = sessionmaker(autocommit=False, autoflush=False, bind=engine)()
    try:
        user = crud.get_user_by_email(db, email=DEMO_USER_EMAIL)
        if not user:
            print(f"Creating demo user {DEMO_USER_EMAIL}...")
            crud.create_user(db, schemas.UserCreate(email=DEMO_USER_EMAIL, password=DEMO_USER_PASSWORD))
            print("Demo user created.")
        elif not auth.verify_password(DEMO_USER_PASSWORD, user.hashed_password):
            print("Demo user exists with a different password - updating it...")
            user.hashed_password = auth.get_password_hash(DEMO_USER_PASSWORD)
            db.commit()
        else:
            print(f"Demo user {DEMO_USER_EMAIL} already exists.")
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
