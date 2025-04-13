# Salesforce Auth App

A full-stack web application that provides user authentication and integrates with Salesforce to display account data.

Built with **Vue.js (frontend)**, **Node.js/Express (backend)**, **PostgreSQL (database)**, **JWT authentication**, and the **jsforce library** for Salesforce integration, this app meets the assignment requirements for a secure, scalable, and production-ready solution.

---

## 🌐 Live Demo

- **Frontend:** [https://salesforce-auth-app.onrender.com](https://salesforce-auth-app.onrender.com)  
- **Backend API:** [https://salesforce-auth-api.onrender.com](https://salesforce-auth-api.onrender.com)  


---

## 📚 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Setup Instructions](#setup-instructions)
- [Usage](#usage)
- [Deployment Instructions](#deployment-instructions)

---

## ✅ Features

### 🔐 Authentication

- User registration and login with email and password.
- Secure password hashing using bcrypt.
- JWT-based session persistence with secure cookies.
- Protected routes ensure only authenticated users access the dashboard.

### 📊 Dashboard & Salesforce Integration

- Displays Salesforce accounts in a tabular format after login.
- Uses OAuth 2.0 via jsforce for secure Salesforce API access.

### 🚀 Deployment

- Deployed on Render with public accessibility.
- Includes environment variable management for sensitive data.

---

## 🛠 Tech Stack

| Layer       | Technology                 |
|-------------|----------------------------|
| **Frontend**| Vue.js 3 + TypeScript      |
| **Backend** | Node.js + Express + TypeScript |
| **Database**| PostgreSQL                 |
| **Auth**    | JWT, bcrypt                |
| **Salesforce** | jsforce                |
| **Others**  | Axios, Winston, CORS       |

---

## 🧱 Architecture

### 🎨 Frontend (Vue.js)

- Handles user interface: Login, Register, Dashboard.
- Uses Axios to make secure API requests.
- Environment variables configured via `.env`.

### 🖥️ Backend (Express + TypeScript)

- Express server written in TypeScript.
- Compiled to `dist/` for production.
- **Routes:**
  - `/api/auth` – login, register, verify
  - `/api/salesforce` – account data
- **Middleware:**
  - JWT authentication
  - CORS
  - Central error handler
- **Database:**
  - PostgreSQL managed via `pg`
  - Stores registered users
- **Salesforce:**
  - jsforce used to access Salesforce APIs securely

### 🔐 Security

- `.env` used for secrets (DB, JWT, Salesforce credentials)
- JWT-based auth
- CORS configured for allowed frontend origin

---

## ⚙️ Setup Instructions

### 📋 Prerequisites

- Node.js (v16.x or v18.x)
- npm (v8+)
- PostgreSQL (local instance)
- Git
- Salesforce Developer Account

---

### 📦 Clone the Repository

```bash
git clone https://github.com/rasaputra1009/salesforce_auth_app
cd salesforce_auth_app

## 🧰 Installation and Local Setup

```bash
# Clone the repository
git clone https://github.com/rasaputra1009/salesforce_auth_app
cd salesforce_auth_app
```

### Install frontend dependencies
```
cd frontend
npm install
```
### Install backend dependencies
```
cd ../backend
npm install
```

### ⚙️ Configure Environment Variables
Create .env files in both the frontend and backend directories.

frontend/.env
```
VUE_APP_API_URL=http://localhost:5000
VUE_APP_BASE_URL=/
backend/.env
```

```
NODE_ENV=development
DB_USER=your_local_user
DB_PASSWORD=your_local_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_local_db
JWT_SECRET=your-secret-key
SALESFORCE_CLIENT_ID=your-client-id
SALESFORCE_CLIENT_SECRET=your-client-secret
SALESFORCE_USERNAME=your-username
SALESFORCE_PASSWORD=your-password+security-token
SALESFORCE_INSTANCE_URL=https://your-instance.salesforce.com
FRONTEND_URL=http://localhost:8080
PORT=5000
```

### Generate a secure JWT secret:

```bash
openssl rand -base64 32
```
``

### 💻 Usage
- Register: Navigate to /register, fill in email and password
- Login: Go to /login, use registered credentials
- Dashboard: After login, view Salesforce accounts
- Logout: Handled via frontend logic (clears JWT)

### 🌐 Deployment on Render
🧩 Prerequisites
- A Render account (Free tier works)
- GitHub repository linked to Render
🔧 Deploy Backend (Web Service)
1. Create PostgreSQL Instance
- Render → + New → PostgreSQL
- Name: salesforce-auth-db
- Plan: Free
- Copy the Internal Database URL
2. Create Web Service
- Render → + New → Web Service
- Repository: https://github.com/rasaputra1009/salesforce_auth_app
- Name: salesforce-auth-api
- Root Directory: backend
- Branch: master
- Instance Type: Free
Build Command:

```bash
npm install && npm run build
```
Start Command:
```bash
npm start
```

3. Set Environment Variables

```ini
NODE_ENV=production
DATABASE_URL=<internal-db-url>
JWT_SECRET=<your-secret-key>
SALESFORCE_CLIENT_ID=<your-client-id>
SALESFORCE_CLIENT_SECRET=<your-client-secret>
SALESFORCE_USERNAME=<your-username>
SALESFORCE_PASSWORD=<your-password+security-token>
SALESFORCE_INSTANCE_URL=https://your-instance.salesforce.com
FRONTEND_URL=https://salesforce-auth-app.onrender.com
```

### 🖥️ Deploy Frontend (Static Site)
1. Create Static Site
- Render → + New → Static Site
- Name: salesforce-auth-app
- Root Directory: frontend
- Branch: master
- Instance Type: Free
- Build Command:

```bash
npm run build
```
- Publish Directory: dist
2. Set Environment Variable

```ini
VUE_APP_API_URL=https://salesforce-auth-api.onrender.com
```

### Post-Deployment Checklist
Test endpoints:
- https://salesforce-auth-api.onrender.com/api/auth/register
- https://salesforce-auth-api.onrender.com/api/auth/login
- https://salesforce-auth-api.onrender.com/api/salesforce/accounts
