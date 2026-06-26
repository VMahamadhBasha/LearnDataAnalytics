import React from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { HelpCircle, ChevronRight, MessageSquare, Mail, Play, Database, BookOpen, Layers } from 'lucide-react';

const HelpCenter = () => {
  const faqs = [
    {
      q: "Are the courses on LDAWSPT really 100% free?",
      a: "Yes! Every single course, video lesson, downloadable PDF, SQL database practice sheet, and certificate generated is 100% free. No subscriptions, no credit card required."
    },
    {
      q: "How do I earn a Course Completion Certificate?",
      a: "You must mark 100% of all lessons within a course path as completed. Once completed, a 'Get Certificate' button unlocks on the course summary details page and on your student dashboard. You can then download a verified PDF credential."
    },
    {
      q: "Where do I run the Snowflake and SQL queries from the courses?",
      a: "You can use the Snowflake Free Trial account structure (which we guide you to set up in the Snowflake Warehousing course) or run simple simulations directly inside the inline SQL sandbox panels of our video viewer lessons."
    },
    {
      q: "Can I host this platform or contribute analytics content?",
      a: "Absolutely! The LDAWSPT codebase is designed cleanly using MVC architecture. If you are an enterprise organization or instructor, you can sign in to manage paths, modules, and verify certificate criteria."
    }
  ];

  return (
    <div className="app-container">
      <Navbar />
      <Sidebar />

      <main className="main-content">
        <div className="page-header animate-fade-in">
          <div>
            <h1 className="page-title">Help & Support Center</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              Have questions about the platform, courses, or certificates? Check here.
            </p>
          </div>
        </div>

        <div className="animate-slide-up" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Quick FAQ Grid list */}
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <HelpCircle size={18} style={{ color: 'var(--accent-blue)' }} /> Frequently Asked Questions
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {faqs.map((faq, i) => (
                <div key={i} className="card" style={{ padding: '1.25rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                    <ChevronRight size={18} style={{ color: 'var(--accent-blue)', flexShrink: 0, marginTop: '2px' }} />
                    <span>{faq.q}</span>
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.5, paddingLeft: '1.5rem' }}>
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Setup guides */}
          <div className="grid-cols-2">
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database size={18} style={{ color: 'var(--info)' }} />
                <span>Snowflake Lab Setup</span>
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                To practice the Snowflake warehouse commands, sign up for a Snowflake 30-day free trial. Choose the Enterprise Edition on AWS/Azure, load the sample TPC-H datasets, and follow module instructions.
              </p>
            </div>

            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Layers size={18} style={{ color: 'var(--success)' }} />
                <span>SQL Playgrounds</span>
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                For basic relational model query exercises, you can download DBeaver/PgAdmin, run our provided seeding scripts, or test instant preview queries inside the lesson interactive boxes.
              </p>
            </div>
          </div>

          {/* Contact Support */}
          <div className="card" style={{
            background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-tertiary) 100%)',
            textAlign: 'center',
            padding: '3rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem'
          }}>
            <MessageSquare size={36} style={{ color: 'var(--accent-purple)' }} />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Still need assistance?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '500px', lineHeight: 1.6 }}>
              Can't find what you are looking for? Send us a direct email support request and our academy moderator team will get back to you within 24 hours.
            </p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <a href="mailto:support@ldawspt.com" className="btn btn-primary" style={{ gap: '0.5rem' }}>
                <Mail size={16} /> Contact support@ldawspt.com
              </a>
            </div>
          </div>

        </div>

        <Footer />
      </main>
    </div>
  );
};

export default HelpCenter;
