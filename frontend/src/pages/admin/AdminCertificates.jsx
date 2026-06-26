import React, { useState, useEffect } from 'react';
import { adminService, certificateService } from '../../services/api';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import { Award, Download, RefreshCw, ShieldCheck, Search, AlertTriangle } from 'lucide-react';

const AdminCertificates = () => {
  const [certificates, setCertificates] = useState([]);
  const [filteredCertificates, setFilteredCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchCertificates = async () => {
    setLoading(true);
    try {
      const data = await adminService.getCertificates();
      setCertificates(data);
      setFilteredCertificates(data);
    } catch (e) {
      setError('Failed to fetch certificates record.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCertificates();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = certificates.filter(c => 
      c.studentFullName?.toLowerCase().includes(term) ||
      c.studentUsername?.toLowerCase().includes(term) ||
      c.courseTitle?.toLowerCase().includes(term) ||
      c.certificateUuid?.toLowerCase().includes(term)
    );
    setFilteredCertificates(filtered);
  }, [searchTerm, certificates]);

  const handleDownload = (uuid) => {
    window.open(certificateService.getDownloadUrl(uuid), '_blank');
  };

  const handleRegenerate = async (certId) => {
    if (!window.confirm('Are you sure you want to regenerate this certificate? This will update the UUID.')) return;
    try {
      const updated = await adminService.regenerateCertificate(certId);
      setCertificates(prev => prev.map(c => c.id === certId ? updated : c));
      alert('Certificate successfully regenerated.');
    } catch (e) {
      alert('Failed to regenerate certificate.');
    }
  };

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />

      <main className="main-content">
        <div className="page-header animate-fade-in">
          <div>
            <h1 className="page-title">User Credentials Registry</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Inspect issued completion certificates and manage verifications
            </p>
          </div>
        </div>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>
            Retrieving certificate mappings...
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
            <AlertTriangle size={20} />
            <span>{error}</span>
          </div>
        ) : (
          <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Search filter controls */}
            <div className="card" style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Search size={18} style={{ color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                className="form-control"
                placeholder="Search student names, course titles, UUID tokens..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ border: 'none', backgroundColor: 'transparent', padding: '0.25rem', fontSize: '0.9rem' }}
              />
            </div>

            {/* Certificates Table */}
            <div className="card" style={{ padding: 0, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    <th style={{ padding: '1rem' }}>ID</th>
                    <th style={{ padding: '1rem' }}>Student Name</th>
                    <th style={{ padding: '1rem' }}>Course Title</th>
                    <th style={{ padding: '1rem' }}>Issue Date</th>
                    <th style={{ padding: '1rem' }}>Verification Token</th>
                    <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCertificates.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        No completion certificates found.
                      </td>
                    </tr>
                  ) : (
                    filteredCertificates.map((cert) => (
                      <tr key={cert.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background var(--transition-fast)' }}>
                        <td style={{ padding: '1rem', fontWeight: 600 }}>{cert.id}</td>
                        <td style={{ padding: '1rem' }}>
                          <div>
                            <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{cert.studentFullName}</div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>@{cert.studentUsername}</span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem', color: 'var(--text-primary)' }}>{cert.courseTitle}</td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>
                          {new Date(cert.issueDate).toLocaleDateString()}
                        </td>
                        <td style={{ padding: '1rem', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--accent-purple)' }}>
                          {cert.certificateUuid}
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                            <button 
                              onClick={() => handleDownload(cert.certificateUuid)}
                              className="btn btn-secondary" 
                              style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', gap: '0.25rem' }}
                              title="Download PDF"
                            >
                              <Download size={12} /> Download
                            </button>
                            <button 
                              onClick={() => handleRegenerate(cert.id)}
                              className="btn btn-outline" 
                              style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', gap: '0.25rem' }}
                              title="Regenerate Certificate UUID"
                            >
                              <RefreshCw size={12} /> Re-Gen
                            </button>
                          </div>
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

export default AdminCertificates;
