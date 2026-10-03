import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { fetchShowById } from '../services/api';
import {
  ChevronLeft,
  Ticket,
  Clock,
  Calendar,
  MapPin,
  AlertCircle,
  Armchair,
} from 'lucide-react';

// Seating configuration
const SEAT_ROWS = [
  { tier: 'Platinum', rows: ['G', 'F'] },
  { tier: 'Gold', rows: ['E', 'D', 'C'] },
  { tier: 'Silver', rows: ['B', 'A'] },
];
const SEATS_PER_ROW = 10;

const SeatSelectionPage = () => {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadShow = async () => {
      setLoading(true);
      try {
        const res = await fetchShowById(showId);
        if (res && res.data) {
          setShow(res.data);
        } else {
          setError('Show details not found.');
        }
      } catch (err) {
        console.error('Error fetching show for seat selection:', err);
        setError(err.message || 'Failed to load show details');
      } finally {
        setLoading(false);
      }
    };

    loadShow();
  }, [showId]);

  if (loading) {
    return (
      <div className="section-wrapper" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <h2>Loading Cinema Auditorium & Seat Layout...</h2>
      </div>
    );
  }

  if (error || !show) {
    return (
      <div className="section-wrapper" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <h2>{error || 'Show Not Found'}</h2>
        <Link to="/shows" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          Back to Shows
        </Link>
      </div>
    );
  }

  const movie = show.movieDetails || show.movie || {};
  const theatre = show.theatreDetails || show.theatre || {};
  const bookedSeats = show.bookedSeats || [];
  const prices = show.ticketPrice || { silver: 180, gold: 280, platinum: 420 };

  const getTierPrice = (tier) => {
    if (tier === 'Platinum') return prices.platinum || 420;
    if (tier === 'Gold') return prices.gold || 280;
    return prices.silver || 180;
  };

  const handleSeatClick = (seatCode, row, number, tier) => {
    if (bookedSeats.includes(seatCode)) return;

    const exists = selectedSeats.find((s) => s.seatNumber === seatCode);
    if (exists) {
      setSelectedSeats(selectedSeats.filter((s) => s.seatNumber !== seatCode));
    } else {
      if (selectedSeats.length >= 8) {
        alert('You can select a maximum of 8 seats per booking transaction.');
        return;
      }
      setSelectedSeats([
        ...selectedSeats,
        {
          seatNumber: seatCode,
          row,
          number,
          category: tier,
          price: getTierPrice(tier),
        },
      ]);
    }
  };

  const subtotal = selectedSeats.reduce((acc, curr) => acc + curr.price, 0);

  const handleProceed = () => {
    if (selectedSeats.length === 0) return;

    // Store in sessionStorage for review in Booking Summary
    const bookingPayload = {
      showId: show._id,
      movie,
      theatre,
      screenName: show.screenName,
      showDate: show.showDate,
      showTime: show.showTime,
      selectedSeats,
      subtotal,
      convenienceFee: 30,
      totalAmount: subtotal + 30,
    };

    sessionStorage.setItem('cinebook_pending_booking', JSON.stringify(bookingPayload));
    navigate('/booking/summary');
  };

  return (
    <div className="seat-selection-container">
      {/* Header Info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <button
            onClick={() => navigate(-1)}
            style={{
              background: 'transparent',
              color: '#94a3b8',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.85rem',
              marginBottom: '0.5rem',
            }}
          >
            <ChevronLeft size={16} /> Back
          </button>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>{movie.title}</h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} color="#e11d48" /> {theatre.name} ({show.screenName})
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={14} /> {show.showDate}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={14} /> {show.showTime}
            </span>
          </p>
        </div>

        <div style={{ background: '#161f30', border: '1px solid var(--border-color)', padding: '0.6rem 1.25rem', borderRadius: '10px', textAlign: 'right' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Tickets Selected</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
            {selectedSeats.length} / 8
          </div>
        </div>
      </div>

      {/* Screen Curved Indicator */}
      <div className="screen-curved-wrapper">
        <div className="screen-curved"></div>
        <div className="screen-caption">All Eyes This Way • Cinema Screen</div>
      </div>

      {/* Seating Tiers Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', marginBottom: '6rem' }}>
        {SEAT_ROWS.map(({ tier, rows }) => (
          <div key={tier} className="seat-tier-section">
            <div className="seat-tier-header">
              <span className="tier-name">{tier} Tier</span>
              <span className="tier-price">₹{getTierPrice(tier)} / ticket</span>
            </div>

            <div className="seat-grid-rows">
              {rows.map((row) => (
                <div key={row} className="seat-row">
                  <span className="seat-row-label">{row}</span>
                  <div className="seats-in-row">
                    {Array.from({ length: SEATS_PER_ROW }, (_, idx) => {
                      const seatNum = idx + 1;
                      const seatCode = `${row}${seatNum}`;
                      const isBooked = bookedSeats.includes(seatCode);
                      const isSelected = selectedSeats.some((s) => s.seatNumber === seatCode);

                      let seatClass = 'seat-btn available';
                      if (isBooked) seatClass = 'seat-btn booked';
                      else if (isSelected) seatClass = 'seat-btn selected';

                      return (
                        <button
                          key={seatCode}
                          className={seatClass}
                          disabled={isBooked}
                          onClick={() => handleSeatClick(seatCode, row, seatNum, tier)}
                          title={`${seatCode} (${tier}) - ₹${getTierPrice(tier)} ${isBooked ? '[BOOKED]' : ''}`}
                        >
                          {seatNum}
                        </button>
                      );
                    })}
                  </div>
                  <span className="seat-row-label">{row}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Seat Legend */}
      <div className="seat-legend">
        <div className="legend-item">
          <div className="legend-box" style={{ background: 'rgba(255, 255, 255, 0.08)', border: '1px solid rgba(255, 255, 255, 0.2)' }}></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: '#10b981', border: '1px solid #059669' }}></div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="legend-box" style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgba(239, 68, 68, 0.3)' }}></div>
          <span>Booked / Reserved</span>
        </div>
      </div>

      {/* Floating Bottom Booking Action Bar */}
      {selectedSeats.length > 0 && (
        <div className="booking-bottom-bar">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1rem', fontWeight: 700, color: '#f8fafc' }}>
                {selectedSeats.map((s) => s.seatNumber).join(', ')}
              </span>
              <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                ({selectedSeats.length} {selectedSeats.length === 1 ? 'seat' : 'seats'})
              </span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b', marginTop: '2px' }}>
              Subtotal: ₹{subtotal}
            </div>
          </div>

          <button
            onClick={handleProceed}
            className="btn-primary"
            style={{ padding: '0.75rem 2rem', fontSize: '1rem' }}
          >
            <Ticket size={18} /> Proceed to Summary
          </button>
        </div>
      )}
    </div>
  );
};

export default SeatSelectionPage;
