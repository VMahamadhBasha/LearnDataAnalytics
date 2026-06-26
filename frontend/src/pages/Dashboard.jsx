import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { progressService, certificateService } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { Play, Award, BookOpen, Clock, Bookmark, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const data = await progressService.getStudentDashboard();
        setStats(data);
      } catch (err) {
        setError('Failed to fetch dashboard metrics. Please reload.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardStats();
  }, []);

  const handleResumeLesson = (lessonId) => {
    window.location.href = `/courses/lessons/${lessonId}`;
  };

  const handleDownloadCertificate = async (courseId) => {
    try {
      const certificate = await certificateService.getOrCreateCertificate(courseId);
      // Open stream download path in new window
      window.open(certificateService.getDownloadUrl(certificate.certificateUuid), '_blank');
    } catch (err) {
      alert(err.response?.data?.message || 'Error generating certificate. Ensure all lessons are completed.');
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />

      <main className="main-content">
        <div className="page-header animate-fade-in">
          <div>
            <h1 className="page-title">My Learning Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Welcome back, <strong>{user?.username}</strong>! Track your study metrics.
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
            Retrieving learning records...
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
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        ) : (
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Stats Metrics Grid */}
            <div className="grid-cols-4">
              {/* Stat 1: In Progress */}
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(245, 158, 11, 0.15)',
                  color: 'var(--warning)'
                }}>
                  <Clock size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.inProgressCourses}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>In Progress Paths</div>
                </div>
              </div>

              {/* Stat 2: Completed */}
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--success)'
                }}>
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.completedCourses}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Completed Paths</div>
                </div>
              </div>

              {/* Stat 3: Lessons Completed */}
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(59, 130, 246, 0.15)',
                  color: 'var(--accent-blue)'
                }}>
                  <BookOpen size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.totalLessonsWatched}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Lessons Watched</div>
                </div>
              </div>

              {/* Stat 4: Certificates Issued */}
              <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(139, 92, 246, 0.15)',
                  color: 'var(--accent-purple)'
                }}>
                  <Award size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800 }}>{stats.totalCertificates}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Certificates Earned</div>
                </div>
              </div>
            </div>

            {/* In Progress Courses List */}
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Active Learning Tracks</h2>
              
              {stats.courseSummaries.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem', borderStyle: 'dashed' }}>
                  <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>No Active Learning Tracks</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
                    You haven't accessed any courses yet. Open the catalog to enroll in Snowflake or SQL.
                  </p>
                  <button className="btn btn-primary" onClick={() => window.location.href = '/courses'}>
                    Explore Courses Catalog
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {stats.courseSummaries.map((summary) => (
                    <div key={summary.courseId} className="card" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1.5rem',
                      flexWrap: 'wrap'
                    }}>
                      {/* Course Image */}
                      <img 
                        src={summary.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=300&auto=format&fit=crop'} 
                        alt={summary.courseTitle}
                        style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                      />

                      {/* Title & Category info */}
                      <div style={{ flex: '1', minWidth: '200px' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.25rem' }}>
                          <span className={`badge badge-${summary.category.toLowerCase().replace('_', '')}`} style={{ fontSize: '0.625rem' }}>
                            {summary.category}
                          </span>
                        </div>
                        <h3 
                          style={{ fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer' }}
                          onClick={() => window.location.href = `/courses/${summary.courseId}`}
                        >
                          {summary.courseTitle}
                        </h3>
                        {summary.lastAccessedLessonTitle && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                            Last lesson: <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{summary.lastAccessedLessonTitle}</span>
                          </div>
                        )}
                      </div>

                      {/* Progress Bar Display */}
                      <div style={{ width: '250px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
                          <span style={{ color: 'var(--text-secondary)' }}>
                            {summary.completedLessons} / {summary.totalLessons} lessons
                          </span>
                          <span style={{ color: 'var(--text-primary)' }}>
                            {summary.progressPercentage}%
                          </span>
                        </div>
                        <div className="progress-bar-container">
                          <div className="progress-bar-fill" style={{ width: `${summary.progressPercentage}%` }}></div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        {summary.progressPercentage === 100 ? (
                          <button 
                            className="btn btn-primary" 
                            style={{ gap: '0.25rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                            onClick={() => handleDownloadCertificate(summary.courseId)}
                          >
                            <Award size={16} /> Get Certificate
                          </button>
                        ) : (
                          <button 
                            className="btn btn-secondary" 
                            style={{ gap: '0.25rem', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                            onClick={() => handleResumeLesson(summary.lastAccessedLessonId)}
                          >
                            <Play size={14} fill="currentColor" /> Resume
                          </button>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Quick Actions and Streaks TODO roadmap display */}
            <div className="grid-cols-2">
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Quick Actions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <button className="btn btn-outline" style={{ justifyContent: 'space-between' }} onClick={() => window.location.href = '/courses'}>
                    <span>Enroll in new Snowflake or SQL courses</span>
                    <ArrowRight size={16} />
                  </button>
                  <button className="btn btn-outline" style={{ justifyContent: 'space-between' }} onClick={() => window.location.href = '/profile'}>
                    <span>Manage profile & security settings</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              <div className="card" style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                {/* Gamification Streak roadmap */}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>Learning Streaks & Leaderboards</span>
                  <span style={{ fontSize: '0.625rem', padding: '2px 6px', backgroundColor: 'var(--accent-purple)', borderRadius: '4px', color: 'white' }}>ROADMAP</span>
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <strong>TODO:</strong> A gamified tracking routine is scheduled to be integrated. Daily consecutive learning logins will trigger streak multipliers. Top users will be ranked dynamically on the public global leaderboard.
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

export default Dashboard;
