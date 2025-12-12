📌 Project Manager Web Application

A full-stack project management system built using React, TailwindCSS, Express.js, MySQL, and JWT authentication.
Developed as part of the Aston University Internet Applications & Database Design module.

🚀 Features

User registration & login (JWT-based)

Secure password hashing (bcrypt)

Create, view, update, and delete projects

List all projects & search by filters

View individual project details

Ownership enforcement — only the creator can modify projects

Responsive UI, clean design, reusable components

SQL schema + sample data included

🗂️ Project Structure
project-manager/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── config/
│   │   └── app.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── db/
│   └── aproject.sql     # Database schema + seed data
│
└── README.md

🛠️ Technologies Used
Frontend

React.js

Vite

TailwindCSS

Axios

React Router

Backend

Node.js + Express.js

MySQL (via mysql2 Pool)

JWT Authentication

Bcrypt password hashing

Express Validator

Rate Limiting Middleware

🗄️ Database Setup

Create database in phpMyAdmin or MySQL Workbench:

CREATE DATABASE project_manager;


Import the provided SQL file:

db/aproject.sql


This file includes:

Table structure

Indexes

Foreign key constraints

Sample user + project data

🔐 Environment Variables

Create a .env file inside /backend:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=project_manager

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1d
PORT=5001


(Use .env.example as reference.)

▶️ Running the Project Locally
Backend
cd backend
npm install
npm run dev

Frontend
cd frontend
npm install
npm run dev

🧪 Test User Credentials
username: testuser
password: test1234


(Or use any account you create through registration.)

🔒 Implemented Security Features

Hashed passwords (bcrypt with salt rounds = 10)

JWT tokens with expiry (1d)

Authorization middleware to protect routes

User ownership enforcement for editing/deleting projects

Express Rate Limiter on /login and /register

Prepared statements everywhere (prevents SQL injection)
