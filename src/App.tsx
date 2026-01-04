/**
 * App Component
 * Main application component with routing configuration
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AdminLayout from './components/Admin/AdminLayout';

// Import public pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Import admin pages
import { AdminHome, Employees, Suppliers, Buyers, CocoHusk, Profile } from './pages/admin';

function App() {
  return (
    // Wrap entire app with AuthProvider for authentication state
    <AuthProvider>
      <Router>
        {/* Main layout container */}
        <div className="min-h-screen bg-slate-900">
          {/* Navigation bar - always visible */}
          <Navbar />
          
          {/* Route definitions */}
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected admin routes with nested layout */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              {/* Admin sub-routes - rendered inside AdminLayout's <Outlet /> */}
              <Route index element={<AdminHome />} />
              <Route path="employees" element={<Employees />} />
              <Route path="suppliers" element={<Suppliers />} />
              <Route path="buyers" element={<Buyers />} />
              <Route path="coco-husk" element={<CocoHusk />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            
            {/* 404 - Redirect unknown routes to home */}
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
