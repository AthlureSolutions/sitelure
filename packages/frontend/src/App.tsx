// packages/frontend/src/App.tsx
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Lazy load pages
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const CreateWebsite = lazy(() => import('./pages/CreateWebsite'));
const Settings = lazy(() => import('./pages/Settings'));

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Navbar />
        <main className="pt-20 px-4 min-h-screen">
          <Suspense fallback={<div className="text-center mt-20">Loading...</div>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/create-website"
                element={
                  <ProtectedRoute>
                    <CreateWebsite />
                  </ProtectedRoute>
                }
              />
              {/* Redirect unknown routes to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;
