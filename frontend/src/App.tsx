import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, PublicRoute } from './components/AuthRoutes';

import Login from './pages/Login';
import Register from './pages/Register';
import DashboardLayout from './layouts/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
             <Route path="/dashboard" element={<DashboardLayout />}>
               <Route index element={<Dashboard />} />
               <Route path="tasks" element={<Tasks />} />
             </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      
      <ToastContainer position="bottom-right" theme="dark" />
    </AuthProvider>
  );
}

export default App;
