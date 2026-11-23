"""Create the application database if it does not exist yet.

Connection details are taken from DATABASE_URL (see .env.example) - nothing is hardcoded.
Usage: python create_db.py
"""
import os
import sys
from pathlib import Path

import psycopg2
from dotenv import load_dotenv
from psycopg2 import sql
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
from sqlalchemy.engine import make_url

BASE_DIR = Path(__file__).resolve().parent
load_dotenv(BASE_DIR / ".env")


def create_database() -> None:
    db_url = os.getenv("DATABASE_URL")
    if not db_url:
        sys.exit("DATABASE_URL is not set. Copy .env.example to .env and fill it in.")

    url = make_url(db_url)
    dbname = url.database

    # Connect to the default 'postgres' database to be able to create ours
    con = psycopg2.connect(
        dbname="postgres",
        user=url.username,
        password=url.password,
        host=url.host or "localhost",
        port=url.port or 5432,
    )
    con.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    try:
        with con.cursor() as cur:
            cur.execute("SELECT 1 FROM pg_catalog.pg_database WHERE datname = %s", (dbname,))
            if cur.fetchone():
                print(f"Database {dbname} already exists.")
                return
            print(f"Creating database {dbname}...")
            cur.execute(sql.SQL("CREATE DATABASE {}").format(sql.Identifier(dbname)))
            print(f"Database {dbname} created successfully.")
    finally:
        con.close()


if __name__ == "__main__":
    create_database()
