import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  console.log('🛡️ ProtectedRoute check:');
  console.log('   - isAuthenticated:', isAuthenticated);
  console.log('   - loading:', loading);
  console.log('   - current path:', location.pathname);

  if (loading) {
    console.log('⏳ ProtectedRoute: Still loading...');
    return (
      <div className="loading-container">
        <div className="loading">Memuat...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.log('🚫 ProtectedRoute: Not authenticated, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log('✅ ProtectedRoute: Access granted');
  return children;
};

export default ProtectedRoute;