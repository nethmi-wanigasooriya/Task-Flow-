
# TaskFlow - Task Management Application

TaskFlow is a full-stack, Trello-like task management web application designed to streamline project workflows with interactive Kanban drag-and-drop boards, secure authentication, and robust Role-Based Access Control (RBAC).

---

## Technology Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend:** Express.js, Node.js, TypeScript[cite: 1]
- **Database:** MySQL (Managed via XAMPP / phpMyAdmin)[cite: 1]
- **Database Tools:** Sequelize / MySQL2[cite: 1]
- **Authentication:** JWT (JSON Web Tokens), bcryptjs (Password Hashing)[cite: 1]
- **Deployment:** Render (Backend API)[cite: 1]

---

## Core Features

- **Authentication & Security:**
  - Secure Registration and Login workflows with JWT[cite: 1].
  - Role-Based Access Control (RBAC) separating **Normal Users** and **Administrators**[cite: 1].
  - Password hashing using `bcryptjs` for proper security[cite: 1].

- **Task Management & Drag-and-Drop Board:**
  - Interactive Kanban board featuring **To Do**, **Doing**, and **Done** status columns[cite: 1].
  - Smooth drag-and-drop functionality for moving task cards between statuses[cite: 1].
  - Persistent status updates stored directly in MySQL ensuring data consistency after page refreshes[cite: 1].

- **User Roles & Privileges:**
  - **Normal Users:** Can register, create tasks, manage their own tasks, and self-assign eligible unassigned tasks[cite: 1].
  - **Administrators:** Created via seed scripts with elevated permissions to view all users and tasks, and manage or reassign tasks across the entire platform[cite: 1].

---

Local Setup Instructions
Prerequisites
Node.js (v18 or higher)

XAMPP (Apache & MySQL Server)

1. Database Setup (phpMyAdmin)
Launch XAMPP Control Panel and start Apache and MySQL.

Open your browser and navigate to http://localhost/phpmyadmin.

Create a new database named taskflow_db.

---

## Backend Setup

# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file in the backend root directory
# Example .env configuration:
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=taskflow_db
JWT_SECRET=your_jwt_secret_key

# Seed database with initial Admin user
npm run seed

# Start the development server
npm run dev

## Frontend Setup

# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install

# Create a .env.local file in the frontend root directory
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# Start the Next.js development server
npm run dev

---

## Environment Variables
Backend (/backend/.env)

Variable,Description
PORT,Server port (Default: 5000)
DB_HOST,MySQL database host (localhost)
DB_USER,MySQL database user (root)
DB_PASSWORD,MySQL database password
DB_NAME,Database name (taskflow_db)
JWT_SECRET,Secret key used for JWT signing

Frontend (/frontend/.env.local)

Variable,Description
NEXT_PUBLIC_API_BASE_URL,Base URL pointing to the deployed/local REST API

---

## Deployment Information

Backend API: Deployed on Railway
Frontend App: Local Development Environment / Deployed Host

---

## Project Structure

```text
Task-Flow/
├── backend/                # Express.js REST API Server
│   ├── src/
│   │   ├── controllers/   # Request handlers
│   │   ├── middleware/    # Auth & RBAC middlewares
│   │   ├── models/        # MySQL models/schemas
│   │   ├── routes/        # API endpoints
│   │   └── seeders/       # Admin seeding scripts
│   ├── .env
│   └── package.json
│
└── frontend/               # Next.js Web Client
    ├── app/               # App Router pages and layouts
    ├── components/        # UI components & Kanban Board
    ├── public/            # Static assets
    ├── .env.local
    └── package.json

----

<img width="1920" height="1080" alt="Register page" src="https://github.com/user-attachments/assets/fb1e2d12-0c43-4a34-8dd9-f8702303c77c" />
<img width="1920" height="1080" alt="Postman testing - POST" src="https://github.com/user-attachments/assets/5f4f0320-c5a9-4398-a9a0-0cdc35cf891e" />
<img width="1920" height="1080" alt="Postman Testing - GET" src="https://github.com/user-attachments/assets/11480ec4-6561-4cea-9ced-897718e6dd70" />
<img width="1920" height="1080" alt="Log In page" src="https://github.com/user-attachments/assets/bb11601c-6e55-4651-9214-b8e1f48e0d2c" />
<img width="1920" height="1080" alt="Light mode interface" src="https://github.com/user-attachments/assets/dd4a57aa-6b9f-4a6d-bf61-17edb8a2c2f2" />
<img width="1920" height="1080" alt="Drag" src="https://github.com/user-attachments/assets/d16520c8-a64c-459d-933c-07737f998ebc" />
<img width="1920" height="1080" alt="Create task" src="https://github.com/user-attachments/assets/6a2d0bc6-959a-4199-b18a-093151bc901f" />
<img width="1920" height="1080" alt="Aiven dashboard" src="https://github.com/user-attachments/assets/fae31f8e-9c93-4568-9b36-057414ff333e" />
<img width="1920" height="1080" alt="Admin dashboard" src="https://github.com/user-attachments/assets/305dd46d-8844-4639-a34f-da7c28fb6704" />
<img width="1920" height="1080" alt="Admin dashboard - Dark mode" src="https://github.com/user-attachments/assets/29640bc4-47b5-4944-a6b6-3b89cbea6192" />
<img width="1920" height="1080" alt="Admin dashboar with task" src="https://github.com/user-attachments/assets/f3604cc6-c90f-4a0c-838a-39c8112c9547" />
<img width="1920" height="1080" alt="Admin dashboar - User Control" src="https://github.com/user-attachments/assets/563da491-e124-421c-9114-ae39e45f69e6" />
<img width="1920" height="1080" alt="admin dahboard - task filter" src="https://github.com/user-attachments/assets/e2a01ec9-fa0d-4310-9615-95bd5290680c" />
<img width="1920" height="1080" alt="add task" src="https://github.com/user-attachments/assets/1e1d18fd-d68a-4a3e-9dc7-fab4eb6115a0" />
<img width="1920" height="1080" alt="add task 2" src="https://github.com/user-attachments/assets/3e3b247b-de52-41d1-8cf9-a85c40d37e25" />
<img width="1920" height="1080" alt="User Intercae" src="https://github.com/user-attachments/assets/914ff4f9-e276-4b6c-9c80-34047dff8d2f" />
<img width="1920" height="1080" alt="task delete" src="https://github.com/user-attachments/assets/561c6976-faa2-4ff6-bce4-23715599e1c5" />
<img width="1920" height="1080" alt="Serch" src="https://github.com/user-attachments/assets/befda27a-82f1-4696-9187-374b7a521b3c" />
