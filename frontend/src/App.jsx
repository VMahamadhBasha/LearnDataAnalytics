import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseViewer from './pages/CourseViewer';
import LessonViewer from './pages/LessonViewer';
import Profile from './pages/Profile';
import Certificates from './pages/Certificates';
import HelpCenter from './pages/HelpCenter';
import AdminDashboard from './pages/admin/AdminDashboard';
import CourseMgmt from './pages/admin/CourseMgmt';
import UserMgmt from './pages/admin/UserMgmt';
import AdminCertificates from './pages/admin/AdminCertificates';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    // Support navigation via custom events or overriding history.pushState if needed
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Simple SPA Route Switcher
  const renderRoute = () => {
    // 1. Static Public Routes
    if (path === '/' || path === '/home') {
      return <Home />;
    }
    if (path === '/login') {
      return <Login />;
    }
    if (path === '/register') {
      return <Register />;
    }
    if (path === '/help') {
      return <HelpCenter />;
    }

    // 2. Student Private Routes
    if (path === '/dashboard') {
      return (
        <PrivateRoute>
          <Dashboard />
        </PrivateRoute>
      );
    }
    if (path === '/courses') {
      return (
        <PrivateRoute>
          <Courses />
        </PrivateRoute>
      );
    }
    if (path === '/certificates') {
      return (
        <PrivateRoute>
          <Certificates />
        </PrivateRoute>
      );
    }
    if (path === '/profile') {
      return (
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      );
    }

    // 3. Dynamic Private Routes
    // Matches /courses/lessons/:id
    if (path.startsWith('/courses/lessons/')) {
      return (
        <PrivateRoute>
          <LessonViewer />
        </PrivateRoute>
      );
    }
    // Matches /courses/:id
    if (path.startsWith('/courses/')) {
      return (
        <PrivateRoute>
          <CourseViewer />
        </PrivateRoute>
      );
    }

    // 4. Admin Private Routes
    if (path === '/admin/dashboard') {
      return (
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      );
    }
    if (path === '/admin/courses') {
      return (
        <AdminRoute>
          <CourseMgmt />
        </AdminRoute>
      );
    }
    if (path === '/admin/users') {
      return (
        <AdminRoute>
          <UserMgmt />
        </AdminRoute>
      );
    }
    if (path === '/admin/certificates') {
      return (
        <AdminRoute>
          <AdminCertificates />
        </AdminRoute>
      );
    }

    // 5. Fallback Default Path redirecting to Home/Dashboard
    return <Home />;
  };

  return (
    <AuthProvider>
      {renderRoute()}
    </AuthProvider>
  );
}

export default App;
