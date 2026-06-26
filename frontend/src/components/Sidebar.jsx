import React from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  Bookmark, 
  Award, 
  UserCog, 
  HelpCircle,
  BarChart,
  Users,
  FolderOpen,
  GraduationCap
} from 'lucide-react';

const Sidebar = () => {
  const { user, isAdmin } = useAuth();
  const currentPath = window.location.pathname;

  if (!user) return null; // No sidebar if logged out

  const navItemStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem 1rem',
    borderRadius: 'var(--border-radius)',
    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
    backgroundColor: isActive ? 'var(--bg-tertiary)' : 'transparent',
    border: isActive ? '1px solid var(--border-color)' : '1px solid transparent',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    fontSize: '0.9rem',
    fontWeight: isActive ? 600 : 500,
    marginBottom: '0.25rem'
  });

  const sectionTitleStyle = {
    fontSize: '0.75rem',
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    margin: '1.5rem 0 0.5rem 1rem'
  };

  const navigate = (path) => {
    window.location.href = path;
  };

  return (
    <aside style={{
      position: 'fixed',
      top: 'var(--navbar-height)',
      left: 0,
      bottom: 0,
      width: 'var(--sidebar-width)',
      backgroundColor: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-color)',
      padding: '1.5rem 1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      zIndex: 90,
      overflowY: 'auto'
    }}>
      {/* Student Services Section */}
      <div style={sectionTitleStyle}>Learning Portal</div>
      
      <div 
        onClick={() => navigate('/dashboard')} 
        style={navItemStyle(currentPath === '/dashboard' || currentPath === '/')}
      >
        <LayoutDashboard size={18} />
        <span>My Dashboard</span>
      </div>

      <div 
        onClick={() => navigate('/courses')} 
        style={navItemStyle(currentPath.startsWith('/courses') && !currentPath.includes('/admin'))}
      >
        <BookOpen size={18} />
        <span>Browse Courses</span>
      </div>

      <div 
        onClick={() => navigate('/certificates')} 
        style={navItemStyle(currentPath === '/certificates')}
      >
        <Award size={18} />
        <span>My Certificates</span>
      </div>

      <div 
        onClick={() => navigate('/profile')} 
        style={navItemStyle(currentPath === '/profile')}
      >
        <UserCog size={18} />
        <span>Account Profile</span>
      </div>

      <div 
        onClick={() => navigate('/help')} 
        style={navItemStyle(currentPath === '/help')}
      >
        <HelpCircle size={18} />
        <span>Help Center</span>
      </div>

      {/* Admin Panel Section */}
      {isAdmin() && (
        <>
          <div style={sectionTitleStyle}>Administration</div>
          
          <div 
            onClick={() => navigate('/admin/dashboard')} 
            style={navItemStyle(currentPath === '/admin/dashboard')}
          >
            <BarChart size={18} />
            <span>Overview Stats</span>
          </div>

          <div 
            onClick={() => navigate('/admin/courses')} 
            style={navItemStyle(currentPath.startsWith('/admin/courses') || currentPath.startsWith('/admin/modules') || currentPath.startsWith('/admin/lessons'))}
          >
            <FolderOpen size={18} />
            <span>Manage Content</span>
          </div>

          <div 
            onClick={() => navigate('/admin/users')} 
            style={navItemStyle(currentPath === '/admin/users')}
          >
            <Users size={18} />
            <span>Manage Users</span>
          </div>

          <div 
            onClick={() => navigate('/admin/certificates')} 
            style={navItemStyle(currentPath === '/admin/certificates')}
          >
            <GraduationCap size={18} />
            <span>User Credentials</span>
          </div>
        </>
      )}
    </aside>
  );
};

export default Sidebar;
