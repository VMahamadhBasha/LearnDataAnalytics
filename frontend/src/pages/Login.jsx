import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { KeyRound, User as UserIcon, AlertCircle, Sparkles } from 'lucide-react';

const Login = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [alertMsg, setAlertMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Read query params for status alerts
    const params = new URLSearchParams(window.location.search);
    if (params.get('expired')) {
      setAlertMsg('Your session has expired. Please sign in again.');
    } else if (params.get('unauthorized')) {
      setAlertMsg('Administrative access required. Please sign in with an Admin account.');
    } else if (params.get('registered')) {
      setAlertMsg('Registration successful! Use your credentials to log in.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await login(username.trim(), password.trim());
      // On success, redirect to student dashboard
      window.location.href = '/dashboard';
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'Login failed. Please verify your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLoginAdmin = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#0b0f19',
      background: 'radial-gradient(circle at center, #1b253e 0%, #0b0f19 70%)',
      padding: '1.5rem'
    }}>
      <div className="card animate-slide-up" style={{
        width: '100%',
        maxWidth: '420px',
        backgroundColor: 'rgba(19, 26, 46, 0.8)',
        backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-color)',
        padding: '2.5rem 2rem',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)'
      }}>
        {/* Branding Title */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', padding: '0.5rem', borderRadius: '12px', background: 'var(--accent-gradient)', marginBottom: '0.75rem' }}>
            <Sparkles size={24} color="white" />
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>Welcome Back</h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Continue learning data & analytics free
          </p>
        </div>

        {/* Alerts and error banners */}
        {alertMsg && (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: 'var(--border-radius)',
            color: 'var(--accent-blue)',
            fontSize: '0.8rem',
            marginBottom: '1.25rem',
            lineHeight: 1.4
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{alertMsg}</span>
          </div>
        )}

        {error && (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--border-radius)',
            color: 'var(--danger)',
            fontSize: '0.8rem',
            marginBottom: '1.25rem',
            lineHeight: 1.4
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>{error}</span>
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ position: 'relative' }}>
            <label className="form-label" htmlFor="username">Username or Email</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <UserIcon size={16} />
              </span>
              <input
                id="username"
                type="text"
                className="form-control"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <KeyRound size={16} />
              </span>
              <input
                id="password"
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingLeft: '2.5rem' }}
                disabled={loading}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.75rem', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Seeding Demo Helper Panel */}
        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: 'var(--bg-tertiary)',
          border: '1px dashed var(--border-color)',
          borderRadius: 'var(--border-radius)',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
            Local Testing Helper
          </span>
          <button 
            type="button"
            className="btn btn-secondary" 
            style={{ width: '100%', fontSize: '0.75rem', padding: '0.375rem 0.75rem' }}
            onClick={handleQuickLoginAdmin}
            disabled={loading}
          >
            Fill Admin Credentials (admin / admin123)
          </button>
        </div>

        {/* Link to Register */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Don't have an account?{' '}
          <a href="/register" style={{ color: 'var(--accent-blue)', fontWeight: 600, textDecoration: 'underline' }}>
            Register Free
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
