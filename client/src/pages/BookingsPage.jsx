import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchBookings, cancelBookingApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  XCircle,
  LogIn,
  Eye,
  AlertCircle,
  X,
  Printer,
  QrCode,
  Film,
} from 'lucide-react';

const BookingsPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'confirmed', 'cancelled'
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [actionError, setActionError] = useState(null);

  const loadBookings = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetchBookings();
      if (res && res.data) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error('Failed to load user bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, [isAuthenticated]);

  const handleCancel = async (bookingId) => {
    const confirmCancel = window.confirm(
      'Are you sure you want to cancel this booking? The reserved seats will be released back to other users and a full refund will be processed.'
    );
    if (!confirmCancel) return;

    setActionError(null);
    try {
      await cancelBookingApi(bookingId);
      await loadBookings();
    } catch (err) {
      setActionError(err.message || 'Failed to cancel booking');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="section-wrapper" style={{ textAlign: 'center', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto', background: '#161f30', padding: '3rem 2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(225, 29, 72, 0.12)', color: '#e11d48', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Ticket size={30} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>My Bookings & Tickets</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '2rem', lineHeight: '1.6' }}>
            Please sign in to view your reserved tickets, active showtimes, and digital passes.
          </p>
          <Link to="/login" className="btn-primary" style={{ justifyContent: 'center', width: '100%' }}>
            <LogIn size={16} /> Sign In to View Bookings
          </Link>
        </div>
      </div>
    );
  }

  const filteredBookings = bookings.filter((b) => {
    if (filter === 'confirmed') return b.bookingStatus === 'confirmed';
    if (filter === 'cancelled') return b.bookingStatus === 'cancelled';
    return true;
  });

  return (
    <div className="section-wrapper">
      <div className="section-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
        <h1 className="section-title">My Ticket Bookings</h1>
        <p className="section-subtitle">
          Manage your upcoming movie reservations and digital entry passes.
        </p>
      </div>

      {actionError && (
        <div className="alert-box alert-error">
          <AlertCircle size={20} />
          <span>{actionError}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="category-pills" style={{ marginBottom: '2rem' }}>
        <button
          className={`pill-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Reservations ({bookings.length})
        </button>
        <button
          className={`pill-btn ${filter === 'confirmed' ? 'active' : ''}`}
          onClick={() => setFilter('confirmed')}
        >
          Confirmed ({bookings.filter((b) => b.bookingStatus === 'confirmed').length})
        </button>
        <button
          className={`pill-btn ${filter === 'cancelled' ? 'active' : ''}`}
          onClick={() => setFilter('cancelled')}
        >
          Cancelled ({bookings.filter((b) => b.bookingStatus === 'cancelled').length})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
          <h3>Loading Your Bookings...</h3>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', background: '#161f30', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <Ticket size={48} style={{ margin: '0 auto 1rem', opacity: 0.4 }} />
          <h3>No bookings found in this category</h3>
          <p style={{ color: '#94a3b8', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            Ready to experience something epic on the big screen?
          </p>
          <Link to="/movies" className="btn-primary" style={{ display: 'inline-flex' }}>
            Browse Movies & Book Now
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {filteredBookings.map((b) => {
            const movie = b.movieDetails || b.movie || {};
            const theatre = b.theatreDetails || b.theatre || {};
            const isConfirmed = b.bookingStatus === 'confirmed';

            return (
              <div
                key={b._id}
                style={{
                  background: '#161f30',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: '100px 1fr auto',
                  gap: '1.5rem',
                  alignItems: 'center',
                }}
              >
                <img
                  src={movie.posterUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80'}
                  alt={movie.title}
                  style={{ width: '100px', height: '140px', objectFit: 'cover', borderRadius: '10px' }}
                />

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                      ID: {b.bookingId}
                    </span>
                    <span className={isConfirmed ? 'badge-confirmed' : 'badge-cancelled'}>
                      {isConfirmed ? 'Confirmed' : 'Cancelled & Refunded'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>
                    {movie.title || 'Movie Title'}
                  </h3>

                  <div style={{ fontSize: '0.88rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MapPin size={14} color="#e11d48" /> {theatre.name || 'Theatre'} ({b.screenName})
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar size={14} /> {b.showDate} • <Clock size={14} /> {b.showTime}
                    </span>
                  </div>

                  <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#f8fafc' }}>
                    Seats:{' '}
                    <strong style={{ color: '#38bdf8' }}>
                      {b.selectedSeats?.map((s) => s.seatNumber).join(', ')}
                    </strong>{' '}
                    ({b.numberOfTickets} Tickets) • Paid: <strong style={{ color: '#f59e0b' }}>₹{b.totalAmount}</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    onClick={() => setSelectedTicket(b)}
                    className="btn-secondary"
                    style={{ padding: '0.55rem 1rem', fontSize: '0.85rem' }}
                  >
                    <Eye size={15} /> View Pass
                  </button>

                  {isConfirmed && (
                    <button
                      onClick={() => handleCancel(b.bookingId || b._id)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        color: '#f87171',
                        padding: '0.55rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <XCircle size={15} /> Cancel Ticket
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* E-Ticket Preview Modal */}
      {selectedTicket && (
        <div className="modal-overlay" onClick={() => setSelectedTicket(null)}>
          <div
            className="modal-content"
            style={{ maxWidth: '650px', padding: '1rem', background: '#0b0f19' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
              <button
                onClick={() => setSelectedTicket(null)}
                style={{ background: 'transparent', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <div className="eticket-container" style={{ margin: 0 }}>
              <div className="eticket-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Film size={20} color="#ffffff" />
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                    CineBook DIGITAL PASS
                  </span>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>
                  ID: {selectedTicket.bookingId}
                </span>
              </div>

              <div className="eticket-body">
                <img
                  src={selectedTicket.movieDetails?.posterUrl || selectedTicket.movie?.posterUrl}
                  alt="Poster"
                  style={{ width: '120px', height: '170px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
                    {selectedTicket.movieDetails?.title || selectedTicket.movie?.title}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                    {selectedTicket.theatreDetails?.name || selectedTicket.theatre?.name} ({selectedTicket.screenName})
                  </p>
                  <p style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    {selectedTicket.showDate} at {selectedTicket.showTime}
                  </p>
                  <div style={{ marginTop: 'auto', background: 'rgba(255, 255, 255, 0.05)', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Reserved Seats</div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#38bdf8' }}>
                      {selectedTicket.selectedSeats?.map((s) => s.seatNumber).join(', ')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="eticket-perforation"></div>

              <div className="eticket-footer">
                <div>
                  <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>TOTAL PAID</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f59e0b' }}>
                    ₹{selectedTicket.totalAmount}
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ background: '#ffffff', padding: '6px', borderRadius: '6px', display: 'inline-flex', color: '#000000' }}>
                    <QrCode size={48} />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1.25rem' }}>
              <button onClick={() => window.print()} className="btn-secondary">
                <Printer size={16} /> Print Pass
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsPage;
