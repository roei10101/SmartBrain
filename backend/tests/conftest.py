"""Test setup: every test runs against a fresh, isolated SQLite database."""
import os
import sys
import tempfile
from pathlib import Path

# The app reads its configuration at import time, so set it before importing anything.
_tmp_dir = tempfile.mkdtemp(prefix="smartbrain-tests-")
os.environ["DATABASE_URL"] = f"sqlite:///{_tmp_dir}/test.db"
os.environ["SECRET_KEY"] = "test-only-secret-key-not-used-anywhere-else"
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "5"

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

import database  # noqa: E402
import main  # noqa: E402


@pytest.fixture(autouse=True)
def clean_database():
    database.Base.metadata.drop_all(bind=database.engine)
    database.Base.metadata.create_all(bind=database.engine)
    yield


@pytest.fixture
def client():
    with TestClient(main.app) as c:
        yield c


def register_and_login(client: TestClient, email: str, password: str = "s3cret-pass") -> dict:
    """Create a user and return ready-to-use Authorization headers."""
    response = client.post("/users/", json={"email": email, "password": password})
    assert response.status_code == 200, response.text
    response = client.post("/token", data={"username": email, "password": password})
    assert response.status_code == 200, response.text
    return {"Authorization": f"Bearer {response.json()['access_token']}"}


@pytest.fixture
def auth_headers(client):
    return register_and_login(client, "alice@example.com")
