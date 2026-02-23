# Prime Trade AI 🚀

Welcome to the **Prime Trade AI** repository! This is a complete, production-ready Full Stack web application featuring a highly secure Node.js/Express API backend and a stunning futuristic React (Vite) frontend.

## 🌟 Key Features

### Frontend (React + Vite + Tailwind CSS)
- **Futuristic UI/UX:** Dark dashboard theme, glassmorphism, neon accents (Prime OS aesthetic).
- **Smooth Animations:** Integrated `framer-motion` for page transitions, modals, and micro-interactions.
- **Robust State & API Management:** Context API for global auth state and a configured Axios client with JWT interceptors.
- **Responsive Layout:** Beautiful experience across mobile, tablet, and desktop viewports.
- **Role-Based Views:** UI elements and actions adapt whether the logged-in user is an `ADMIN` or standard `USER`.

### Backend (Node.js + Express + SQLite + Prisma)
- **Secure Authentication:** JWT-based stateless authentication with strict HTTP-Only refresh cookies to prevent XSS.
- **Role-Based Access Control (RBAC):** Middleware protecting endpoints ensuring only authorized personnel can access or modify critical data.
- **SQL Database (SQLite):** Configured out-of-the-box with Prisma ORM for immediate local development without complex Docker requirements.
- **Data Validation & Error Handling:** `Joi` schema validation prevents bad data from hitting the database. Centralized error handling returns consistent API responses.
- **Security Headers:** `Helmet`, `Cors` (strict origin checking), and `Express-Rate-Limit` block common web vulnerabilities and brute-force attacks.

---

## 📂 Project Structure

The codebase is logically separated into two independent folders to ensure scalability and decoupling:

```text
Prime Trade AI/
├── backend/                  # Node.js REST API
│   ├── prisma/               # Database Schema & Migrations
│   ├── src/                  # API Source Code (Controllers, Services, Routes)
│   ├── test/                 # Jest/Supertest Test Suites
│   ├── .env                  # Environment Variables
│   └── package.json
└── frontend/                 # React Vite Dashboard
    ├── src/
    │   ├── components/       # Reusable UI Elements
    │   ├── context/          # React Context (Auth)
    │   ├── layouts/          # Page Wrappers (Sidebar, Topbar)
    │   ├── pages/            # Core Views (Login, Dashboard)
    │   └── services/         # Axios API Client
    ├── tailwind.config.js    # Design System Tokens
    └── package.json
```

---

## ⚙️ Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Git](https://git-scm.com/)

### 1. Backend Setup
Navigate to the backend directory, install packages, and start the API:

```bash
cd backend
npm install
npm run dev
```
*Note: The backend automatically connects to a local SQLite database (`dev.db`). The server will spawn on `http://localhost:4000`.*

### 2. Frontend Setup
Open a **new** terminal, navigate to the frontend directory, install packages, and start the app:

```bash
cd frontend
npm install
npm run dev
```
*The Vite frontend will spawn on `http://localhost:5173`. Open this URL in your browser!*

### 3. Testing the Application
- Open the frontend in your browser.
- Register a new account.
- Note the beautiful glassmorphism dashboard, dynamic greeting, and animated sidebar.
- Create tasks, mark them as done, and verify they persist.

---

## 🔑 Default Users (Seeded)

If you have executed `npx prisma db seed` (automatically done upon migrating), you can use the following default Admin account:
- **Email:** `admin@example.com`
- **Password:** `Admin@123`

---

## 📖 API Documentation

The backend dynamically serves **Swagger UI** documentation.
While the backend is running, navigate to:
👉 **[http://localhost:4000/docs/](http://localhost:4000/docs/)** to view standard OpenAPI endpoint definitions and test routes directly from your browser. 

*A Postman Collection JSON has also been provided in the root directory for team sharing.*

---

## 🚀 Deployment & Production

### Frontend
Build the heavily optimized static assets:
```bash
cd frontend
npm run build
```
Upload the `/frontend/dist` directory to Vercel, Netlify, or AWS S3.

### Backend
Build the JS bundle and run it in a production server (PM2, Docker, Render, Heroku):
```bash
cd backend
npm run build
NODE_ENV=production node dist/server.js
```

---

