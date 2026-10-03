import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Ticket, Star, Clock, Sparkles, ShieldCheck, Zap, Headphones, ArrowRight } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import { fetchMovies } from '../services/api';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Drama', 'Adventure', 'Animation'];

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMovies = async () => {
      setLoading(true);
      try {
        const response = await fetchMovies({ genre: selectedGenre });
        if (response && response.data) {
          setMovies(response.data);
        }
      } catch (err) {
        console.error('Failed to load movies:', err);
        setError('Could not connect to the movie service. Ensure the backend server is running.');
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [selectedGenre]);

  const featuredMovie = movies[0] || {
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    rating: 8.6,
    durationMinutes: 166,
    language: 'English',
    bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80',
    _id: 'featured-1',
  };

  return (
    <div>
      {/* Hero Showcase Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `url(${featuredMovie.bannerUrl || 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80'})`,
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} /> Spotlight Premiere
          </div>
          <h1 className="hero-title">{featuredMovie.title}</h1>
          <div className="hero-meta">
            <span className="hero-meta-item rating-badge">
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              {featuredMovie.rating} / 10
            </span>
            <span className="hero-meta-item">
              <Clock size={16} />
              {Math.floor(featuredMovie.durationMinutes / 60)}h {featuredMovie.durationMinutes % 60}m
            </span>
            <span className="hero-meta-item">{featuredMovie.language}</span>
          </div>
          <p className="hero-desc">{featuredMovie.description}</p>
          <div className="hero-buttons">
            <Link to={`/movie/${featuredMovie._id}`} className="btn-primary">
              <Ticket size={18} /> Book Tickets Now
            </Link>
            <Link to="/movies" className="btn-secondary">
              Browse All Movies
            </Link>
          </div>
        </div>
      </section>

      {/* Genre Filter Bar */}
      <div className="filters-bar">
        <div className="category-pills">
          {GENRES.map((genre) => (
            <button
              key={genre}
              className={`pill-btn ${selectedGenre === genre ? 'active' : ''}`}
              onClick={() => setSelectedGenre(genre)}
            >
              {genre}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
          Showing: <strong style={{ color: '#f8fafc' }}>{movies.length}</strong> movies
        </div>
      </div>

      {/* Now Showing Movies Grid */}
      <main className="section-wrapper">
        <div className="section-header">
          <div>
            <h2 className="section-title">Now Showing in Theatres</h2>
            <p className="section-subtitle">Experience the magic of cinema on the big screen</p>
          </div>
          <Link to="/movies" className="view-all-link">
            <span>Explore full catalogue</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem 0', color: '#94a3b8' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Loading Cinema Schedule...</div>
            <p>Fetching movies from Express & MongoDB backend</p>
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <p style={{ color: '#ef4444', fontWeight: 600 }}>{error}</p>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>
              Backend expected on port 5000 (`npm run dev` in backend directory).
            </p>
          </div>
        ) : (
          <div className="movie-grid">
            {movies.map((movie) => (
              <MovieCard key={movie._id || movie.title} movie={movie} />
            ))}
          </div>
        )}
      </main>

      {/* Why Choose CineBook Features */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <Zap size={24} />
            </div>
            <h3 className="feature-title">Instant M-Tickets</h3>
            <p className="feature-desc">Skip box-office queues with instant QR code entry on your phone.</p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <Headphones size={24} />
            </div>
            <h3 className="feature-title">Dolby Atmos Audio</h3>
            <p className="feature-desc">Find screenings certified for immersive 360-degree surround sound.</p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <ShieldCheck size={24} />
            </div>
            <h3 className="feature-title">100% Secure Checkout</h3>
            <p className="feature-desc">Encrypted transactions, instant refund guarantees, and zero booking friction.</p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <Ticket size={24} />
            </div>
            <h3 className="feature-title">Interactive Seat Map</h3>
            <p className="feature-desc">Pick your favorite recliner, premium, or executive seats with real-time seat locks.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
