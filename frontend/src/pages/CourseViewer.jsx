import React, { useState, useEffect } from 'react';
import { courseService, certificateService } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { BookOpen, Layers, Award, ChevronDown, ChevronRight, PlayCircle, FileText, Download, MessageSquare, Video } from 'lucide-react';

const CourseViewer = () => {
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessonsMap, setLessonsMap] = useState({});
  const [expandedModules, setExpandedModules] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Parse course ID from URL: /courses/:id
  const getCourseIdFromPath = () => {
    const parts = window.location.pathname.split('/');
    return parts[parts.length - 1];
  };

  useEffect(() => {
    const fetchCourseData = async () => {
      const courseId = getCourseIdFromPath();
      if (!courseId) return;

      setLoading(true);
      setError('');
      try {
        const courseData = await courseService.getCourseDetails(courseId);
        setCourse(courseData);
        
        const modulesData = await courseService.getCourseModules(courseId);
        setModules(modulesData);
        
        // Pre-expand first module
        if (modulesData.length > 0) {
          const firstModId = modulesData[0].id;
          setExpandedModules(prev => ({ ...prev, [firstModId]: true }));
          fetchLessons(firstModId);
        }
      } catch (err) {
        setError('Failed to fetch course details. Please reload.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, []);

  const fetchLessons = async (moduleId) => {
    if (lessonsMap[moduleId]) return; // already loaded
    try {
      const data = await courseService.getLessons(moduleId);
      setLessonsMap(prev => ({ ...prev, [moduleId]: data }));
    } catch (e) {
      console.error(`Failed to load lessons for module ${moduleId}`, e);
    }
  };

  const toggleModuleExpand = (moduleId) => {
    const nextState = !expandedModules[moduleId];
    setExpandedModules(prev => ({ ...prev, [moduleId]: nextState }));
    if (nextState) {
      fetchLessons(moduleId);
    }
  };

  const handleStartCourse = () => {
    // Navigate to the first lesson of the first module
    if (modules.length > 0) {
      const firstModId = modules[0].id;
      const lessons = lessonsMap[firstModId];
      if (lessons && lessons.length > 0) {
        window.location.href = `/courses/lessons/${lessons[0].id}`;
      } else {
        // Fallback fetch if not loaded yet
        courseService.getLessons(firstModId).then(data => {
          if (data && data.length > 0) {
            window.location.href = `/courses/lessons/${data[0].id}`;
          } else {
            alert('No lessons added to this course yet.');
          }
        });
      }
    }
  };

  const handleLessonSelect = (lessonId) => {
    window.location.href = `/courses/lessons/${lessonId}`;
  };

  const handleClaimCertificate = async () => {
    if (!course) return;
    try {
      const certificate = await certificateService.getOrCreateCertificate(course.id);
      window.open(certificateService.getDownloadUrl(certificate.certificateUuid), '_blank');
    } catch (err) {
      alert(err.response?.data?.message || 'Verification failed. Complete all lessons to unlock certificate.');
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />

      <main className="main-content">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
            Retrieving syllabus modules...
          </div>
        ) : error || !course ? (
          <div className="card" style={{ padding: '2rem', textAlign: 'center', borderStyle: 'solid', borderColor: 'var(--danger)' }}>
            <Award size={48} style={{ color: 'var(--danger)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Failed to View Course</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{error || 'Course does not exist.'}</p>
          </div>
        ) : (
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Hero Course Header Card */}
            <div className="card" style={{
              display: 'flex',
              gap: '2rem',
              alignItems: 'center',
              flexWrap: 'wrap',
              background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
              padding: '2rem'
            }}>
              <img 
                src={course.imageUrl || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=300&auto=format&fit=crop'} 
                alt={course.title}
                style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '12px' }}
              />
              <div style={{ flex: '1', minWidth: '300px' }}>
                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span className={`badge badge-${course.category.toLowerCase().replace('_', '')}`}>
                    {course.category}
                  </span>
                  <span className="badge badge-difficulty">
                    {course.difficultyLevel}
                  </span>
                </div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '0.5rem' }}>{course.title}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                  {course.description}
                </p>
              </div>

              {/* Course CTA Panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '200px' }}>
                <button className="btn btn-primary" onClick={handleStartCourse} style={{ width: '100%' }}>
                  <PlayCircle size={18} /> Start Learning
                </button>
                <button className="btn btn-secondary" onClick={handleClaimCertificate} style={{ width: '100%', gap: '0.375rem' }}>
                  <Award size={16} /> Get Certificate
                </button>
              </div>
            </div>

            {/* Syllabus Modules Accordion */}
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} style={{ color: 'var(--accent-blue)' }} /> Course Modules & Syllabus
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {modules.map((mod) => {
                  const isExpanded = !!expandedModules[mod.id];
                  const lessons = lessonsMap[mod.id] || [];

                  return (
                    <div key={mod.id} className="card" style={{ padding: '1rem 1.25rem' }}>
                      <div 
                        onClick={() => toggleModuleExpand(mod.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                            M{mod.orderIndex}
                          </span>
                          <div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{mod.title}</h3>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{mod.description}</p>
                          </div>
                        </div>
                        {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </div>

                      {/* Expandable Lessons List */}
                      {isExpanded && (
                        <div style={{
                          marginTop: '1rem',
                          borderTop: '1px solid var(--border-color)',
                          paddingTop: '0.75rem',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.5rem'
                        }}>
                          {lessons.length === 0 ? (
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', paddingLeft: '2rem' }}>
                              Loading syllabus details...
                            </span>
                          ) : (
                            lessons.map((lesson) => (
                              <div 
                                key={lesson.id} 
                                onClick={() => handleLessonSelect(lesson.id)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  padding: '0.625rem 1rem',
                                  borderRadius: '8px',
                                  backgroundColor: 'var(--bg-tertiary)',
                                  cursor: 'pointer',
                                  transition: 'background var(--transition-fast)'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--border-color)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-tertiary)'}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  {lesson.contentType === 'VIDEO' ? (
                                    <PlayCircle size={16} style={{ color: 'var(--accent-blue)' }} />
                                  ) : (
                                    <FileText size={16} style={{ color: 'var(--info)' }} />
                                  )}
                                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{lesson.title}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                                    {lesson.durationMinutes} mins
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Collaborative Discussion Board TODO roadmap panel */}
            <div className="grid-cols-2">
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MessageSquare size={18} style={{ color: 'var(--success)' }} />
                  <span>Discussion Forum</span>
                  <span style={{ fontSize: '0.625rem', padding: '2px 6px', backgroundColor: 'var(--success)', borderRadius: '4px', color: 'white' }}>ROADMAP</span>
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <strong>TODO:</strong> A peer-to-peer discussion forum will reside here. Students will be able to start posts, reply to queries, and request helper code snippets.
                </p>
              </div>

              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Video size={18} style={{ color: 'var(--accent-blue)' }} />
                  <span>Live Tutoring Webinars</span>
                  <span style={{ fontSize: '0.625rem', padding: '2px 6px', backgroundColor: 'var(--accent-blue)', borderRadius: '4px', color: 'white' }}>ROADMAP</span>
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  <strong>TODO:</strong> Integration with Zoom APIs and WebRTC streams will allow hosts to schedule live database training sessions directly on this page.
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

export default CourseViewer;
