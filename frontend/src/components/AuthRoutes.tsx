import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex bg-prime-dark items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-prime-accent border-t-transparent rounded-full animate-spin shadow-[0_0_15px_#00F0FF]"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex bg-prime-dark items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-prime-accent border-t-transparent rounded-full animate-spin shadow-[0_0_15px_#00F0FF]"></div>
      </div>
    );
  }

  return !isAuthenticated ? <Outlet /> : <Navigate to="/dashboard" replace />;
};
