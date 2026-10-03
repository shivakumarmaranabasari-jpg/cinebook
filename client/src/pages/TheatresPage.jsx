import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTheatres, fetchShows } from '../services/api';
import { MapPin, Film, Sparkles, Calendar, ChevronRight } from 'lucide-react';

const CITIES = ['All', 'Bengaluru', 'Mumbai', 'Delhi'];

const TheatresPage = () => {
  const [theatres, setTheatres] = useState([]);
  const [selectedCity, setSelectedCity] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTheatres = async () => {
      setLoading(true);
      try {
        const res = await fetchTheatres({ city: selectedCity });
        if (res && res.data) {
          setTheatres(res.data);
        }
      } catch (err) {
        console.error('Error fetching theatres:', err);
      } finally {
        setLoading(false);
      }
    };

    loadTheatres();
  }, [selectedCity]);

  return (
    <div className="section-wrapper">
      <div className="section-header" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.5rem' }}>
        <h1 className="section-title">Partner Theatres & Multiplexes</h1>
        <p className="section-subtitle">
          Experience world-class IMAX 4K Laser, Dolby Atmos, and 4DX immersive auditoriums.
        </p>
      </div>

      {/* City Filters */}
      <div className="category-pills" style={{ marginBottom: '2rem' }}>
        {CITIES.map((c) => (
          <button
            key={c}
            className={`pill-btn ${selectedCity === c ? 'active' : ''}`}
            onClick={() => setSelectedCity(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
          <h3>Loading Multiplexes...</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.75rem' }}>
          {theatres.map((t) => (
            <div
              key={t._id || t.name}
              style={{
                background: '#161f30',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s, border-color 0.2s',
              }}
            >
              <div style={{ height: '160px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={t.image || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80'}
                  alt={t.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, #161f30 0%, transparent 80%)' }} />
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    background: 'rgba(11, 15, 25, 0.85)',
                    padding: '0.25rem 0.6rem',
                    borderRadius: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: '#38bdf8',
                  }}
                >
                  {t.totalScreens || 4} Screens
                </span>
              </div>

              <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <h3 style={{ color: '#f8fafc', fontSize: '1.25rem', marginBottom: '0.4rem', fontWeight: 700 }}>
                  {t.name}
                </h3>
                <p style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94a3b8', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                  <MapPin size={15} color="#e11d48" /> {t.address || t.city}
                </p>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  {t.facilities?.map((f) => (
                    <span
                      key={f}
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: '#93c5fd',
                        padding: '0.25rem 0.6rem',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}
                    >
                      <Sparkles size={11} style={{ display: 'inline', marginRight: '4px' }} />
                      {f}
                    </span>
                  ))}
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                  <button
                    onClick={() => navigate(`/shows?theatreId=${t._id}`)}
                    className="btn-primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    <Calendar size={16} /> View Scheduled Shows
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TheatresPage;
