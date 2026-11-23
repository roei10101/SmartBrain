from datetime import timedelta

import auth
from tests.conftest import register_and_login


def test_password_is_hashed_and_verifiable():
    hashed = auth.get_password_hash("correct horse")
    assert hashed != "correct horse"
    assert auth.verify_password("correct horse", hashed)
    assert not auth.verify_password("wrong", hashed)


def test_register_does_not_leak_password(client):
    response = client.post("/users/", json={"email": "bob@example.com", "password": "pw123456"})
    assert response.status_code == 200
    body = response.json()
    assert body["email"] == "bob@example.com"
    assert "password" not in body and "hashed_password" not in body


def test_register_duplicate_email_is_rejected(client):
    payload = {"email": "bob@example.com", "password": "pw123456"}
    assert client.post("/users/", json=payload).status_code == 200
    response = client.post("/users/", json=payload)
    assert response.status_code == 400
    assert response.json()["detail"] == "Email already registered"


def test_login_with_wrong_password_fails(client):
    client.post("/users/", json={"email": "bob@example.com", "password": "pw123456"})
    response = client.post("/token", data={"username": "bob@example.com", "password": "nope"})
    assert response.status_code == 401


def test_login_unknown_user_fails(client):
    response = client.post("/token", data={"username": "ghost@example.com", "password": "x"})
    assert response.status_code == 401


def test_me_returns_current_user(client):
    headers = register_and_login(client, "carol@example.com")
    response = client.get("/users/me/", headers=headers)
    assert response.status_code == 200
    assert response.json()["email"] == "carol@example.com"


def test_protected_routes_require_token(client):
    for path in ("/tasks/", "/notes/", "/resources/", "/study-sessions/", "/stats/", "/users/me/"):
        assert client.get(path).status_code == 401, path


def test_garbage_token_is_rejected(client):
    response = client.get("/tasks/", headers={"Authorization": "Bearer not-a-jwt"})
    assert response.status_code == 401


def test_expired_token_is_rejected(client):
    register_and_login(client, "dave@example.com")
    expired = auth.create_access_token({"sub": "dave@example.com"}, expires_delta=timedelta(seconds=-1))
    response = client.get("/tasks/", headers={"Authorization": f"Bearer {expired}"})
    assert response.status_code == 401


def test_token_signed_with_another_key_is_rejected(client):
    from jose import jwt

    register_and_login(client, "erin@example.com")
    forged = jwt.encode({"sub": "erin@example.com"}, "attacker-key", algorithm="HS256")
    response = client.get("/users/me/", headers={"Authorization": f"Bearer {forged}"})
    assert response.status_code == 401
