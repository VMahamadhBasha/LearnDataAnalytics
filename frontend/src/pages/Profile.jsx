import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { User, Lock, Mail, UserCheck, ShieldAlert, CheckCircle, Globe, Palette } from 'lucide-react';

const Profile = () => {
  const { user, refreshProfile } = useAuth();
  
  // Profile Info State
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: ''
  });
  
  // Password Change State
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profileLoading, setProfileLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const details = await authService.getProfile();
        setProfileData({
          firstName: details.firstName || '',
          lastName: details.lastName || '',
          email: details.email || '',
          username: details.username || ''
        });
      } catch (err) {
        console.error("Failed to load user profile details", err);
      }
    };
    loadProfile();
  }, []);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage({ type: '', text: '' });

    if (!profileData.firstName || !profileData.lastName || !profileData.email) {
      setProfileMessage({ type: 'error', text: 'All profile fields are required.' });
      setProfileLoading(false);
      return;
    }

    try {
      await authService.updateProfile(profileData.firstName, profileData.lastName, profileData.email);
      await refreshProfile(); // Sync global auth context user state
      setProfileMessage({ type: 'success', text: 'Profile metrics updated successfully!' });
    } catch (err) {
      setProfileMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile. Email might be in use.'
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage({ type: '', text: '' });

    const { oldPassword, newPassword, confirmPassword } = passwordData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'All password fields are required.' });
      setPasswordLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
      setPasswordLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'New password must be at least 6 characters.' });
      setPasswordLoading(false);
      return;
    }

    try {
      await authService.changePassword(oldPassword, newPassword);
      setPasswordMessage({ type: 'success', text: 'Password changed successfully.' });
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setPasswordMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to change password. Verify your current password.'
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />

      <main className="main-content">
        <div className="page-header animate-fade-in">
          <div>
            <h1 className="page-title">Account Profile</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Manage your personal student records and credential security
            </p>
          </div>
        </div>

        <div className="grid-cols-2 animate-slide-up" style={{ alignItems: 'start' }}>
          
          {/* Panel 1: Profile Details */}
          <div className="card">
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <User size={20} style={{ color: 'var(--accent-blue)' }} /> Profile Information
            </h2>

            {profileMessage.text && (
              <div style={{
                display: 'flex',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                marginBottom: '1rem',
                fontSize: '0.85rem',
                backgroundColor: profileMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                color: profileMessage.type === 'success' ? 'var(--success)' : 'var(--danger)',
                border: `1px solid ${profileMessage.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                alignItems: 'center'
              }}>
                {profileMessage.type === 'success' ? <CheckCircle size={16} /> : <ShieldAlert size={16} />}
                <span>{profileMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit}>
              <div className="form-group">
                <label className="form-label">Username (Immutable)</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={profileData.username} 
                  disabled 
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                />
              </div>

              <div className="grid-cols-2" style={{ gap: '1rem', marginBottom: 0 }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="firstName"
                    value={profileData.firstName} 
                    onChange={handleProfileChange}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="lastName"
                    value={profileData.lastName} 
                    onChange={handleProfileChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input 
                  type="email" 
                  className="form-control" 
                  name="email"
                  value={profileData.email} 
                  onChange={handleProfileChange}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={profileLoading}
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                {profileLoading ? 'Saving...' : 'Update Details'}
              </button>
            </form>
          </div>

          {/* Panel 2: Password Security & Preference Roadmap */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Password Security Form */}
            <div className="card">
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={20} style={{ color: 'var(--warning)' }} /> Change Password
              </h2>

              {passwordMessage.text && (
                <div style={{
                  display: 'flex',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  marginBottom: '1rem',
                  fontSize: '0.85rem',
                  backgroundColor: passwordMessage.type === 'success' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  color: passwordMessage.type === 'success' ? 'var(--success)' : 'var(--danger)',
                  border: `1px solid ${passwordMessage.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                  alignItems: 'center'
                }}>
                  {passwordMessage.type === 'success' ? <CheckCircle size={16} /> : <ShieldAlert size={16} />}
                  <span>{passwordMessage.text}</span>
                </div>
              )}

              <form onSubmit={handlePasswordSubmit}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    name="oldPassword"
                    value={passwordData.oldPassword} 
                    onChange={handlePasswordChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    name="newPassword"
                    value={passwordData.newPassword} 
                    onChange={handlePasswordChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    name="confirmPassword"
                    value={passwordData.confirmPassword} 
                    onChange={handlePasswordChange}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-secondary" 
                  disabled={passwordLoading}
                  style={{ width: '100%', marginTop: '0.5rem' }}
                >
                  {passwordLoading ? 'Saving...' : 'Update Password'}
                </button>
              </form>
            </div>

            {/* Language and Appearance Settings ROADMAP */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Globe size={18} style={{ color: 'var(--accent-purple)' }} />
                <span>Theme & Multi-Language Preferences</span>
                <span style={{ fontSize: '0.625rem', padding: '2px 6px', backgroundColor: 'var(--accent-purple)', borderRadius: '4px', color: 'white' }}>ROADMAP</span>
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                <strong>TODO:</strong> A localization and light-mode system is scheduled. You will be able to synchronize your system language choices (Spanish, English, Telugu, Hindi, etc.) and color options (Slate Dark, Emerald Green, Indigo Light) directly back to your SQL profile.
              </p>
              
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem' }}>
                <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem', cursor: 'not-allowed', opacity: 0.6 }} disabled>
                  <Globe size={14} /> English (US)
                </button>
                <button className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.5rem 0.75rem', cursor: 'not-allowed', opacity: 0.6 }} disabled>
                  <Palette size={14} /> Slate Dark
                </button>
              </div>
            </div>

          </div>

        </div>

        <Footer />
      </main>
    </div>
  );
};

export default Profile;
