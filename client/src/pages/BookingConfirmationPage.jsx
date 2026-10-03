import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchBookingById } from '../services/api';
import {
  CheckCircle,
  Printer,
  Ticket,
  MapPin,
  Calendar,
  Clock,
  Film,
  ArrowRight,
  QrCode,
} from 'lucide-react';

const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadBooking = async () => {
      setLoading(true);
      try {
        const res = await fetchBookingById(bookingId);
        if (res && res.data) {
          setBooking(res.data);
        } else {
          setError('Booking record not found');
        }
      } catch (err) {
        console.error('Error fetching confirmed booking:', err);
        setError(err.message || 'Failed to load booking');
      } finally {
        setLoading(false);
      }
    };

    loadBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="section-wrapper" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <h2>Generating Your Cinema E-Ticket...</h2>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="section-wrapper" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <h2>{error || 'Booking Not Found'}</h2>
        <Link to="/movies" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          Explore Movies
        </Link>
      </div>
    );
  }

  const movie = booking.movieDetails || booking.movie || {};
  const theatre = booking.theatreDetails || booking.theatre || {};

  return (
    <div className="section-wrapper" style={{ maxWidth: '780px' }}>
      {/* Success Banner */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
          }}
        >
          <CheckCircle size={36} />
        </div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Booking Confirmed!</h1>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginTop: '0.25rem' }}>
          Your digital movie pass has been reserved. Show this QR code at the cinema gate.
        </p>
      </div>

      {/* Modern Cinema Pass / E-Ticket */}
      <div className="eticket-container">
        {/* Ticket Header */}
        <div className="eticket-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Film size={22} color="#ffffff" />
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
              Cine<span style={{ color: '#fed7aa' }}>Book</span> PASS
            </span>
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, background: 'rgba(0,0,0,0.25)', padding: '0.3rem 0.75rem', borderRadius: '999px', color: '#ffffff' }}>
            ID: {booking.bookingId}
          </span>
        </div>

        {/* Ticket Body */}
        <div className="eticket-body">
          <img
            src={movie.posterUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=300&q=80'}
            alt={movie.title}
            style={{ width: '130px', height: '185px', objectFit: 'cover', borderRadius: '10px' }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>{movie.title}</h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '2px' }}>
                {movie.language} • {movie.genre?.join(', ')} • {movie.certificate || 'UA'}
              </p>
            </div>

            <div style={{ fontSize: '0.88rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={15} color="#e11d48" /> {theatre.name} ({booking.screenName})
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} /> {booking.showDate}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={15} /> {booking.showTime}
              </span>
            </div>

            <div
              style={{
                marginTop: 'auto',
                padding: '0.6rem 0.9rem',
                background: 'rgba(255, 255, 255, 0.04)',
                borderRadius: '8px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Reserved Seats</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8', marginTop: '2px' }}>
                {booking.selectedSeats?.map((s) => s.seatNumber).join(', ')} ({booking.numberOfTickets} Tickets)
              </div>
            </div>
          </div>
        </div>

        {/* Perforation Divider */}
        <div className="eticket-perforation"></div>

        {/* Ticket Footer / QR Barcode */}
        <div className="eticket-footer">
          <div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase' }}>Amount Paid</div>
            <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#f59e0b' }}>
              ₹{booking.totalAmount}
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
              Via {booking.paymentMethod}
            </div>
          </div>

          {/* QR Code Graphic Simulation */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                background: '#ffffff',
                padding: '8px',
                borderRadius: '8px',
                display: 'inline-flex',
                color: '#000000',
              }}
            >
              <QrCode size={56} />
            </div>
            <div style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: '4px' }}>SCAN AT GATE</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => window.print()} className="btn-secondary">
          <Printer size={16} /> Print / Save E-Ticket
        </button>
        <Link to="/bookings" className="btn-primary">
          <Ticket size={16} /> View in My Bookings
        </Link>
        <Link to="/movies" className="btn-secondary">
          <span>Book More Movies</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
