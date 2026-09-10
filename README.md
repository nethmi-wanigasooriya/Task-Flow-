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

