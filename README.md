# Team Task Manager

A full-stack MERN application for managing team projects and tasks with role-based access control.

## Features

- **Authentication (JWT)**: Secure user registration and login.
- **Role-Based Access**:
  - `Admin`: Can create projects, add users to projects, create tasks, and assign tasks to users.
  - `Member`: Can view assigned tasks, update task status (Todo, In Progress, Completed), and view dashboard stats.
- **Project Management**: Group tasks under specific projects.
- **Task Management**: Kanban-style view of tasks.
- **Dashboard**: Overview of total tasks, completed tasks, and overdue tasks.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Axios, React Router
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT)

## Getting Started Locally

### 1. Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri_here
JWT_SECRET=yoursupersecretjwtkey
```

### 2. Install Dependencies

In the root directory, run:

```bash
npm install --prefix backend
npm install --prefix frontend
```

### 3. Run Development Servers

Open two terminals:

**Terminal 1 (Backend):**
```bash
cd backend
node server.js
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

The frontend will run at `http://localhost:5173`.

## Deployment to Railway

This project is configured to be deployed as a single unified service on Railway.

1. Create a new project on Railway from your GitHub repository.
2. In Railway, add the following Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas connection string.
   - `JWT_SECRET`: A secure random string for JWT signing.
   - `NODE_ENV`: Set this to `production`.
3. Railway will automatically detect the root `package.json` and run the `build` script (which installs dependencies and builds the React app) followed by the `start` script (which runs the Express server that serves both the API and the React build).

## Usage Guide

1. **Register** as a user and select the role "Admin".
2. **Create a Project** in the Projects tab.
3. **Add Members** (if any) to the project.
4. **Create a Task** in the Tasks tab, assigning it to a member and setting a due date.
5. Log in as the assigned member to see the task on their dashboard and update its status.
