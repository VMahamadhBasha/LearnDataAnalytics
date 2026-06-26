import React, { useState, useEffect } from 'react';
import { certificateService } from '../services/api';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { Award, Download, AlertCircle, Calendar, ShieldCheck, ExternalLink } from 'lucide-react';

const Certificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const data = await certificateService.getMyCertificates();
        setCertificates(data);
      } catch (err) {
        setError('Failed to retrieve certificates. Please reload.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const handleDownload = (uuid) => {
    window.open(certificateService.getDownloadUrl(uuid), '_blank');
  };

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />

      <main className="main-content">
        <div className="page-header animate-fade-in">
          <div>
            <h1 className="page-title">My Certificates</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              View and download your 100% verified course credentials
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
            Loading credentials...
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
        ) : certificates.length === 0 ? (
          <div className="card animate-fade-in" style={{ textAlign: 'center', padding: '5rem', borderStyle: 'dashed' }}>
            <Award size={64} style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Certificates Earned Yet</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
              Complete 100% of all lessons in any course path (Snowflake, SQL, Power BI) to unlock your verified credential and download the PDF.
            </p>
            <button className="btn btn-primary" onClick={() => window.location.href = '/courses'}>
              Explore Learning Paths
            </button>
          </div>
        ) : (
          <div className="grid-cols-3 animate-slide-up">
            {certificates.map((cert) => (
              <div key={cert.id} className="card card-hover" style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                height: '100%',
                background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
                borderColor: 'rgba(139, 92, 246, 0.2)'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                    <div style={{
                      padding: '0.5rem',
                      borderRadius: '8px',
                      backgroundColor: 'rgba(139, 92, 246, 0.15)',
                      color: 'var(--accent-purple)'
                    }}>
                      <Award size={28} />
                    </div>
                    <span className="badge badge-difficulty" style={{ borderColor: 'var(--success)', color: 'var(--success)' }}>
                      Verified
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    {cert.courseTitle}
                  </h3>
                  
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontFamily: 'monospace' }}>
                    ID: {cert.certificateUuid}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <Calendar size={14} />
                    <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <ShieldCheck size={14} style={{ color: 'var(--success)' }} />
                    <span>Authentic Academic Record</span>
                  </div>

                  <button 
                    onClick={() => handleDownload(cert.certificateUuid)}
                    className="btn btn-primary" 
                    style={{ width: '100%', fontSize: '0.85rem', gap: '0.375rem', marginTop: '0.5rem' }}
                  >
                    <Download size={14} /> Download PDF Certificate
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

export default Certificates;
