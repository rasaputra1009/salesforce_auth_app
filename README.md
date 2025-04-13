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

## Components

### Frontend:
- Built with Vue.js 3 and TypeScript, providing a responsive UI with Login, Register, and Dashboard views.
- Utilizes Axios for HTTP requests, with environment variables managed via `.env` files.
- Implements JWT-based authentication and protected routes using Vue Router.

### Backend:
- Developed with Node.js, Express.js, and TypeScript, compiled to JavaScript for production.
- Exposes RESTful APIs for authentication (`/api/auth`) and Salesforce integration (`/api/salesforce`).
- Utilizes PostgreSQL for user data storage with bcrypt for password hashing and middleware for JWT authentication, CORS, and error handling.
- Integrates Salesforce using the jsforce library with OAuth 2.0 for secure API access.
- Implements logging using Winston for robust monitoring and error tracking.

### Database:
- PostgreSQL database on Render, with a users table managed by the backend.
- Connections are handled via a pooled client, and the database schema is initialized on startup.

### Deployment:
- Hosted on Render with the frontend as a Static Site and the backend as a Web Service.
- PostgreSQL is securely linked to the backend, with environment variables managing sensitive data.

## Approach

### Security:
- JWT tokens for session management, secure cookies, and CORS dynamically configured for frontend origin.
- Sensitive data managed via environment variables, preventing hardcoding.

### Scalability:
- Decoupled frontend and backend allow independent scaling, with Render's auto-scaling capabilities.

### Development:
- TypeScript ensures type safety, with Git for version control and a structured codebase for maintainability.

### Integration:
- jsforce simplifies Salesforce API calls, with OAuth 2.0 ensuring secure access. Logging with Winston provides robust monitoring and error handling.

### Deployment:
- CI/CD pipeline on Render for automated builds and environment variable management, ensuring consistency.

This architecture optimizes functionality, security, and scalability, providing a foundation for future enhancements.
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

### Challenges and Solutions:
- **Custom npm Registry Issue**: `ETIMEDOUT` errors on Render due to using `npm.devsnc.com` as the registry.  
  ✅ **Fix**: Forced the default registry `https://registry.npmjs.org/` via `.npmrc` and preinstall scripts.

- **TypeScript Build Failure**: Missing `dist/server.js` on Render because `tsc` wasn't executed.  
  ✅ **Fix**: Updated the build command to `npm install && npm run build`.

- **CORS Issues**: Network errors in the browser due to an unset or mismatched `FRONTEND_URL`.  
  ✅ **Fix**: Ensured `FRONTEND_URL` matches the production frontend URL and improved CORS logic with a dynamic origin function.

- **Database Connection Issue**: `getaddrinfo ENOTFOUND undefined` caused by a missing `DATABASE_URL`.  
  ✅ **Fix**: Validated and set `DATABASE_URL` in the Render Dashboard.

- **Salesforce Integration Issue**: OAuth setup errors due to incorrect environment variables and jsforce configuration.  
  ✅ **Fix**: Ensured correct environment variables and properly configured jsforce for Salesforce integration.

- **Challenges Faced**:  
  - New to Vue.js  
  - Integrating OAuth2.0  
  - Understanding jsforce Salesforce integration  
  - Deploying the app on Render production


