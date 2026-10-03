import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Film, Search, MapPin, User, LogOut, ShieldAlert, Calendar, Menu, X, LayoutDashboard } from 'lucide-react';
import { checkBackendHealth } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [backendStatus, setBackendStatus] = useState('checking');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const verifyHealth = async () => {
      try {
        const res = await checkBackendHealth();
        if (res && res.status === 'healthy') {
          setBackendStatus(res.database?.status === 'connected' ? 'connected' : 'db-offline');
        } else {
          setBackendStatus('offline');
        }
      } catch {
        setBackendStatus('offline');
      }
    };
    verifyHealth();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchTerm.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="navbar">
      <div className="nav-container">
        {/* Brand Logo */}
        <Link to="/" className="nav-brand">
          <Film className="brand-icon" size={26} />
          <span>Cine<span className="brand-accent">Book</span></span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav>
          <ul className="nav-links">
            <li>
              <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/movies" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Movies
              </NavLink>
            </li>
            <li>
              <NavLink to="/theatres" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Theatres
              </NavLink>
            </li>
            <li>
              <NavLink to="/shows" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Shows
              </NavLink>
            </li>
            {isAuthenticated && (
              <li>
                <NavLink to="/bookings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  My Bookings
                </NavLink>
              </li>
            )}
            {isAdmin && (
              <li>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                  style={{
                    color: '#fb7185',
                    background: 'rgba(225, 29, 72, 0.12)',
                    padding: '0.3rem 0.65rem',
                    borderRadius: '6px',
                  }}
                >
                  <LayoutDashboard size={15} />
                  Admin
                </NavLink>
              </li>
            )}
          </ul>
        </nav>

        {/* Search Input */}
        <form onSubmit={handleSearch} className="nav-search">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search movies, genres, actors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        {/* City and Auth Controls */}
        <div className="nav-actions">
          <div className="city-selector" title="Select your cinema city">
            <MapPin size={15} color="#e11d48" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{ background: 'transparent', color: '#f8fafc', border: 'none', outline: 'none', cursor: 'pointer' }}
            >
              <option value="Bengaluru" style={{ background: '#111827' }}>Bengaluru</option>
              <option value="Mumbai" style={{ background: '#111827' }}>Mumbai</option>
              <option value="Delhi" style={{ background: '#111827' }}>Delhi-NCR</option>
              <option value="Hyderabad" style={{ background: '#111827' }}>Hyderabad</option>
            </select>
          </div>

          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Link
                to="/profile"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '999px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#f8fafc',
                }}
                title="View Profile"
              >
                <div
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#e11d48',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                  }}
                >
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span>{user?.name?.split(' ')[0]}</span>
              </Link>

              <button
                onClick={logout}
                className="btn-secondary"
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
                title="Log out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <User size={15} />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: 'none',
              background: 'transparent',
              color: '#f8fafc',
              fontSize: '1.25rem',
              padding: '0.4rem',
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          style={{
            background: '#111827',
            borderBottom: '1px solid var(--border-color)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <NavLink
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="nav-link"
          >
            Home
          </NavLink>
          <NavLink
            to="/movies"
            onClick={() => setMobileMenuOpen(false)}
            className="nav-link"
          >
            Movies
          </NavLink>
          <NavLink
            to="/theatres"
            onClick={() => setMobileMenuOpen(false)}
            className="nav-link"
          >
            Theatres
          </NavLink>
          <NavLink
            to="/shows"
            onClick={() => setMobileMenuOpen(false)}
            className="nav-link"
          >
            Shows
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to="/bookings"
              onClick={() => setMobileMenuOpen(false)}
              className="nav-link"
            >
              My Bookings
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="nav-link"
              style={{ color: '#fb7185' }}
            >
              Admin Dashboard
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
