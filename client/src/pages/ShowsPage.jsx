import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchShows, fetchMovies, fetchTheatres } from '../services/api';
import { Calendar, Clock, MapPin, Film, Ticket } from 'lucide-react';

const ShowsPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [shows, setShows] = useState([]);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedMovie, setSelectedMovie] = useState(searchParams.get('movieId') || 'All');
  const [selectedTheatre, setSelectedTheatre] = useState(searchParams.get('theatreId') || 'All');

  // Date selection tabs
  const dateTabs = Array.from({ length: 4 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
    const formatted = d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
    return { dateStr, label, formatted };
  });

  const [selectedDate, setSelectedDate] = useState(dateTabs[0].dateStr);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const [showsRes, moviesRes, theatresRes] = await Promise.all([
          fetchShows(),
          fetchMovies(),
          fetchTheatres(),
        ]);

        if (showsRes && showsRes.data) setShows(showsRes.data);
        if (moviesRes && moviesRes.data) setMovies(moviesRes.data);
        if (theatresRes && theatresRes.data) setTheatres(theatresRes.data);
      } catch (err) {
        console.error('Error fetching shows data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filter shows based on state
  const filteredShows = shows.filter((s) => {
    const matchesDate = !selectedDate || s.showDate === selectedDate;
    const matchesMovie =
      selectedMovie === 'All' ||
      String(s.movie) === String(selectedMovie) ||
      String(s.movie?._id) === String(selectedMovie);
    const matchesTheatre =
      selectedTheatre === 'All' ||
      String(s.theatre) === String(selectedTheatre) ||
      String(s.theatre?._id) === String(selectedTheatre);
    return matchesDate && matchesMovie && matchesTheatre;
  });

  return (
    <div className="section-wrapper">
      <div className="section-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
        <h1 className="section-title">Cinema Showtimes & Schedules</h1>
        <p className="section-subtitle">
          Browse upcoming screenings by date, multiplex, or movie and pick your seats.
        </p>
      </div>

      {/* Date Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', marginBottom: '1.75rem', paddingBottom: '0.25rem' }}>
        {dateTabs.map((t) => (
          <button
            key={t.dateStr}
            onClick={() => setSelectedDate(t.dateStr)}
            style={{
              padding: '0.65rem 1.25rem',
              borderRadius: '10px',
              border: selectedDate === t.dateStr ? '1px solid #e11d48' : '1px solid var(--border-color)',
              background: selectedDate === t.dateStr ? 'rgba(225, 29, 72, 0.18)' : 'rgba(255, 255, 255, 0.04)',
              color: selectedDate === t.dateStr ? '#fb7185' : '#94a3b8',
              cursor: 'pointer',
              textAlign: 'center',
              minWidth: '110px',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>{t.label}</div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, marginTop: '2px', color: '#f8fafc' }}>{t.formatted}</div>
          </button>
        ))}
      </div>

      {/* Filter Dropdowns */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
        <select
          value={selectedMovie}
          onChange={(e) => setSelectedMovie(e.target.value)}
          style={{
            background: '#161f30',
            color: '#f8fafc',
            border: '1px solid var(--border-color)',
            padding: '0.65rem 1rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            flex: '1',
            minWidth: '200px',
          }}
        >
          <option value="All">All Movies</option>
          {movies.map((m) => (
            <option key={m._id} value={m._id}>
              {m.title}
            </option>
          ))}
        </select>

        <select
          value={selectedTheatre}
          onChange={(e) => setSelectedTheatre(e.target.value)}
          style={{
            background: '#161f30',
            color: '#f8fafc',
            border: '1px solid var(--border-color)',
            padding: '0.65rem 1rem',
            borderRadius: '8px',
            fontSize: '0.9rem',
            flex: '1',
            minWidth: '200px',
          }}
        >
          <option value="All">All Theatres</option>
          {theatres.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name} ({t.city})
            </option>
          ))}
        </select>
      </div>

      {/* Shows List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
          <h3>Loading Cinema Schedules...</h3>
        </div>
      ) : filteredShows.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: '#94a3b8' }}>
          <Calendar size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No showtimes available for the selected filters</h3>
          <p style={{ marginTop: '0.5rem' }}>Try choosing another date or multiplex.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '1.5rem' }}>
          {filteredShows.map((show) => {
            const movieObj = show.movieDetails || show.movie || {};
            const theatreObj = show.theatreDetails || show.theatre || {};
            return (
              <div
                key={show._id}
                style={{
                  background: '#161f30',
                  border: '1px solid var(--border-color)',
                  borderRadius: '14px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <img
                    src={movieObj.posterUrl || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=200&q=80'}
                    alt={movieObj.title}
                    style={{ width: '60px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>
                      {movieObj.title || 'Movie'}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                      <MapPin size={13} color="#e11d48" /> {theatreObj.name || 'Theatre'}
                    </p>
                    <span
                      style={{
                        display: 'inline-block',
                        marginTop: '6px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: '#38bdf8',
                      }}
                    >
                      {show.screenName || 'Audi 1'}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingTop: '0.75rem',
                    borderTop: '1px solid var(--border-color)',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#cbd5e1', fontWeight: 700, fontSize: '1rem' }}>
                      <Clock size={16} color="#f59e0b" />
                      <span>{show.showTime}</span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '2px' }}>
                      Silver ₹{show.ticketPrice?.silver || 180} • Gold ₹{show.ticketPrice?.gold || 280}
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/booking/seats/${show._id}`)}
                    className="btn-primary"
                    style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
                  >
                    <Ticket size={15} /> Select Seats
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShowsPage;
