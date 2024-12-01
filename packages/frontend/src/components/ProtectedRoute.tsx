// packages/frontend/src/components/ProtectedRoute.tsx
import React, { useEffect, useState, useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Check if we have a token in localStorage
    const token = localStorage.getItem('token');
    if (!token && !user) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#1E1E1E]">
      <div className="text-white">Loading...</div>
    </div>;
  }

  if (!user) {
    // Save the attempted location
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
