import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { Users, BookOpen, Layers, Award, BarChart3, ShieldAlert, ArrowRight, Activity, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await adminService.getDashboardStats();
        setStats(data);
      } catch (err) {
        setError('Failed to fetch admin metrics. Make sure you are logged in as admin.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const navigate = (path) => {
    window.location.href = path;
  };

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />

      <main className="main-content">
        <div className="page-header animate-fade-in">
          <div>
            <h1 className="page-title">Admin Control Panel</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              LDAWSPT Platform Overview & System Analytics
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
            Retrieving control registry stats...
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
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Top Cards metrics */}
            <div className="grid-cols-4">
              
              {/* Card 1: Users */}
              <div className="card card-hover" onClick={() => navigate('/admin/users')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'rgba(59, 130, 246, 0.15)', color: 'var(--accent-blue)' }}>
                  <Users size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.totalUsers}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Registered Students</div>
                </div>
              </div>

              {/* Card 2: Courses */}
              <div className="card card-hover" onClick={() => navigate('/admin/courses')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)' }}>
                  <BookOpen size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.totalCourses}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Active Learning Paths</div>
                </div>
              </div>

              {/* Card 3: Lessons */}
              <div className="card card-hover" onClick={() => navigate('/admin/courses')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'rgba(245, 158, 11, 0.15)', color: 'var(--warning)' }}>
                  <Layers size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.totalLessons}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Total Seeded Lessons</div>
                </div>
              </div>

              {/* Card 4: Certificates */}
              <div className="card card-hover" onClick={() => navigate('/admin/certificates')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: 'rgba(139, 92, 246, 0.15)', color: 'var(--accent-purple)' }}>
                  <Award size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.totalCertificates}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Certificates Awarded</div>
                </div>
              </div>

            </div>

            {/* Quick Actions Panel */}
            <div className="grid-cols-3">
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Content Management</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Add, update, or remove courses, syllabus modules, and lesson video streams.
                </p>
                <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem', justifyContent: 'space-between', marginTop: 'auto' }} onClick={() => navigate('/admin/courses')}>
                  Manage Curriculums <ArrowRight size={14} />
                </button>
              </div>

              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>User Management</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Audit student progress records, check profile states, or disable/enable accounts.
                </p>
                <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem', justifyContent: 'space-between', marginTop: 'auto' }} onClick={() => navigate('/admin/users')}>
                  Manage Student Accounts <ArrowRight size={14} />
                </button>
              </div>

              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>User Credentials</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Review active certificate registry, verify authenticators, or manually trigger regenerations.
                </p>
                <button className="btn btn-secondary" style={{ width: '100%', fontSize: '0.8rem', justifyContent: 'space-between', marginTop: 'auto' }} onClick={() => navigate('/admin/certificates')}>
                  Manage Certificates <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Organizations and Instructor Dashboards ROADMAP */}
            <div className="grid-cols-2">
              
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <TrendingUp size={18} style={{ color: 'var(--accent-purple)' }} />
                  <span>Enterprise Organization Portals</span>
                  <span style={{ fontSize: '0.625rem', padding: '2px 6px', backgroundColor: 'var(--accent-purple)', borderRadius: '4px', color: 'white' }}>ROADMAP</span>
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <strong>TODO:</strong> A multi-tenant division is scheduled to allow corporate clients to purchase private workspaces. Organization admins will be able to bulk-import employees, allocate custom SQL tracks, and download department performance analytics.
                </p>
              </div>

              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={18} style={{ color: 'var(--success)' }} />
                  <span>Performance Monitoring & Prom/Grafana</span>
                  <span style={{ fontSize: '0.625rem', padding: '2px 6px', backgroundColor: 'var(--success)', borderRadius: '4px', color: 'white' }}>ROADMAP</span>
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <strong>TODO:</strong> Spring Boot Actuator metrics are mapped. Prometheus collection nodes and Grafana graphical widgets will monitor request times, database connections (H2/MySQL pool saturation), and JWT auth decryption latency.
                </p>
              </div>

            </div>

          </div>
        )}
        <Footer />
      </main>
    </div>
  );
};

export default AdminDashboard;
