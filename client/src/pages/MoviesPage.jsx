import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import { fetchMovies } from '../services/api';
import { Search, SlidersHorizontal, Film } from 'lucide-react';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Animation', 'Biography'];
const LANGUAGES = ['All', 'English', 'Hindi', 'Telugu'];

const MoviesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('all'); // 'all', 'now_showing', 'upcoming'
  const [searchInput, setSearchInput] = useState(initialSearch);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = {
          genre: selectedGenre,
          search: searchInput,
        };
        if (selectedStatus !== 'all') {
          params.status = selectedStatus;
        }

        const res = await fetchMovies(params);
        if (res && res.data) {
          let filtered = res.data;
          if (selectedLanguage !== 'All') {
            filtered = filtered.filter((m) =>
              m.language.toLowerCase().includes(selectedLanguage.toLowerCase())
            );
          }
          setMovies(filtered);
        }
      } catch (err) {
        console.error('Error fetching movies catalogue:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedGenre, selectedLanguage, selectedStatus, searchInput]);

  return (
    <div className="section-wrapper">
      <div className="section-header" style={{ alignItems: 'flex-start', flexDirection: 'column', gap: '0.5rem' }}>
        <h1 className="section-title">All Movies in Theatres</h1>
        <p className="section-subtitle">
          Filter by genre, language, or status to reserve tickets instantly.
        </p>
      </div>

      {/* Status Tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
        <button
          onClick={() => setSelectedStatus('all')}
          style={{
            background: 'transparent',
            color: selectedStatus === 'all' ? '#e11d48' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.95rem',
            padding: '0.3rem 0.6rem',
            borderBottom: selectedStatus === 'all' ? '2px solid #e11d48' : 'none',
          }}
        >
          All Movies
        </button>
        <button
          onClick={() => setSelectedStatus('now_showing')}
          style={{
            background: 'transparent',
            color: selectedStatus === 'now_showing' ? '#e11d48' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.95rem',
            padding: '0.3rem 0.6rem',
            borderBottom: selectedStatus === 'now_showing' ? '2px solid #e11d48' : 'none',
          }}
        >
          Now Showing
        </button>
        <button
          onClick={() => setSelectedStatus('upcoming')}
          style={{
            background: 'transparent',
            color: selectedStatus === 'upcoming' ? '#e11d48' : '#94a3b8',
            fontWeight: 700,
            fontSize: '0.95rem',
            padding: '0.3rem 0.6rem',
            borderBottom: selectedStatus === 'upcoming' ? '2px solid #e11d48' : 'none',
          }}
        >
          Coming Soon
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            className="search-input"
            style={{ width: '100%', paddingLeft: '2.5rem' }}
            placeholder="Search movie title, director..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>

        {/* Language Filter */}
        <select
          value={selectedLanguage}
          onChange={(e) => setSelectedLanguage(e.target.value)}
          style={{
            background: '#161f30',
            color: '#f8fafc',
            border: '1px solid var(--border-color)',
            padding: '0.6rem 1rem',
            borderRadius: '999px',
            fontSize: '0.85rem',
            fontWeight: 600,
          }}
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang} style={{ background: '#111827' }}>
              Language: {lang}
            </option>
          ))}
        </select>

        {/* Genre Pills */}
        <div className="category-pills">
          {GENRES.map((g) => (
            <button
              key={g}
              className={`pill-btn ${selectedGenre === g ? 'active' : ''}`}
              onClick={() => setSelectedGenre(g)}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
          <h3>Loading Cinema Schedules...</h3>
        </div>
      ) : movies.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 0', color: '#94a3b8' }}>
          <Film size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
          <h3>No movies found</h3>
          <p style={{ marginTop: '0.5rem' }}>Try clearing filters or search terms.</p>
          <button
            onClick={() => {
              setSearchInput('');
              setSelectedGenre('All');
              setSelectedLanguage('All');
              setSelectedStatus('all');
            }}
            className="btn-secondary"
            style={{ marginTop: '1.25rem' }}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="movie-grid">
          {movies.map((m) => (
            <MovieCard key={m._id || m.title} movie={m} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MoviesPage;
