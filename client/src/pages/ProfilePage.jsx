import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchBookings } from '../services/api';
import {
  User,
  Mail,
  Phone,
  Shield,
  Ticket,
  Save,
  CheckCircle,
  AlertCircle,
  LayoutDashboard,
} from 'lucide-react';

const ProfilePage = () => {
  const { user, isAuthenticated, isAdmin, updateProfile } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [bookingsCount, setBookingsCount] = useState(0);
  const [totalSpend, setTotalSpend] = useState(0);

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '+91 98765 43210');
    }

    const loadUserStats = async () => {
      try {
        const res = await fetchBookings();
        if (res && res.data) {
          setBookingsCount(res.data.length);
          const spend = res.data
            .filter((b) => b.bookingStatus === 'confirmed')
            .reduce((acc, b) => acc + (b.totalAmount || 0), 0);
          setTotalSpend(spend);
        }
      } catch (err) {
        console.error('Failed to load user booking stats:', err);
      }
    };

    loadUserStats();
  }, [user, isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    try {
      const updatePayload = { name, phone };
      if (password.trim()) {
        updatePayload.password = password.trim();
      }
      await updateProfile(updatePayload);
      setMessage('Profile updated successfully!');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="section-wrapper" style={{ maxWidth: '800px' }}>
      <div className="section-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
        <h1 className="section-title">My Account & Profile</h1>
        <p className="section-subtitle">
          Manage your personal details, phone number, and security credentials.
        </p>
      </div>

      {message && (
        <div className="alert-box alert-success">
          <CheckCircle size={20} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="alert-box alert-error">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      {/* Stats KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{ background: '#161f30', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Total Bookings</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>{bookingsCount}</div>
        </div>

        <div style={{ background: '#161f30', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Lifetime Spend</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', marginTop: '4px' }}>₹{totalSpend}</div>
        </div>

        <div style={{ background: '#161f30', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.8rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Account Role</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: isAdmin ? '#fb7185' : '#38bdf8', marginTop: '8px' }}>
            {isAdmin ? 'Administrator' : 'Standard Member'}
          </div>
        </div>
      </div>

      {/* Edit Profile Form */}
      <div style={{ background: '#161f30', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>
          Personal Details
        </h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address (Immutable)</label>
            <input
              type="email"
              className="form-input"
              value={user?.email || ''}
              disabled
              style={{ opacity: 0.6, cursor: 'not-allowed' }}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Mobile Number</label>
            <input
              type="text"
              className="form-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Password (leave blank to keep current)</label>
            <input
              type="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters"
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <button type="submit" disabled={saving} className="btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
              <Save size={16} /> {saving ? 'Saving Changes...' : 'Save Profile'}
            </button>
            <Link to="/bookings" className="btn-secondary">
              <Ticket size={16} /> View My Bookings
            </Link>
            {isAdmin && (
              <Link to="/admin" className="btn-secondary" style={{ color: '#fb7185' }}>
                <LayoutDashboard size={16} /> Open Admin Dashboard
              </Link>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
