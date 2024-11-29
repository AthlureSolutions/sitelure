// packages/frontend/src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { WebsiteProvider } from './context/WebsiteContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateWebsite from './pages/CreateWebsite';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <WebsiteProvider>
        <Router>
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
        </Router>
      </WebsiteProvider>
    </AuthProvider>
  );
};

// ProtectedRoute Component
const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { user } = React.useContext(AuthContext);
  return user ? children : <Navigate to="/login" replace />;
};

export default App;
