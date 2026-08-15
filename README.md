# Todo App

A full-stack task management application with user authentication, built with Express, MongoDB, and React.

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-8.x-47A248?logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?logo=vite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

## Overview

This project is a task management web application supporting full CRUD operations on tasks, with JWT-based user authentication so each user's task list is private to them.

## Features

- 🔐 User registration and login with hashed passwords (bcrypt) and JWT sessions
- ✅ Create, read, update, and delete tasks, scoped per authenticated user
- 📱 Responsive UI, usable on mobile and desktop
- ⚡ Optimistic UI updates for instant feedback on task actions

## Tech stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Frontend   | React, Vite                          |
| Backend    | Node.js, Express                     |
| Database   | MongoDB (Mongoose ODM)               |
| Auth       | JSON Web Tokens (JWT), bcrypt        |

## Project structure

```
Todo/
├── backend-fixed/        # Express REST API
│   ├── database/         # MongoDB connection
│   ├── middleware/       # JWT auth middleware
│   ├── models/           # Mongoose schemas (User, Todo)
│   └── server.js         # App entry point & routes
└── todo-frontend/        # React (Vite) client
    └── src/
        ├── AuthContext.jsx
        ├── AuthScreen.jsx
        ├── TodoScreen.jsx
        └── api.js
```

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- A MongoDB instance — either a local install or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster

### 1. Clone the repository

```bash
git clone https://github.com/PThanushree/Todo.git
cd Todo
```

### 2. Backend setup

```bash
cd backend-fixed
npm install
cp .env.example .env
```

Run the server:

```bash
npm run dev
```

Expected output: `Database connected successfully` followed by `Server is running on port 8000`.

### 3. Frontend setup

In a new terminal:

```bash
cd todo-frontend
npm install
cp .env.example .env
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`).

## API reference

All protected routes require an `Authorization: Bearer <token>` header, returned from login/register.

| Method | Endpoint            | Auth | Description          |
|--------|----------------------|:----:|-----------------------|
| POST   | `/auth/register`     | No   | Create an account     |
| POST   | `/auth/login`         | No   | Log in, returns a JWT |
| GET    | `/todos`              | Yes  | List your tasks       |
| POST   | `/create-todo`        | Yes  | Create a task         |
| GET    | `/:todoID`             | Yes  | Get a single task     |
| PATCH  | `/:todoId`             | Yes  | Update a task         |
| DELETE | `/delete/:todoId`      | Yes  | Delete a task         |

