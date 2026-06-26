import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, Shield, GraduationCap } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: 'var(--navbar-height)',
      backgroundColor: 'rgba(19, 26, 46, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'between',
      padding: '0 2rem',
      zIndex: 100
    }}>
      {/* Brand Logo and Text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
        <img src="/src/assets/logo.svg" alt="LDAWSPT Logo" style={{ width: '36px', height: '36px' }} />
        <div>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, background: 'var(--accent-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '0.5px' }}>
            LDAWSPT
          </span>
          <div style={{ fontSize: '0.625rem', color: 'var(--text-secondary)', fontWeight: 500, marginTop: '-3px' }}>
            100% FREE DATA & ANALYTICS LAB
          </div>
        </div>
      </div>

      {/* User Information */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginLeft: 'auto' }}>
        {user ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-blue)'
              }}>
                <UserIcon size={18} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {user.username}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '2px' }}>
                  {isAdmin() ? (
                    <span style={{
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      backgroundColor: 'rgba(239, 68, 68, 0.15)',
                      color: 'var(--danger)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}>
                      <Shield size={8} /> ADMIN
                    </span>
                  ) : (
                    <span style={{
                      fontSize: '0.625rem',
                      fontWeight: 700,
                      backgroundColor: 'rgba(59, 130, 246, 0.15)',
                      color: 'var(--accent-blue)',
                      padding: '1px 6px',
                      borderRadius: '4px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px'
                    }}>
                      <GraduationCap size={8} /> STUDENT
                    </span>
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.875rem', color: 'var(--text-secondary)' }}
              title="Logout"
            >
              <LogOut size={16} />
              <span style={{ marginLeft: '4px' }}>Logout</span>
            </button>
          </>
        ) : (
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-outline" style={{ padding: '0.5rem 1rem' }} onClick={() => window.location.href = '/login'}>
              Log In
            </button>
            <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }} onClick={() => window.location.href = '/register'}>
              Sign Up Free
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
