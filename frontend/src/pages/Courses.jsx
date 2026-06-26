import React, { useState, useEffect } from 'react';
import { courseService } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { Search, SlidersHorizontal, BookOpen, AlertCircle } from 'lucide-react';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [
    { label: 'All Fields', value: '' },
    { label: 'Snowflake', value: 'SNOWFLAKE' },
    { label: 'SQL', value: 'SQL' },
    { label: 'Python', value: 'PYTHON' },
    { label: 'Power BI', value: 'POWER_BI' },
    { label: 'Tableau', value: 'TABLEAU' },
    { label: 'ETL Pipelines', value: 'ETL' }
  ];

  const fetchCourses = async (category = '', search = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await courseService.getCourses(category, search);
      setCourses(data);
    } catch (err) {
      setError('Failed to retrieve learning paths. Please reload.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses(selectedCategory, searchQuery);
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCourses(selectedCategory, searchQuery);
  };

  const handleCategorySelect = (val) => {
    setSelectedCategory(val);
  };

  const handleViewCourse = (courseId) => {
    window.location.href = `/courses/${courseId}`;
  };

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />

      <main className="main-content">
        <div className="page-header animate-fade-in">
          <div>
            <h1 className="page-title">Browse Learning Paths</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Explore structured, 100% free technical analytical tracks
            </p>
          </div>
        </div>

        {/* Filter Bar Controls */}
        <div className="animate-slide-up" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem',
          flexWrap: 'wrap',
          marginBottom: '2rem'
        }}>
          {/* Category Tabs */}
          <div style={{
            display: 'flex',
            gap: '0.375rem',
            overflowX: 'auto',
            paddingBottom: '0.25rem',
            maxWidth: '100%'
          }}>
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.value;
              return (
                <button
                  key={cat.label}
                  onClick={() => handleCategorySelect(cat.value)}
                  className="btn"
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.85rem',
                    borderRadius: '8px',
                    backgroundColor: isActive ? 'var(--bg-tertiary)' : 'var(--bg-secondary)',
                    borderColor: isActive ? 'var(--accent-blue)' : 'var(--border-color)',
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    borderStyle: 'solid',
                    borderWidth: '1px'
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Search Box Form */}
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.5rem', minWidth: '280px', flex: '1', maxWidth: '400px' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search SQL, Snowflake, DAX..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ paddingLeft: '2.5rem', paddingRight: '1rem', fontSize: '0.875rem' }}
              />
            </div>
            <button type="submit" className="btn btn-secondary" style={{ padding: '0.625rem 1rem' }}>
              Search
            </button>
          </form>
        </div>

        {/* Courses Listing Grid */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
            Searching database catalog...
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
        ) : courses.length === 0 ? (
          <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '4rem', borderStyle: 'dashed' }}>
            <BookOpen size={48} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>No Courses Found</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              We couldn't find any courses matching your filters. Try selecting another tab or clear terms.
            </p>
          </div>
        ) : (
          <div className="grid-cols-3 animate-slide-up">
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
                    {course.description}
                  </p>
                  <button 
                    onClick={() => handleViewCourse(course.id)}
                    className="btn btn-primary" 
                    style={{ width: '100%', fontSize: '0.9rem', display: 'flex', justifyContent: 'center' }}
                  >
                    View Modules & Syllabus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
};

export default Courses;
