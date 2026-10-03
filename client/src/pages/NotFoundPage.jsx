import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Home, Clapperboard } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="section-wrapper" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
      <div
        style={{
          maxWidth: '520px',
          margin: '0 auto',
          background: '#161f30',
          padding: '3.5rem 2rem',
          borderRadius: '20px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-card)',
        }}
      >
        <div
          style={{
            width: '72px',
            height: '72px',
            borderRadius: '50%',
            background: 'rgba(225, 29, 72, 0.15)',
            color: '#e11d48',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
          }}
        >
          <Clapperboard size={38} />
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-1px', color: '#e11d48' }}>
          404
        </h1>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, margin: '0.5rem 0' }}>
          This Reel is Missing!
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '2rem' }}>
          The cinema page, screening, or movie route you are trying to reach has ended or does not exist.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn-primary">
            <Home size={16} /> Return to Home
          </Link>
          <Link to="/movies" className="btn-secondary">
            <Film size={16} /> Browse Movies
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
