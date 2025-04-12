# Salesforce Authentication App

A full-stack web application with authentication and Salesforce integration.

## Setup
1. Clone the repository: `git clone https://github.com/your-username/salesforce-auth-app.git`
2. Install dependencies:
   - Backend: `cd backend && npm install`
   - Frontend: `cd frontend && npm install`
3. Set up `.env` files with required variables (e.g., `JWT_SECRET`, database credentials).
4. Start the app:
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm run serve`

## Usage
- Register at `/register`, log in at `/login`, and access the dashboard at `/dashboard`.

## Deployment
1. Deploy to Heroku:
   - `heroku create salesforce-auth-app`
   - `git push heroku main`
   - Add Heroku Postgres: `heroku addons:create heroku-postgresql:hobby-dev`
2. Live URL: [TBD after deployment]

## Architecture
- Monorepo with Vue.js frontend and Node.js/Express backend.
- JWT stored in localStorage for authentication.

## Challenges
- Debugging TypeScript type errors.
- Configuring PostgreSQL for deployment.