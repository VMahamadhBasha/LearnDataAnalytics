import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { courseService } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Sparkles, BookOpen, ArrowRight, CheckCircle, Database, ShieldAlert, Code, BarChart3, LineChart, RefreshCw, Layers } from 'lucide-react';

const Home = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getCourses();
        setCourses(data.slice(0, 3)); // show top 3 courses on landing
      } catch (err) {
        console.error("Failed to load catalog courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleStartLearning = () => {
    if (user) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/register';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'SNOWFLAKE': return <Layers color="#009ad6" />;
      case 'POWER_BI': return <BarChart3 color="#f2c811" />;
      case 'TABLEAU': return <LineChart color="#e8762b" />;
      case 'SQL': return <Database color="#10b981" />;
      case 'PYTHON': return <Code color="#ffd43b" />;
      case 'ETL': return <RefreshCw color="#ec4899" />;
      default: return <BookOpen color="#8b5cf6" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', backgroundColor: '#0b0f19' }}>
      <Navbar />

      {/* Hero Section */}
      <section style={{
        padding: '8rem 2rem 5rem 2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        background: 'radial-gradient(circle at top, #1b253e 0%, #0b0f19 60%)',
        borderBottom: '1px solid var(--border-color)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.375rem 0.875rem',
          borderRadius: '9999px',
          backgroundColor: 'rgba(139, 92, 246, 0.15)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          color: '#c084fc',
          fontSize: '0.8rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: '1.5rem'
        }}>
          <Sparkles size={12} />
          <span>100% Free Data Analytics Academy</span>
        </div>

        <h1 style={{
          fontSize: 'clamp(2.25rem, 6vw, 3.75rem)',
          fontWeight: 800,
          lineHeight: 1.15,
          maxWidth: '850px',
          background: 'linear-gradient(to right, #f8fafc, #94a3b8)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1.5rem',
          letterSpacing: '-1px'
        }}>
          Master Enterprise Data & Analytics from Scratch
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          color: 'var(--text-secondary)',
          maxWidth: '650px',
          lineHeight: 1.6,
          marginBottom: '2.5rem'
        }}>
          Get hands-on training in Snowflake, Power BI, Tableau, SQL, Python, ETL pipeline designs, and dimensional warehousing. Build real projects, earn completion certificates, all completely free.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={handleStartLearning} className="btn btn-primary" style={{ padding: '0.875rem 1.75rem', fontSize: '1rem' }}>
            Get Started Free <ArrowRight size={18} />
          </button>
          <button onClick={() => window.location.href = '/courses'} className="btn btn-secondary" style={{ padding: '0.875rem 1.75rem', fontSize: '1rem' }}>
            Browse Catalog
          </button>
        </div>
      </section>

      {/* Tech Grid Section */}
      <section style={{ padding: '4rem 2rem', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '2rem' }}>
            Technologies You Will Master
          </h2>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            alignItems: 'center'
          }}>
            {['Snowflake', 'Power BI', 'Tableau', 'SQL', 'Python', 'ETL', 'Data Warehousing'].map((tech) => (
              <div key={tech} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '1rem',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                backgroundColor: 'var(--bg-tertiary)',
                padding: '0.5rem 1.25rem',
                borderRadius: '8px',
                border: '1px solid var(--border-color)'
              }}>
                {getCategoryIcon(tech.toUpperCase().replace(' ', '_'))}
                <span>{tech}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlighted Courses Section */}
      <section style={{ padding: '5rem 2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div className="page-header" style={{ marginBottom: '3rem' }}>
          <div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Featured Learning Paths</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Structured curriculum from industry specialists
            </p>
          </div>
          <button className="btn btn-outline" onClick={() => window.location.href = '/courses'}>
            View All Paths
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>Loading catalog...</div>
        ) : (
          <div className="grid-cols-3">
            {courses.map((course) => (
              <div key={course.id} className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0, overflow: 'hidden' }}>
                <img 
                  src={course.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600&auto=format&fit=crop'} 
                  alt={course.title}
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                />
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <span className={`badge badge-${course.category.toLowerCase().replace('_', '')}`}>
                      {course.category}
                    </span>
                    <span className="badge badge-difficulty">
                      {course.difficultyLevel}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    {course.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.5rem', flex: 1 }}>
                    {course.description.length > 120 ? course.description.substring(0, 120) + '...' : course.description}
                  </p>
                  <button 
                    onClick={handleStartLearning}
                    className="btn btn-secondary" 
                    style={{ width: '100%', fontSize: '0.9rem', display: 'flex', justifyContent: 'center' }}
                  >
                    Start Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Features Value Proposition */}
      <section style={{ padding: '5rem 2rem', backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, textAlign: 'center', marginBottom: '3rem' }}>
            Why Learn on LDAWSPT?
          </h2>
          <div className="grid-cols-3">
            {[
              {
                title: "100% Free Materials",
                desc: "No credit cards, no subscription models, no locked content. Access everything free, forever."
              },
              {
                title: "Industry Validated Certificate",
                desc: "Complete courses, pass review milestones, and receive verifiable certificates to prove your capability."
              },
              {
                title: "Structured Curriculum",
                desc: "Don't get lost in random tutorials. Follow chronological pathways carefully mapped out to guarantee conceptual retention."
              }
            ].map((feat, idx) => (
              <div key={idx} className="card" style={{ backgroundColor: 'var(--bg-tertiary)' }}>
                <CheckCircle size={24} style={{ color: 'var(--success)', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>{feat.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
