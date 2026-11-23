from tests.conftest import register_and_login


def test_root_and_health(client):
    assert client.get("/").status_code == 200
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_metrics_endpoint_is_exposed(client):
    client.get("/")
    response = client.get("/metrics")
    assert response.status_code == 200
    assert "http_requests_total" in response.text


def test_task_crud_lifecycle(client, auth_headers):
    created = client.post("/tasks/", json={"title": "Finish HW3", "priority": "High"}, headers=auth_headers)
    assert created.status_code == 200
    task = created.json()
    assert task["title"] == "Finish HW3"
    assert task["is_completed"] is False
    assert task["status"] == "Todo"

    listed = client.get("/tasks/", headers=auth_headers).json()
    assert [t["id"] for t in listed] == [task["id"]]

    updated = client.put(
        f"/tasks/{task['id']}",
        json={"title": "Finish HW3", "is_completed": True, "status": "Done"},
        headers=auth_headers,
    )
    assert updated.status_code == 200
    assert updated.json()["is_completed"] is True

    assert client.delete(f"/tasks/{task['id']}", headers=auth_headers).status_code == 200
    assert client.get("/tasks/", headers=auth_headers).json() == []
    assert client.delete(f"/tasks/{task['id']}", headers=auth_headers).status_code == 404


def test_task_requires_title(client, auth_headers):
    response = client.post("/tasks/", json={"priority": "High"}, headers=auth_headers)
    assert response.status_code == 422


def test_note_crud_lifecycle(client, auth_headers):
    note = client.post("/notes/", json={"title": "Lecture 4", "content": "TCP handshake"}, headers=auth_headers).json()
    updated = client.put(f"/notes/{note['id']}", json={"title": "Lecture 4", "content": "TCP + TLS"}, headers=auth_headers)
    assert updated.json()["content"] == "TCP + TLS"
    assert client.delete(f"/notes/{note['id']}", headers=auth_headers).status_code == 200
    assert client.put(f"/notes/{note['id']}", json={"title": "x"}, headers=auth_headers).status_code == 404


def test_resources_projects_grades_events(client, auth_headers):
    resource = client.post("/resources/", json={"title": "Docs", "url": "https://fastapi.tiangolo.com", "type": "Link"}, headers=auth_headers).json()
    assert client.get("/resources/", headers=auth_headers).json()[0]["id"] == resource["id"]
    assert client.delete(f"/resources/{resource['id']}", headers=auth_headers).status_code == 200

    project = client.post("/projects/", json={"title": "Final project", "deadline": "2026-06-01"}, headers=auth_headers).json()
    client.post("/tasks/", json={"title": "Write report", "project_id": project["id"]}, headers=auth_headers)
    projects = client.get("/projects/", headers=auth_headers).json()
    assert projects[0]["tasks"][0]["title"] == "Write report"

    client.post("/grades/", json={"subject": "Algorithms", "score": 92.5, "weight": 3.5}, headers=auth_headers)
    assert client.get("/grades/", headers=auth_headers).json()[0]["score"] == 92.5

    client.post("/events/", json={"title": "Exam", "start_time": "2026-02-01T09:00", "end_time": "2026-02-01T12:00"}, headers=auth_headers)
    assert client.get("/events/", headers=auth_headers).json()[0]["title"] == "Exam"


def test_stats_aggregate_only_my_data(client, auth_headers):
    client.post("/tasks/", json={"title": "open"}, headers=auth_headers)
    client.post("/tasks/", json={"title": "done", "is_completed": True}, headers=auth_headers)
    client.post("/notes/", json={"title": "n1"}, headers=auth_headers)
    client.post("/study-sessions/", json={"subject": "OS", "duration_minutes": 90}, headers=auth_headers)
    client.post("/study-sessions/", json={"subject": "DB", "duration_minutes": 45}, headers=auth_headers)

    other = register_and_login(client, "mallory@example.com")
    client.post("/study-sessions/", json={"subject": "Noise", "duration_minutes": 600}, headers=other)

    stats = client.get("/stats/", headers=auth_headers).json()
    assert stats["pending_tasks"] == 1
    assert stats["notes_created"] == 1
    assert stats["study_hours"] == 2.2  # 135 minutes


def test_users_cannot_see_or_modify_each_others_data(client, auth_headers):
    """Every resource is scoped to its owner - the core authorization guarantee of the API."""
    task = client.post("/tasks/", json={"title": "private task"}, headers=auth_headers).json()
    note = client.post("/notes/", json={"title": "private note"}, headers=auth_headers).json()
    resource = client.post("/resources/", json={"title": "private link"}, headers=auth_headers).json()
    session = client.post("/study-sessions/", json={"subject": "OS", "duration_minutes": 30}, headers=auth_headers).json()

    mallory = register_and_login(client, "mallory@example.com")

    for path in ("/tasks/", "/notes/", "/resources/", "/study-sessions/", "/projects/", "/grades/", "/events/"):
        assert client.get(path, headers=mallory).json() == [], path

    assert client.put(f"/tasks/{task['id']}", json={"title": "pwned"}, headers=mallory).status_code == 404
    assert client.delete(f"/tasks/{task['id']}", headers=mallory).status_code == 404
    assert client.put(f"/notes/{note['id']}", json={"title": "pwned"}, headers=mallory).status_code == 404
    assert client.delete(f"/notes/{note['id']}", headers=mallory).status_code == 404
    assert client.delete(f"/resources/{resource['id']}", headers=mallory).status_code == 404
    assert client.put(f"/study-sessions/{session['id']}", json={"subject": "x", "duration_minutes": 1}, headers=mallory).status_code == 404
    assert client.delete(f"/study-sessions/{session['id']}", headers=mallory).status_code == 404

    # ...and the owner's data is untouched
    assert client.get("/tasks/", headers=auth_headers).json()[0]["title"] == "private task"
