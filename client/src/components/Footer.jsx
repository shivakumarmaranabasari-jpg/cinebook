import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, Shield, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="nav-brand">
            <Film className="brand-icon" size={24} />
            <span>Cine<span className="brand-accent">Book</span></span>
          </Link>
          <p>
            CineBook is a next-generation online movie ticket booking management system engineered with React, Node.js, Express, and MongoDB.
          </p>
        </div>

        <div className="footer-col">
          <h4>Explore</h4>
          <ul className="footer-links">
            <li><Link to="/movies">Now Showing</Link></li>
            <li><Link to="/movies">Upcoming Movies</Link></li>
            <li><Link to="/theatres">Cinemas & IMAX</Link></li>
            <li><Link to="/bookings">Booking History</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Engineering Tech</h4>
          <ul className="footer-links">
            <li><span>Frontend: React + Vite</span></li>
            <li><span>Backend: Express + Node.js</span></li>
            <li><span>Database: MongoDB & Mongoose</span></li>
            <li><span>Auth: JWT & bcrypt (Stage 2)</span></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Project Details</h4>
          <ul className="footer-links">
            <li><span>B.Tech CSE 3rd Year Project</span></li>
            <li><span style={{ color: '#4ade80', display: 'flex', alignItems: 'center', gap: '4px' }}><Sparkles size={14} /> Stage 1 Complete</span></li>
            <li><span>Production Ready Architecture</span></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} CineBook Inc. Built for CSE Engineering Project.</p>
        <p style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          Crafted with <Heart size={14} color="#e11d48" fill="#e11d48" /> for Cinema Lovers
        </p>
      </div>
    </footer>
  );
};

export default Footer;
