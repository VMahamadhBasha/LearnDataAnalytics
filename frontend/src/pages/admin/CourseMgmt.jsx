import React, { useState, useEffect } from 'react';
import { courseService, adminService } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Layers, 
  BookOpen, 
  FileText, 
  Save, 
  X, 
  Eye, 
  ChevronDown, 
  ChevronRight, 
  Settings 
} from 'lucide-react';

const CourseMgmt = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Syllabus expansion
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [lessonsMap, setLessonsMap] = useState({});
  const [expandedModules, setExpandedModules] = useState({});

  // Modals / Form displays
  const [activeModal, setActiveModal] = useState(''); // 'course_add', 'course_edit', 'module_add', 'module_edit', 'lesson_add', 'lesson_edit'
  
  // Entity Form States
  const [courseForm, setCourseForm] = useState({ id: null, title: '', description: '', category: 'SQL', difficultyLevel: 'BEGINNER', imageUrl: '', isPublished: true });
  const [moduleForm, setModuleForm] = useState({ id: null, courseId: null, title: '', description: '', orderIndex: 1 });
  const [lessonForm, setLessonForm] = useState({ id: null, moduleId: null, title: '', description: '', contentType: 'VIDEO', youtubeVideoId: '', pdfUrl: '', practiceFileUrl: '', orderIndex: 1, durationMinutes: 10 });

  const categories = ['SQL', 'SNOWFLAKE', 'PYTHON', 'POWER_BI', 'TABLEAU', 'ETL', 'DATA_WAREHOUSING'];
  const difficulties = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

  const fetchAllCourses = async () => {
    setLoading(true);
    try {
      const data = await courseService.getCourses();
      setCourses(data);
    } catch (e) {
      setError('Failed to fetch course records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCourses();
  }, []);

  const handleManageSyllabus = async (course) => {
    setSelectedCourse(course);
    setModules([]);
    setLessonsMap({});
    try {
      const mods = await courseService.getCourseModules(course.id);
      setModules(mods);
    } catch (e) {
      alert('Error fetching modules for course.');
    }
  };

  const handleFetchLessons = async (moduleId) => {
    try {
      const data = await courseService.getLessons(moduleId);
      setLessonsMap(prev => ({ ...prev, [moduleId]: data }));
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleModule = (moduleId) => {
    const nextVal = !expandedModules[moduleId];
    setExpandedModules(prev => ({ ...prev, [moduleId]: nextVal }));
    if (nextVal && !lessonsMap[moduleId]) {
      handleFetchLessons(moduleId);
    }
  };

  // COURSE ACTIONS
  const openCourseAdd = () => {
    setCourseForm({ id: null, title: '', description: '', category: 'SQL', difficultyLevel: 'BEGINNER', imageUrl: '', isPublished: true });
    setActiveModal('course_add');
  };

  const openCourseEdit = (course) => {
    setCourseForm({ ...course });
    setActiveModal('course_edit');
  };

  const submitCourse = async (e) => {
    e.preventDefault();
    try {
      if (activeModal === 'course_add') {
        await adminService.createCourse(courseForm);
      } else {
        await adminService.updateCourse(courseForm.id, courseForm);
      }
      setActiveModal('');
      fetchAllCourses();
      setSelectedCourse(null);
    } catch (err) {
      alert('Error saving course data.');
    }
  };

  const deleteCourse = async (id) => {
    if (!window.confirm('Are you sure you want to delete this course and all its modules/lessons?')) return;
    try {
      await adminService.deleteCourse(id);
      fetchAllCourses();
      setSelectedCourse(null);
    } catch (e) {
      alert('Error deleting course.');
    }
  };

  // MODULE ACTIONS
  const openModuleAdd = () => {
    setModuleForm({ id: null, courseId: selectedCourse.id, title: '', description: '', orderIndex: modules.length + 1 });
    setActiveModal('module_add');
  };

  const openModuleEdit = (mod) => {
    setModuleForm({ ...mod });
    setActiveModal('module_edit');
  };

  const submitModule = async (e) => {
    e.preventDefault();
    try {
      if (activeModal === 'module_add') {
        await adminService.createModule(moduleForm);
      } else {
        await adminService.updateModule(moduleForm.id, moduleForm);
      }
      setActiveModal('');
      handleManageSyllabus(selectedCourse);
    } catch (err) {
      alert('Error saving module data.');
    }
  };

  const deleteModule = async (id) => {
    if (!window.confirm('Are you sure you want to delete this module?')) return;
    try {
      await adminService.deleteModule(id);
      handleManageSyllabus(selectedCourse);
    } catch (e) {
      alert('Error deleting module.');
    }
  };

  // LESSON ACTIONS
  const openLessonAdd = (moduleId) => {
    const siblingCount = lessonsMap[moduleId]?.length || 0;
    setLessonForm({ 
      id: null, 
      moduleId, 
      title: '', 
      description: '', 
      contentType: 'VIDEO', 
      youtubeVideoId: '', 
      pdfUrl: '', 
      practiceFileUrl: '', 
      orderIndex: siblingCount + 1, 
      durationMinutes: 10 
    });
    setActiveModal('lesson_add');
  };

  const openLessonEdit = (lesson) => {
    setLessonForm({ ...lesson });
    setActiveModal('lesson_edit');
  };

  const submitLesson = async (e) => {
    e.preventDefault();
    try {
      if (activeModal === 'lesson_add') {
        await adminService.createLesson(lessonForm);
      } else {
        await adminService.updateLesson(lessonForm.id, lessonForm);
      }
      setActiveModal('');
      // Reload parent module's lessons
      handleFetchLessons(lessonForm.moduleId);
    } catch (err) {
      alert('Error saving lesson data.');
    }
  };

  const deleteLesson = async (lesson) => {
    if (!window.confirm('Are you sure you want to delete this lesson?')) return;
    try {
      await adminService.deleteLesson(lesson.id);
      handleFetchLessons(lesson.moduleId);
    } catch (e) {
      alert('Error deleting lesson.');
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />

      <main className="main-content" style={{ display: 'flex', gap: '1.5rem', alignItems: 'start' }}>
        
        {/* Left Side: Course Management Grid */}
        <div style={{ flex: '1.2', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div className="page-header animate-fade-in" style={{ margin: 0 }}>
            <div>
              <h1 className="page-title">Manage Content</h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Create or modify courses, modules, and lessons catalog
              </p>
            </div>
            <button className="btn btn-primary" onClick={openCourseAdd} style={{ gap: '0.25rem', fontSize: '0.85rem' }}>
              <Plus size={16} /> Add Course
            </button>
          </div>

          {loading ? (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading catalog...</div>
          ) : (
            <div className="grid-cols-2 animate-slide-up">
              {courses.map((course) => (
                <div key={course.id} className="card" style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  padding: '1rem',
                  borderColor: selectedCourse?.id === course.id ? 'var(--accent-blue)' : 'var(--border-color)',
                  backgroundColor: selectedCourse?.id === course.id ? 'var(--bg-tertiary)' : 'var(--bg-secondary)'
                }}>
                  <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <span className={`badge badge-${course.category.toLowerCase().replace('_', '')}`} style={{ fontSize: '0.6rem' }}>
                      {course.category}
                    </span>
                    <span className="badge badge-difficulty" style={{ fontSize: '0.6rem' }}>
                      {course.difficultyLevel}
                    </span>
                  </div>
                  
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{course.title}</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '1rem', flex: 1 }}>
                    {course.description.length > 100 ? course.description.substring(0, 100) + '...' : course.description}
                  </p>

                  <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', gap: '0.5rem' }}>
                    <button className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', flex: 1, gap: '0.25rem' }} onClick={() => handleManageSyllabus(course)}>
                      <Settings size={12} /> Syllabus
                    </button>
                    <button className="btn btn-outline" style={{ padding: '0.375rem', borderRadius: '8px' }} onClick={() => openCourseEdit(course)}>
                      <Edit size={14} />
                    </button>
                    <button className="btn btn-outline" style={{ padding: '0.375rem', borderRadius: '8px', color: 'var(--danger)', borderColor: 'rgba(239,68,68,0.2)' }} onClick={() => deleteCourse(course.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Modules & Lessons Syllabus Auditor */}
        <div style={{ flex: '1', minWidth: '350px', display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'sticky', top: 'calc(var(--navbar-height) + 1.5rem)' }}>
          {selectedCourse ? (
            <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Syllabus For:</span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{selectedCourse.title}</h3>
                </div>
                <button className="btn btn-secondary" style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', gap: '0.25rem' }} onClick={openModuleAdd}>
                  <Plus size={14} /> Add Module
                </button>
              </div>

              {modules.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No modules added to this course. Add a module to begin seeding.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto', maxHeight: '550px' }}>
                  {modules.map((mod) => {
                    const isExpanded = !!expandedModules[mod.id];
                    const lessons = lessonsMap[mod.id] || [];

                    return (
                      <div key={mod.id} style={{ border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }} onClick={() => handleToggleModule(mod.id)}>
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                            <div>
                              <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>M{mod.orderIndex}: {mod.title}</div>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{mod.description}</span>
                            </div>
                          </div>

                          <div style={{ display: 'flex', gap: '0.25rem' }}>
                            <button className="btn btn-outline" style={{ padding: '0.25rem', borderRadius: '4px' }} onClick={() => openModuleEdit(mod)}>
                              <Edit size={12} />
                            </button>
                            <button className="btn btn-outline" style={{ padding: '0.25rem', borderRadius: '4px', color: 'var(--danger)', borderColor: 'transparent' }} onClick={() => deleteModule(mod.id)}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Lessons List inside Module */}
                        {isExpanded && (
                          <div style={{ marginTop: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.375rem', paddingLeft: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '0.25rem 0 0.5rem 0' }}>
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Module Lessons:</span>
                              <button className="btn btn-outline" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', gap: '0.25rem' }} onClick={() => openLessonAdd(mod.id)}>
                                <Plus size={12} /> Add Lesson
                              </button>
                            </div>

                            {lessons.length === 0 ? (
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No lessons added.</span>
                            ) : (
                              lessons.map((les) => (
                                <div key={les.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--bg-secondary)', padding: '0.375rem 0.625rem', borderRadius: '6px' }}>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>L{les.orderIndex}: {les.title}</span>
                                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                                    <button className="btn btn-outline" style={{ padding: '0.25rem', borderRadius: '4px' }} onClick={() => openLessonEdit(les)}>
                                      <Edit size={10} />
                                    </button>
                                    <button className="btn btn-outline" style={{ padding: '0.25rem', borderRadius: '4px', color: 'var(--danger)', borderColor: 'transparent' }} onClick={() => deleteLesson(les)}>
                                      <Trash2 size={10} />
                                    </button>
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
              )}
            </div>
          ) : (
            <div className="card" style={{ padding: '3rem', textAlign: 'center', borderStyle: 'dashed' }}>
              <Layers size={40} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Select a Course</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
                Click the 'Syllabus' settings button on any course on the left to manage its modules and lessons list.
              </p>
            </div>
          )}
        </div>

      </main>

      {/* FORM MODAL WRAPPER (rendered statically on overlay if activeModal is set) */}
      {activeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(5, 7, 15, 0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 999,
          padding: '1.5rem'
        }}>
          <div className="card" style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1.25rem', position: 'relative' }}>
            <button style={{ position: 'absolute', right: '1.25rem', top: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }} onClick={() => setActiveModal('')}>
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
              {activeModal.replace('_', ' ').toUpperCase()}
            </h2>

            {/* A. COURSE FORM */}
            {(activeModal === 'course_add' || activeModal === 'course_edit') && (
              <form onSubmit={submitCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Course Title</label>
                  <input type="text" className="form-control" value={courseForm.title} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows="3" value={courseForm.description} onChange={e => setCourseForm({ ...courseForm, description: e.target.value })} required />
                </div>
                <div className="grid-cols-2" style={{ gap: '1rem', marginBottom: 0 }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-control" value={courseForm.category} onChange={e => setCourseForm({ ...courseForm, category: e.target.value })}>
                      {categories.map(c => <option key={c} value={c}>{c.replace('_', ' ')}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Difficulty Level</label>
                    <select className="form-control" value={courseForm.difficultyLevel} onChange={e => setCourseForm({ ...courseForm, difficultyLevel: e.target.value })}>
                      {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Cover Image URL</label>
                  <input type="text" className="form-control" value={courseForm.imageUrl} onChange={e => setCourseForm({ ...courseForm, imageUrl: e.target.value })} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <input type="checkbox" id="isPublished" checked={courseForm.isPublished} onChange={e => setCourseForm({ ...courseForm, isPublished: e.target.checked })} />
                  <label htmlFor="isPublished" className="form-label" style={{ margin: 0 }}>Publish Course (visible in student catalog)</label>
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Course</button>
              </form>
            )}

            {/* B. MODULE FORM */}
            {(activeModal === 'module_add' || activeModal === 'module_edit') && (
              <form onSubmit={submitModule} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Module Title</label>
                  <input type="text" className="form-control" value={moduleForm.title} onChange={e => setModuleForm({ ...moduleForm, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows="2" value={moduleForm.description} onChange={e => setModuleForm({ ...moduleForm, description: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Order Index</label>
                  <input type="number" className="form-control" value={moduleForm.orderIndex} onChange={e => setModuleForm({ ...moduleForm, orderIndex: parseInt(e.target.value) || 1 })} required />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Module</button>
              </form>
            )}

            {/* C. LESSON FORM */}
            {(activeModal === 'lesson_add' || activeModal === 'lesson_edit') && (
              <form onSubmit={submitLesson} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div className="form-group">
                  <label className="form-label">Lesson Title</label>
                  <input type="text" className="form-control" value={lessonForm.title} onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows="2" value={lessonForm.description} onChange={e => setLessonForm({ ...lessonForm, description: e.target.value })} />
                </div>
                <div className="grid-cols-3" style={{ gap: '0.5rem', marginBottom: 0 }}>
                  <div className="form-group">
                    <label className="form-label">Type</label>
                    <select className="form-control" value={lessonForm.contentType} onChange={e => setLessonForm({ ...lessonForm, contentType: e.target.value })}>
                      <option value="VIDEO">VIDEO</option>
                      <option value="PDF">PDF</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Order</label>
                    <input type="number" className="form-control" value={lessonForm.orderIndex} onChange={e => setLessonForm({ ...lessonForm, orderIndex: parseInt(e.target.value) || 1 })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mins</label>
                    <input type="number" className="form-control" value={lessonForm.durationMinutes} onChange={e => setLessonForm({ ...lessonForm, durationMinutes: parseInt(e.target.value) || 5 })} required />
                  </div>
                </div>

                {lessonForm.contentType === 'VIDEO' ? (
                  <div className="form-group">
                    <label className="form-label">YouTube Video ID (e.g. HXTF2A7iC38)</label>
                    <input type="text" className="form-control" value={lessonForm.youtubeVideoId} onChange={e => setLessonForm({ ...lessonForm, youtubeVideoId: e.target.value })} required />
                  </div>
                ) : (
                  <div className="form-group">
                    <label className="form-label">PDF Document URL</label>
                    <input type="text" className="form-control" value={lessonForm.pdfUrl} onChange={e => setLessonForm({ ...lessonForm, pdfUrl: e.target.value })} required />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">Practice Resource File URL (Optional)</label>
                  <input type="text" className="form-control" value={lessonForm.practiceFileUrl} onChange={e => setLessonForm({ ...lessonForm, practiceFileUrl: e.target.value })} />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Save Lesson</button>
              </form>
            )}

          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default CourseMgmt;
