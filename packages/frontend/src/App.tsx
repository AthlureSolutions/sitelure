// packages/frontend/src/App.tsx
import React, { Suspense, lazy, useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RedirectIfAuthenticated from './components/RedirectIfAuthenticated';
import AuthenticatedLayout from './components/AuthenticatedLayout';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, AuthContext } from './context/AuthContext';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CreateWebsite = lazy(() => import('./pages/CreateWebsite'));
const Settings = lazy(() => import('./pages/Settings'));

const AppContent: React.FC = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {!user && <Navbar />}
      <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
        <Routes>
          <Route 
            path="/" 
            element={
              <RedirectIfAuthenticated>
                <div className="pt-16">
                  <Home />
                </div>
              </RedirectIfAuthenticated>
            } 
          />
          <Route 
            path="/login" 
            element={
              <RedirectIfAuthenticated>
                <div className="pt-16">
                  <Login />
                </div>
              </RedirectIfAuthenticated>
            } 
          />
          <Route 
            path="/register" 
            element={
              <RedirectIfAuthenticated>
                <div className="pt-16">
                  <Register />
                </div>
              </RedirectIfAuthenticated>
            } 
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Dashboard />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <Settings />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-website"
            element={
              <ProtectedRoute>
                <AuthenticatedLayout>
                  <CreateWebsite />
                </AuthenticatedLayout>
              </ProtectedRoute>
            }
          />
          {/* Redirect unknown routes to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
