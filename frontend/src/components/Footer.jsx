import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      textAlign: 'center',
      padding: '2rem',
      backgroundColor: 'var(--bg-primary)',
      borderTop: '1px solid var(--border-color)',
      color: 'var(--text-muted)',
      fontSize: '0.8rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      alignItems: 'center',
      marginTop: 'auto'
    }}>
      <div>
        &copy; {new Date().getFullYear()} <strong>LDAWSPT</strong>. 100% Free Analytics Learning Platform. All rights reserved.
      </div>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <a href="#" style={{ textDecoration: 'underline' }}>Privacy Policy</a>
        <span>&bull;</span>
        <a href="#" style={{ textDecoration: 'underline' }}>Terms of Service</a>
        <span>&bull;</span>
        <a href="#" style={{ textDecoration: 'underline' }}>Sitemap</a>
      </div>
    </footer>
  );
};

export default Footer;
