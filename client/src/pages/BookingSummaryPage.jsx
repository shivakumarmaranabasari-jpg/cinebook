import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createBookingApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ChevronLeft,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  CreditCard,
  ShieldCheck,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';

const BookingSummaryPage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [bookingData, setBookingData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI (Google Pay / PhonePe)');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('cinebook_pending_booking');
    if (!raw) {
      navigate('/movies');
      return;
    }
    try {
      setBookingData(JSON.parse(raw));
    } catch {
      navigate('/movies');
    }
  }, [navigate]);

  if (!bookingData) {
    return (
      <div className="section-wrapper" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <h2>Loading booking summary...</h2>
      </div>
    );
  }

  const {
    showId,
    movie,
    theatre,
    screenName,
    showDate,
    showTime,
    selectedSeats,
    subtotal,
    convenienceFee = 30,
    totalAmount,
  } = bookingData;

  const handleConfirmBooking = async () => {
    if (!isAuthenticated) {
      alert('Please log in or create an account to confirm your movie ticket reservation.');
      navigate('/login?redirect=/booking/summary');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        showId,
        movieId: movie._id,
        theatreId: theatre._id,
        screenName,
        showDate,
        showTime,
        selectedSeats,
        subtotal,
        convenienceFee,
        totalAmount,
        paymentMethod,
      };

      const res = await createBookingApi(payload);
      if (res && res.data) {
        // Clear pending booking
        sessionStorage.removeItem('cinebook_pending_booking');
        navigate(`/booking/confirmation/${res.data.bookingId || res.data._id}`);
      }
    } catch (err) {
      console.error('Booking confirmation failed:', err);
      setError(err.message || 'Booking failed. One or more seats might be booked already.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-wrapper" style={{ maxWidth: '960px' }}>
      <button
        onClick={() => navigate(-1)}
        style={{
          background: 'transparent',
          color: '#94a3b8',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '0.88rem',
          marginBottom: '1.5rem',
        }}
      >
        <ChevronLeft size={16} /> Back to Seat Selection
      </button>

      <h1 className="section-title" style={{ marginBottom: '1.5rem' }}>
        Booking Summary & Checkout
      </h1>

      {error && (
        <div className="alert-box alert-error">
          <AlertCircle size={20} />
          <div>
            <strong>Booking Notice:</strong> {error}
            <div style={{ marginTop: '0.25rem' }}>
              <Link to={`/booking/seats/${showId}`} style={{ textDecoration: 'underline', fontWeight: 600 }}>
                Choose different seats
              </Link>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr', gap: '2rem' }}>
        {/* Left Column: Movie & Ticket Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Movie Card Header */}
          <div
            style={{
              background: '#161f30',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '1.5rem',
              display: 'flex',
              gap: '1.25rem',
              alignItems: 'center',
            }}
          >
            <img
              src={movie.posterUrl}
              alt={movie.title}
              style={{ width: '80px', height: '115px', objectFit: 'cover', borderRadius: '8px' }}
            />
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>{movie.title}</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px' }}>
                {movie.language} • {movie.genre?.join(', ')} • {movie.certificate || 'UA'}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '0.75rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <MapPin size={14} color="#e11d48" /> {theatre.name} ({screenName})
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={14} /> {showDate} • <Clock size={14} /> {showTime}
                </span>
              </div>
            </div>
          </div>

          {/* Selected Seats Table */}
          <div
            style={{
              background: '#161f30',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '1.5rem',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>
              Reserved Seats ({selectedSeats.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {selectedSeats.map((s) => (
                <div
                  key={s.seatNumber}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0.6rem 0.8rem',
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                  }}
                >
                  <span style={{ fontWeight: 700, color: '#f8fafc' }}>
                    Seat {s.seatNumber} ({s.category} Tier)
                  </span>
                  <span style={{ fontWeight: 700, color: '#f59e0b' }}>₹{s.price}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Contact Confirmation */}
          <div
            style={{
              background: '#161f30',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '1.5rem',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Ticket Holder Information
            </h3>
            {isAuthenticated ? (
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <p><strong>Name:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Mobile:</strong> {user?.phone || '+91 98765 43210'}</p>
                <span style={{ color: '#10b981', fontSize: '0.8rem', marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <CheckCircle size={14} /> E-Ticket and QR Pass will be dispatched instantly upon confirmation.
                </span>
              </div>
            ) : (
              <div>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  You are currently checking out as guest. Please log in to complete payment and store your tickets.
                </p>
                <Link to="/login" className="btn-secondary" style={{ display: 'inline-flex' }}>
                  Sign In to Continue
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Price Breakdown & Payment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Order Total Breakdown */}
          <div
            style={{
              background: '#161f30',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '1.5rem',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem' }}>
              Price Breakdown
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span>Tickets Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span>Convenience Fee & GST</span>
                <span>₹{convenienceFee}</span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  paddingTop: '1rem',
                  borderTop: '1px solid var(--border-color)',
                  fontSize: '1.25rem',
                  fontWeight: 800,
                  color: '#f8fafc',
                }}
              >
                <span>Total Payable</span>
                <span style={{ color: '#f59e0b' }}>₹{totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div
            style={{
              background: '#161f30',
              border: '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '1.5rem',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CreditCard size={18} color="#e11d48" /> Select Payment Mode
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                'UPI (Google Pay / PhonePe / Paytm)',
                'Credit / Debit Card (Visa, Mastercard, RuPay)',
                'Net Banking (All Indian Banks)',
              ].map((mode) => (
                <label
                  key={mode}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: paymentMethod === mode ? '1px solid #e11d48' : '1px solid rgba(255, 255, 255, 0.08)',
                    background: paymentMethod === mode ? 'rgba(225, 29, 72, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                    cursor: 'pointer',
                    fontSize: '0.88rem',
                  }}
                >
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === mode}
                    onChange={() => setPaymentMethod(mode)}
                    style={{ accentColor: '#e11d48' }}
                  />
                  <span>{mode}</span>
                </label>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <button
                onClick={handleConfirmBooking}
                disabled={loading}
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '0.85rem', fontSize: '1rem' }}
              >
                {loading ? 'Processing Reservation...' : `Pay ₹${totalAmount} & Confirm Booking`}
              </button>
            </div>

            <p style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', fontSize: '0.78rem', color: '#64748b', marginTop: '1rem' }}>
              <ShieldCheck size={14} color="#10b981" /> 256-bit SSL Encrypted Cinema Checkout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSummaryPage;
