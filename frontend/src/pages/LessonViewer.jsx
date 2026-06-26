import React, { useState, useEffect, useRef } from 'react';
import { courseService, progressService } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { 
  Play, 
  CheckCircle, 
  Bookmark, 
  FileText, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  MessageSquare, 
  Send, 
  Code, 
  ExternalLink, 
  Save, 
  BookOpen,
  HelpCircle,
  FolderOpen
} from 'lucide-react';

const LessonViewer = () => {
  const [lesson, setLesson] = useState(null);
  const [progress, setProgress] = useState({ completed: false, resumePositionSeconds: 0 });
  const [courseLessons, setCourseLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Local Notes State
  const [notes, setNotes] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Mock states for Roadmap Panels
  const [aiMessage, setAiMessage] = useState('');
  const [aiChat, setAiChat] = useState([
    { sender: 'assistant', text: 'Hi! I am your LDAWSPT AI Assistant. Ask me any conceptual query or request a SQL code explanation regarding this lesson.' }
  ]);

  const [sandboxQuery, setSandboxQuery] = useState('SELECT * FROM SNOWFLAKE_SAMPLE_DATA.TPCH_SF1.CUSTOMER LIMIT 10;');
  const [sandboxResult, setSandboxResult] = useState('');

  // Extract lesson ID from window.location
  const getLessonId = () => {
    const parts = window.location.pathname.split('/');
    return parts[parts.length - 1];
  };

  const lessonId = getLessonId();

  useEffect(() => {
    const fetchLessonAndCourseContext = async () => {
      if (!lessonId) return;
      setLoading(true);
      setError('');
      try {
        // 1. Fetch current lesson detail
        const lessonDetail = await courseService.getLessonDetail(lessonId);
        setLesson(lessonDetail);

        // 2. Fetch progress info
        try {
          const progressInfo = await progressService.getLessonProgress(lessonId);
          if (progressInfo) {
            setProgress(progressInfo);
          }
        } catch (e) {
          console.log("No progress record exists yet.");
        }

        // 3. Load user's notes from localStorage
        const storedNotes = localStorage.getItem(`notes_lesson_${lessonId}`);
        setNotes(storedNotes || '');

        // 4. Fetch siblings/lessons in same course to support Prev/Next navigation
        // To do this, we get modules for this course, and map lessons.
        const courseId = lessonDetail.courseId;
        const modules = await courseService.getCourseModules(courseId);
        let allLessons = [];
        for (const mod of modules) {
          const modLessons = await courseService.getLessons(mod.id);
          allLessons = [...allLessons, ...modLessons];
        }
        setCourseLessons(allLessons);

      } catch (err) {
        setError('Failed to load lesson content. Please reload.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLessonAndCourseContext();
  }, [lessonId]);

  // Periodic progress saving (tracks video resume duration simulation)
  useEffect(() => {
    let interval;
    if (lesson && !progress.completed) {
      interval = setInterval(() => {
        // Periodically update resume time (for mock video tracking)
        setProgress(prev => {
          const nextSec = prev.resumePositionSeconds + 10;
          const maxSec = lesson.durationMinutes * 60;
          const finalSec = nextSec > maxSec ? maxSec : nextSec;
          
          // Save back to backend
          progressService.updateProgress(lessonId, prev.completed, finalSec)
            .catch(err => console.error("Error saving progress periodically", err));

          return { ...prev, resumePositionSeconds: finalSec };
        });
      }, 10000); // every 10 seconds
    }
    return () => clearInterval(interval);
  }, [lesson, progress.completed, lessonId]);

  const handleToggleComplete = async () => {
    try {
      const nextCompleted = !progress.completed;
      const updated = await progressService.updateProgress(lessonId, nextCompleted, progress.resumePositionSeconds);
      setProgress(updated);
    } catch (err) {
      alert('Error updating completion state.');
    }
  };

  const handleToggleBookmark = async () => {
    try {
      await courseService.toggleBookmark(lessonId);
      alert('Bookmark updated successfully.');
    } catch (e) {
      alert('Failed to toggle bookmark.');
    }
  };

  const handleSaveNotes = () => {
    setIsSavingNotes(true);
    localStorage.setItem(`notes_lesson_${lessonId}`, notes);
    setTimeout(() => {
      setIsSavingNotes(false);
    }, 600);
  };

  // Navigations (Prev/Next)
  const currentIdx = courseLessons.findIndex(l => l.id.toString() === lessonId.toString());
  const prevLesson = currentIdx > 0 ? courseLessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < courseLessons.length - 1 ? courseLessons[currentIdx + 1] : null;

  const navigateToLesson = (id) => {
    window.location.href = `/courses/lessons/${id}`;
  };

  const handleSendAiMessage = (e) => {
    e.preventDefault();
    if (!aiMessage.trim()) return;

    const userMsg = { sender: 'user', text: aiMessage };
    setAiChat(prev => [...prev, userMsg]);
    setAiMessage('');

    // Simulate AI response referring to lesson
    setTimeout(() => {
      const reply = {
        sender: 'assistant',
        text: `Based on this lesson "${lesson?.title}", here is a synthesis: To master this topic in Snowflake/SQL, ensure you use optimal query filtering on target columns. Feel free to run this in the database workspace.`
      };
      setAiChat(prev => [...prev, reply]);
    }, 800);
  };

  const handleRunSandbox = (e) => {
    e.preventDefault();
    setSandboxResult('Executing query in Snowflake sandbox container...\n------------------------------------------------\nQuery Status: SUCCESS\nRows Returned: 3\n\nCUSTOMER_ID | CUSTOMER_NAME  | BALANCE\n------------|----------------|--------\n1004928     | Customer#00001 | 4920.12\n1004929     | Customer#00002 | -123.45\n1004930     | Customer#00003 | 9851.00');
  };

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />

      <main className="main-content" style={{ padding: '1.5rem' }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem', color: 'var(--text-secondary)' }}>
            Retrieving lesson media panel...
          </div>
        ) : error || !lesson ? (
          <div className="card" style={{ textAlign: 'center', borderColor: 'var(--danger)', borderStyle: 'solid' }}>
            <HelpCircle size={48} style={{ color: 'var(--danger)', marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Unable to Load Lesson</h3>
            <p style={{ color: 'var(--text-secondary)' }}>{error || 'Lesson record is missing.'}</p>
          </div>
        ) : (
          <div className="animate-slide-up" style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)',
            gap: '1.5rem',
            alignItems: 'start'
          }}>
            
            {/* Left Column: Visual Media Player & Navigation */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* Main Embed Content Container */}
              <div style={{ 
                backgroundColor: 'black', 
                borderRadius: 'var(--border-radius)', 
                overflow: 'hidden', 
                border: '1px solid var(--border-color)',
                aspectRatio: '16/9',
                position: 'relative'
              }}>
                {lesson.contentType === 'VIDEO' && lesson.youtubeVideoId ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${lesson.youtubeVideoId}?enablejsapi=1&start=${progress.resumePositionSeconds}`}
                    title={lesson.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  ></iframe>
                ) : lesson.pdfUrl ? (
                  <div style={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '2rem',
                    textAlign: 'center'
                  }}>
                    <FileText size={64} style={{ color: 'var(--info)', marginBottom: '1rem' }} />
                    <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>PDF Learning Material</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '400px' }}>
                      This lesson contains documentation. You can read it directly or download it using the link.
                    </p>
                    <a 
                      href={lesson.pdfUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn btn-primary"
                      style={{ gap: '0.5rem' }}
                    >
                      <ExternalLink size={16} /> Open PDF Document
                    </a>
                  </div>
                ) : (
                  <div style={{ 
                    height: '100%', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: 'var(--text-secondary)',
                    backgroundColor: 'var(--bg-secondary)'
                  }}>
                    No visual media content loaded for this lesson.
                  </div>
                )}
              </div>

              {/* Navigation & Controls Bar */}
              <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem' }}>
                <button 
                  className="btn btn-secondary" 
                  disabled={!prevLesson}
                  onClick={() => prevLesson && navigateToLesson(prevLesson.id)}
                  style={{ gap: '0.375rem', fontSize: '0.85rem' }}
                >
                  <ChevronLeft size={16} /> Previous
                </button>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button 
                    onClick={handleToggleBookmark}
                    className="btn btn-outline" 
                    title="Bookmark Lesson"
                    style={{ padding: '0.5rem 0.75rem' }}
                  >
                    <Bookmark size={18} />
                  </button>

                  <button 
                    onClick={handleToggleComplete}
                    className="btn" 
                    style={{ 
                      backgroundColor: progress.completed ? 'var(--success)' : 'transparent',
                      color: progress.completed ? 'white' : 'var(--text-primary)',
                      borderColor: progress.completed ? 'transparent' : 'var(--border-color)',
                      borderStyle: 'solid',
                      borderWidth: '1px',
                      gap: '0.5rem',
                      fontSize: '0.875rem'
                    }}
                  >
                    <CheckCircle size={16} /> {progress.completed ? 'Completed' : 'Mark as Complete'}
                  </button>
                </div>

                <button 
                  className="btn btn-secondary" 
                  disabled={!nextLesson}
                  onClick={() => nextLesson && navigateToLesson(nextLesson.id)}
                  style={{ gap: '0.375rem', fontSize: '0.85rem' }}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>

              {/* Lesson Overview & Roadmap Playgrounds */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <h1 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{lesson.title}</h1>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <span>Estimated Duration: <strong>{lesson.durationMinutes} mins</strong></span>
                    <span>•</span>
                    <span>Content: <strong>{lesson.contentType}</strong></span>
                  </div>
                </div>
                
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  {lesson.description || 'No lesson description description has been provided.'}
                </p>

                {lesson.practiceFileUrl && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'rgba(6, 182, 212, 0.1)',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    borderRadius: '8px',
                    padding: '0.75rem 1rem',
                    marginTop: '0.5rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--info)' }}>
                      <FileText size={18} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Download SQL Practice/Lab Files</span>
                    </div>
                    <a 
                      href={lesson.practiceFileUrl} 
                      className="btn" 
                      style={{ padding: '0.375rem 0.75rem', backgroundColor: 'var(--info)', color: 'white', fontSize: '0.8rem' }}
                    >
                      <Download size={14} /> Download
                    </a>
                  </div>
                )}

                {/* SQL & Snowflake Coding Playgrounds ROADMAP */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <Code size={18} style={{ color: 'var(--accent-blue)' }} />
                    <span>Snowflake & SQL Live Laboratory</span>
                    <span style={{ fontSize: '0.625rem', padding: '2px 6px', backgroundColor: 'var(--accent-blue)', borderRadius: '4px', color: 'white' }}>ROADMAP</span>
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Execute real-time analytic queries against isolated databases. (Simulation mode active below).
                  </p>
                  
                  <form onSubmit={handleRunSandbox} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <textarea 
                      className="form-control"
                      value={sandboxQuery}
                      onChange={(e) => setSandboxQuery(e.target.value)}
                      rows="3"
                      style={{ fontFamily: 'monospace', fontSize: '0.8rem', backgroundColor: '#05070f' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <button type="submit" className="btn btn-secondary" style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}>
                        Run Query
                      </button>
                    </div>
                  </form>
                  {sandboxResult && (
                    <pre style={{
                      marginTop: '1rem',
                      padding: '1rem',
                      backgroundColor: '#05070f',
                      border: '1px solid var(--border-color)',
                      borderRadius: '8px',
                      fontFamily: 'monospace',
                      fontSize: '0.75rem',
                      color: '#a7f3d0',
                      overflowX: 'auto'
                    }}>{sandboxResult}</pre>
                  )}
                </div>

                {/* Power BI & Tableau Project Submissions ROADMAP */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <FolderOpen size={18} style={{ color: 'var(--accent-purple)' }} />
                    <span>Dashboard Project Submission Portal</span>
                    <span style={{ fontSize: '0.625rem', padding: '2px 6px', backgroundColor: 'var(--accent-purple)', borderRadius: '4px', color: 'white' }}>ROADMAP</span>
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    For visualization tracks, you will submit your packaged `.pbix` or `.twbx` dashboard files here. Instructors and peer evaluators will review designs based on styling, DAX measures, and data modeling parameters.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: AI Assistant & Notes Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* AI Assistant Chat Panel ROADMAP */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', height: '420px', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '0.75rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Sparkles size={16} style={{ color: 'var(--accent-purple)' }} />
                    <span>AI Learning Assistant</span>
                  </h3>
                  <span style={{ fontSize: '0.625rem', padding: '2px 6px', backgroundColor: 'var(--accent-purple)', borderRadius: '4px', color: 'white' }}>ROADMAP</span>
                </div>

                {/* Chat window */}
                <div style={{ flex: '1', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1rem', paddingRight: '0.25rem' }}>
                  {aiChat.map((msg, i) => (
                    <div 
                      key={i} 
                      style={{
                        alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                        backgroundColor: msg.sender === 'user' ? 'var(--bg-tertiary)' : 'rgba(139, 92, 246, 0.1)',
                        border: msg.sender === 'user' ? '1px solid var(--border-color)' : '1px solid rgba(139, 92, 246, 0.2)',
                        borderRadius: '12px',
                        padding: '0.625rem 0.875rem',
                        maxWidth: '85%',
                        fontSize: '0.825rem',
                        lineHeight: 1.4,
                        color: msg.sender === 'user' ? 'var(--text-primary)' : '#c084fc'
                      }}
                    >
                      {msg.text}
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendAiMessage} style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ask AI a doubt..."
                    value={aiMessage}
                    onChange={(e) => setAiMessage(e.target.value)}
                    style={{ fontSize: '0.8rem', padding: '0.5rem' }}
                  />
                  <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem' }}>
                    <Send size={14} />
                  </button>
                </form>
              </div>

              {/* Personal Notes Box (stored in LocalStorage) */}
              <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <BookOpen size={16} style={{ color: 'var(--success)' }} />
                    <span>My Lesson Notes</span>
                  </h3>
                  <button 
                    onClick={handleSaveNotes}
                    className="btn" 
                    style={{ 
                      fontSize: '0.75rem', 
                      padding: '0.375rem 0.75rem', 
                      backgroundColor: 'var(--bg-tertiary)', 
                      borderColor: 'var(--border-color)',
                      borderStyle: 'solid',
                      borderWidth: '1px',
                      gap: '0.375rem'
                    }}
                  >
                    <Save size={12} /> {isSavingNotes ? 'Saving...' : 'Save'}
                  </button>
                </div>
                
                <textarea
                  className="form-control"
                  placeholder="Jot down notes, queries, or useful code snippets from this lesson. Notes are saved automatically to your browser cache."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows="6"
                  style={{ fontSize: '0.85rem', lineHeight: 1.5, resize: 'none' }}
                />
              </div>

            </div>

          </div>
        )}
        <Footer />
      </main>

      {/*
       * FUTURE ROADMAP ARCHITECTURAL TODO COMMENTS:
       * 
       * 1. AI Learning Assistant & Doubt Solver Integration:
       *    - Why: To provide instant explanations, code review, and debug query errors for analytics students.
       *    - Files to modify:
       *      - `LessonViewer.jsx`: Upgrade mockup Chat area with a WebSocket or SSE endpoint connection to Stream LLM replies.
       *      - `LessonController.java`: Add `/api/lessons/{id}/doubt` endpoint using Spring AI or direct Gemini client libraries.
       *    - Database: Create a `chat_history` table mapping query, response, prompt tokens, feedback, user_id, and lesson_id.
       *    - Approach: Extract lesson description, seed text, and transcripts. Feed them as context context in a RAG system using vector embeddings stored in a PostgreSQL pgvector or Elasticsearch database.
       * 
       * 2. Coding & SQL Playgrounds / Snowflake Sandbox Lab:
       *    - Why: Provide hands-on sandbox labs so students learn by running queries without installing servers.
       *    - Files to modify:
       *      - `LessonViewer.jsx`: Create a multi-tab editor using Monaco Editor React.
       *      - `SandboxController.java` (NEW): Run queries via a Snowflake REST Client or a lightweight in-memory SQL sandbox container.
       *    - Security: Heavily sanitize inputs to prevent SQL Injection, run code inside Docker-based isolated sandbox container layers with resource limits.
       * 
       * 3. Power BI / Tableau Project Submission:
       *    - Why: To test styling designs, DAX metrics accuracy, and dimensional modeling practices.
       *    - Files to modify:
       *      - `LessonViewer.jsx`: Drag-and-drop file upload component using react-dropzone.
       *      - `ProgressController.java`: File upload endpoint handler integrating with OCI Object Storage.
       *    - Database: Create `submissions` table: id, user_id, lesson_id, file_url, score, notes, evaluated_by.
       */
      }
    </div>
  );
};

export default LessonViewer;
