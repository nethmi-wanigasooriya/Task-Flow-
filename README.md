# TaskFlow - Task Management Application

TaskFlow is a full-stack, Trello-like task management web application designed to streamline project workflows with interactive Kanban drag-and-drop boards, secure authentication, and robust Role-Based Access Control (RBAC).

---

## Technology Stack

- **Frontend:** Next.js (App Router), TypeScript, Tailwind CSS
- **Backend:** Express.js, Node.js, TypeScript
- **Database:** MySQL (via XAMPP / phpMyAdmin)
- **Database Tools:** MySQL
- **Authentication:** JWT (JSON Web Tokens), bcryptjs (Password Hashing)
- **Deployment:** Railway (Backend API)

---

## Core Features

- **Authentication & Security:**
  - Secure Registration and Login workflows with JWT.
  - Role-Based Access Control (RBAC) separating **Normal Users** and **Administrators**.
  - Password hashing using `bcryptjs`.

- **Task Management & Drag-and-Drop Board:**
  - Interactive Kanban board featuring **To Do**, **Doing**, and **Done** status columns.
  - Drag-and-drop functionality for moving tasks between statuses.
  - Real-time persistence in MySQL ensuring data consistency after page refreshes.

- **User Roles & Privileges:**
  - **Normal Users:** Can register, create tasks, manage their own tasks, and self-assign unassigned tasks.
  - **Administrators:** Created via seed scripts with elevated permissions to view all users and tasks, and manage or reassign tasks across the entire platform.

---

##  Local Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- XAMPP Server (MySQL)

### 1. Database Setup
1. Start Apache and MySQL from XAMPP Control Panel.
2. Access phpMyAdmin at `http://localhost/phpmyadmin`.
3. Create a new database (e.g., `taskflow_db`).

### 2. Backend Setup
```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create a .env file in the backend directory and add:
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=taskflow_db
JWT_SECRET=your_jwt_secret_key

# Seed database with initial Admin user
npm run seed

# Start development server
npm run dev
