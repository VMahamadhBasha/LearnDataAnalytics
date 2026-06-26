import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { Users, Shield, ShieldAlert, CheckCircle, Search, ToggleLeft, ToggleRight } from 'lucide-react';

const UserMgmt = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await adminService.getUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (e) {
      setError('Failed to fetch user accounts record.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = users.filter(u => 
      u.username?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.firstName?.toLowerCase().includes(term) ||
      u.lastName?.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleToggleStatus = async (userId, currentActive) => {
    const nextActive = !currentActive;
    try {
      await adminService.toggleUserStatus(userId, nextActive);
      // Update local state directly
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, active: nextActive } : u));
    } catch (err) {
      alert('Error updating user status.');
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />

      <main className="main-content">
        <div className="page-header animate-fade-in">
          <div>
            <h1 className="page-title">Manage Users</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Disable/enable student logins and inspect security privileges
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
            Retrieving user account registry...
          </div>
        ) : error ? (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            padding: '1rem',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: 'var(--border-radius)',
            color: 'var(--danger)',
            alignItems: 'center'
          }}>
            <ShieldAlert size={20} />
            <span>{error}</span>
          </div>
        ) : (
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Search Bar controls */}
            <div className="card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Search size={18} style={{ color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="form-control"
                placeholder="Search username, email, names..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ border: 'none', backgroundColor: 'transparent', padding: '0.25rem', fontSize: '0.9rem' }}
              />
            </div>

            {/* Users Table list */}
            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    <th style={{ padding: '1rem' }}>User ID</th>
                    <th style={{ padding: '1rem' }}>Name</th>
                    <th style={{ padding: '1rem' }}>Username</th>
                    <th style={{ padding: '1rem' }}>Email</th>
                    <th style={{ padding: '1rem' }}>Access Privileges</th>
                    <th style={{ padding: '1rem' }}>Status</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No user profiles found matching filters.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr key={user.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background var(--transition-fast)' }}>
                        <td style={{ padding: '1rem', fontWeight: 600 }}>{user.id}</td>
                        <td style={{ padding: '1rem' }}>{user.firstName} {user.lastName}</td>
                        <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{user.username}</td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{user.email}</td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            {user.roles?.map(r => (
                              <span key={r} className="badge badge-difficulty" style={{ fontSize: '0.6rem' }}>
                                {r.replace('ROLE_', '')}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ 
                            fontSize: '0.75rem', 
                            fontWeight: 600, 
                            color: user.active ? 'var(--success)' : 'var(--danger)'
                          }}>
                            {user.active ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem', textAlign: 'center' }}>
                          <button 
                            onClick={() => handleToggleStatus(user.id, user.active)}
                            className="btn btn-outline" 
                            style={{ 
                              padding: '0.25rem 0.5rem', 
                              fontSize: '0.75rem', 
                              borderColor: 'transparent',
                              color: user.active ? 'var(--danger)' : 'var(--success)',
                              gap: '0.25rem'
                            }}
                          >
                            {user.active ? (
                              <>
                                <ToggleRight size={18} /> Disable
                              </>
                            ) : (
                              <>
                                <ToggleLeft size={18} /> Enable
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>
        )}
        <Footer />
      </main>
    </div>
  );
};

export default UserMgmt;
