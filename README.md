# 🧠 SmartBrain - Your Second Brain for Academic Success

![SmartBrain Banner](https://images.unsplash.com/photo-1456324504439-367cee10d6b1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)

> **SmartBrain** is a comprehensive student management system designed to organize your academic life. From tracking assignments and grades to managing your study schedule and resources, SmartBrain acts as your digital "Second Brain," helping you stay focused and achieve your goals.

---

## ✨ Key Features

SmartBrain offers a suite of tools tailored for students:

*   **📊 Dashboard**: Get a bird's-eye view of your academic status with real-time statistics, upcoming deadlines, and active tasks.
*   **✅ Task Management**: Create, prioritize, and track tasks. Never miss an assignment again.
*   **📅 Study Schedule**: visual calendar to manage your classes, exams, and study sessions.
*   **🎓 Grade Tracking**: Keep a record of your grades for every course and monitor your GPA.
*   **📚 Resource Hub**: Centralize all your study materials, links, and documents in one place.
*   **📝 Quick Notes**: Capture ideas and lecture notes instantly.

---

## 🛠️ Built With

This project leverages a modern, high-performance tech stack:

### Frontend
*   ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) **React 19** - The library for web and native user interfaces.
*   ![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white) **TailwindCSS 4** - A utility-first CSS framework for rapid UI development.
*   ![Vite](https://img.shields.io/badge/Vite-B73C92?style=for-the-badge&logo=vite&logoColor=white) **Vite** - Next Generation Frontend Tooling.
*   **Lucide React** - Beautiful & consistent icons.

### Backend
*   ![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi) **FastAPI** - High performance, easy to learn, fast to code, ready for production.
*   ![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white) **Python 3.10+** - The programming language that lets you work quickly.
*   ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white) **PostgreSQL** - The World's Most Advanced Open Source Relational Database.
*   **SQLAlchemy** - The Python SQL Toolkit and Object Relational Mapper.
*   **Pydantic** - Data validation using Python type hints.

### DevOps
*   ![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white) **Docker** - Containerize your applications.
*   **Docker Compose** - Define and run multi-container Docker applications.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

*   **Git**: [Download Git](https://git-scm.com/downloads)
*   **Docker Desktop** (Recommended): [Download Docker](https://www.docker.com/products/docker-desktop/)
*   *OR* for manual setup:
    *   **Node.js** (v18+): [Download Node.js](https://nodejs.org/)
    *   **Python** (v3.10+): [Download Python](https://www.python.org/downloads/)
    *   **PostgreSQL**: [Download PostgreSQL](https://www.postgresql.org/download/)

### Installation

#### Option 1: Using Docker (Recommended 🐳)

The easiest way to run SmartBrain is with Docker.

1.  **Clone the repository**
    ```bash
    git clone https://github.com/roei10101/smartbrain.git
    cd smartbrain
    ```

2.  **Run with Docker Compose**
    ```bash
    docker-compose up --build
    ```

    That's it!
    *   Frontend: `http://localhost:5173` (or the port specified in your docker setup)
    *   Backend API: `http://localhost:5000`
    *   API Docs: `http://localhost:5000/docs`

#### Option 2: Manual Setup 🛠️

If you prefer to run it without Docker:

**1. Backend Setup**

```bash
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure Database
# Ensure you have a PostgreSQL database running and update .env or database.py with your credentials.
# Default: postgresql://postgres:postgresdemo@localhost:5432/smartbrain

# Run the server
uvicorn main:app --reload --port 5000
```

**2. Frontend Setup**

```bash
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

Open your browser and navigate to the URL shown in the terminal (usually `http://localhost:5173`).

---

## 📂 Project Structure

```
SmartBrain/
├── backend/                # FastAPI application
│   ├── main.py             # App entry point
│   ├── models.py           # Database models
│   ├── schemas.py          # Pydantic schemas
│   ├── crud.py             # Database operations
│   ├── auth.py             # Authentication logic
│   └── ...
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── services/       # API calls
│   │   └── ...
├── docker-compose.yml      # Docker orchestration
└── README.md               # You are here!
```

---

## 🤝 Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📞 Demo

User: test@test.com

Password: test

Project Link: https://smartbrain.roeiduenyas.me/

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

