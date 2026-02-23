# Prime Trade AI - Frontend Dashboard

A Production-Grade modern SaaS Frontend UI integrating React.js (Vite), Tailwind CSS, Framer Motion, and Axios to securely communicate with a REST API utilizing JWT Authentication and Role-Based Access Control.

## Key Technical Features

### Modern Tech Stack & Architecture
- **React 18 & Vite**: Fast HMR and lightweight optimized production build.
- **Tailwind CSS**: Utility-first CSS configured with custom UI tokens for a "Futuristic Dark SaaS" look.
- **Framer Motion**: Smooth entry, exit, and transition animations applied across views and modals.
- **Axios Interceptors**: Global request interceptor to attach JWT `Bearer` token and response interceptor to handle `401 Unauthorized` token expiry securely.
- **Context API (AuthContext)**: Secure global identity state management.

### UI / UX Implementations
- **Glassmorphism Shell**: Custom `glass-panel` components leveraging `backdrop-blur` and nuanced borders.
- **Neon Glow Aesthetics**: Interactive buttons with hover shadows (`box-shadow`), gradients, and animated text tracking.
- **Task Management Matrix**: Grid layout demonstrating full CRUD operations against the Task modules.
- **Skeleton & Pulse Loaders**: Visual feedback during async operations API-side.
- **Toast Notifications**: Powered by `react-toastify` for success and failure feedback loops.
- **Data Filtering**: Client-side filtering and robust empty states (illustrations utilizing `lucide-react` icons).

---

## Setup Instructions

### 1. Prerequisites
- Node.js installed (v18+)
- Backend REST API running (usually on `http://localhost:3000`)

### 2. Environment Configuration
Create a `.env` file at the root of `frontend-prime-trade-ai` if the backend isn't on port 3000.
```env
VITE_API_URL=http://localhost:3000/api/v1
```

### 3. Install & Run
Run the following terminal commands inside the `frontend-prime-trade-ai` directory:
```bash
# Install NPM dependencies
npm install

# Start development server
npm run dev
```

### 4. Build for Production
To generate the optimized production static build:
```bash
npm run build
```
This generates the `dist/` folder ready for static hosting deployment (Vercel, Netlify, AWS S3 + CloudFront).

---

## Folder Architecture
```text
src/
├── components/          # Reusable UI components (AuthRoutes isolation)
├── context/             # React Context Providers (AuthContext.tsx)
├── layouts/             # App shell layouts (DashboardLayout with Sidebar/Topbar)
├── pages/               # Primary routable views (Login, Register, Dashboard, Tasks)
├── services/            # External API services (apiClient.tsx Axios instance)
├── utils/               # Helper utilities (cn tailwind merge)
├── App.tsx              # Root routing configurations (Protected vs Public)
├── index.css            # Global CSS, Custom Scrollbars, Glassmorphism layers
└── main.tsx             # React DOM Mounting
```

## Security Posture
- XSS prevention is naturally handled by React's DOM rendering methodology.
- Tokens are held securely in memory context & `localStorage` temporarily during session, with the refresh token handled automatically by the Backend via HTTP-Only Cookies for hardened CSRF-resistant security.
- React Router guards validate Context prior to exposing any views routing.
