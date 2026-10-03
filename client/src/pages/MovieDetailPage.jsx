import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchMovieById, fetchShows, fetchTheatres } from '../services/api';
import {
  Star,
  Clock,
  Calendar,
  Ticket,
  ChevronLeft,
  Play,
  X,
  MapPin,
  Sparkles,
  Info,
} from 'lucide-react';

const MovieDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [showTrailerModal, setShowTrailerModal] = useState(false);

  // Generate date tabs: Today, Tomorrow, +2 days, +3 days
  const dateTabs = Array.from({ length: 4 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const formatted = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    return { dateStr, dayLabel, formatted };
  });

  useEffect(() => {
    if (dateTabs.length > 0 && !selectedDate) {
      setSelectedDate(dateTabs[0].dateStr);
    }
  }, []);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      try {
        const [movieRes, showsRes, theatresRes] = await Promise.all([
          fetchMovieById(id),
          fetchShows({ movieId: id }),
          fetchTheatres(),
        ]);

        if (movieRes && movieRes.data) {
          setMovie(movieRes.data);
        }
        if (showsRes && showsRes.data) {
          setShows(showsRes.data);
        }
        if (theatresRes && theatresRes.data) {
          setTheatres(theatresRes.data);
        }
      } catch (err) {
        console.error('Error loading movie details & shows:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [id]);

  // Extract YouTube video ID for embed
  const getEmbedUrl = (url) => {
    if (!url) return '';
    try {
      if (url.includes('embed/')) return url;
      const vParam = new URL(url).searchParams.get('v');
      if (vParam) return `https://www.youtube.com/embed/${vParam}?autoplay=1`;
      const shortId = url.split('youtu.be/')[1];
      if (shortId) return `https://www.youtube.com/embed/${shortId}?autoplay=1`;
    } catch {
      // fallback
    }
    return 'https://www.youtube.com/embed/Way9Dexny3w?autoplay=1';
  };

  if (loading) {
    return (
      <div className="section-wrapper" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <h2>Loading Cinema Details...</h2>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="section-wrapper" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <h2>Movie Not Found</h2>
        <Link to="/movies" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          Back to Movies
        </Link>
      </div>
    );
  }

  // Filter shows by selected date
  const filteredShows = shows.filter(
    (s) => !selectedDate || s.showDate === selectedDate
  );

  // Group shows by theatre
  const showsByTheatre = theatres
    .map((theatre) => {
      const theatreShows = filteredShows.filter(
        (s) => String(s.theatre) === String(theatre._id) || String(s.theatre?._id) === String(theatre._id)
      );
      return { theatre, shows: theatreShows };
    })
    .filter((item) => item.shows.length > 0);

  return (
    <div>
      {/* Detail Hero Banner */}
      <section
        className="movie-detail-hero"
        style={{
          backgroundImage: `url(${movie.bannerUrl || movie.posterUrl})`,
        }}
      >
        <div className="movie-detail-overlay"></div>
        <div className="movie-detail-container">
          <img src={movie.posterUrl} alt={movie.title} className="detail-poster" />
          <div className="detail-info">
            <Link
              to="/movies"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: '#94a3b8',
                fontSize: '0.85rem',
                marginBottom: '0.75rem',
              }}
            >
              <ChevronLeft size={16} /> Back to all movies
            </Link>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.2 }}>
              {movie.title}
            </h1>

            <div
              style={{
                display: 'flex',
                gap: '1.25rem',
                alignItems: 'center',
                flexWrap: 'wrap',
                color: '#cbd5e1',
                fontSize: '0.92rem',
                marginBottom: '1rem',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b', fontWeight: 700 }}>
                <Star size={16} fill="#f59e0b" /> {movie.rating} / 10
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={16} /> {Math.floor((movie.durationMinutes || 150) / 60)}h {(movie.durationMinutes || 150) % 60}m
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={16} /> {movie.releaseDate || 'In Theatres'}
              </span>
              <span>{movie.language}</span>
              <span
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                }}
              >
                {movie.certificate || 'UA'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {movie.genre?.map((g) => (
                <span
                  key={g}
                  style={{
                    fontSize: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '4px',
                    fontWeight: 600,
                  }}
                >
                  {g}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowTrailerModal(true)}
                className="btn-secondary"
                style={{ gap: '0.4rem' }}
              >
                <Play size={16} fill="#ffffff" /> Watch Trailer
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trailer Modal */}
      {showTrailerModal && (
        <div className="modal-overlay" onClick={() => setShowTrailerModal(false)}>
          <div
            className="modal-content"
            style={{ maxWidth: '800px', padding: '1rem', background: '#0b0f19' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.1rem' }}>{movie.title} - Official Trailer</h3>
              <button
                onClick={() => setShowTrailerModal(false)}
                style={{ background: 'transparent', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '8px' }}>
              <iframe
                title="Movie Trailer"
                src={getEmbedUrl(movie.trailerUrl)}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Content: Synopsis & Showtimes */}
      <div className="section-wrapper">
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '3rem' }}>
          {/* Left Column: Synopsis, Cast, Director */}
          <div>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '0.75rem' }}>Synopsis</h2>
            <p style={{ color: '#cbd5e1', lineHeight: '1.75', fontSize: '1rem', marginBottom: '2.5rem' }}>
              {movie.description}
            </p>

            {movie.cast && movie.cast.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>Key Cast</h3>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  {movie.cast.map((actor) => (
                    <span
                      key={actor}
                      style={{
                        background: '#1e293b',
                        padding: '0.5rem 0.9rem',
                        borderRadius: '8px',
                        fontSize: '0.88rem',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                      }}
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {movie.director && (
              <div>
                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.35rem' }}>Director</h3>
                <p style={{ color: '#94a3b8' }}>{movie.director}</p>
              </div>
            )}
          </div>

          {/* Right Column: Shows & Theatres Booking Section */}
          <div>
            <div style={{ background: '#161f30', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <Ticket size={22} color="#e11d48" />
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Book Tickets</h2>
              </div>

              {/* Date Tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
                {dateTabs.map((tab) => (
                  <button
                    key={tab.dateStr}
                    onClick={() => setSelectedDate(tab.dateStr)}
                    style={{
                      padding: '0.6rem 0.3rem',
                      borderRadius: '8px',
                      textAlign: 'center',
                      background: selectedDate === tab.dateStr ? 'rgba(225, 29, 72, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                      border: selectedDate === tab.dateStr ? '1px solid #e11d48' : '1px solid rgba(255, 255, 255, 0.08)',
                      color: selectedDate === tab.dateStr ? '#fb7185' : '#94a3b8',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700 }}>{tab.dayLabel}</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, marginTop: '2px', color: '#f8fafc' }}>{tab.formatted}</div>
                  </button>
                ))}
              </div>

              {/* Showtimes per Theatre */}
              {showsByTheatre.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '8px' }}>
                  <Info size={28} style={{ color: '#64748b', margin: '0 auto 0.5rem' }} />
                  <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                    No shows scheduled for {selectedDate}.
                  </p>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    Try selecting another date above.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {showsByTheatre.map(({ theatre, shows }) => (
                    <div
                      key={theatre._id}
                      style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        borderRadius: '10px',
                        padding: '1rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>{theatre.name}</h4>
                          <p style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <MapPin size={12} /> {theatre.city}
                          </p>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          M-Ticket Available
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                        {shows.map((show) => (
                          <button
                            key={show._id}
                            onClick={() => navigate(`/booking/seats/${show._id}`)}
                            title={`Select seats for ${show.showTime} at ${theatre.name}`}
                            style={{
                              background: 'rgba(255, 255, 255, 0.06)',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              borderRadius: '6px',
                              padding: '0.5rem 0.8rem',
                              color: '#f8fafc',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              transition: 'all 0.18s ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#e11d48';
                              e.currentTarget.style.background = 'rgba(225, 29, 72, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                            }}
                          >
                            <span style={{ fontSize: '0.88rem', fontWeight: 700 }}>{show.showTime}</span>
                            <span style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '2px' }}>
                              ₹{show.ticketPrice?.silver || 180}+
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
