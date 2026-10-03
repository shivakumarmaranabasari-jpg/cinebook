import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket } from 'lucide-react';

const MovieCard = ({ movie }) => {
  const {
    _id,
    title,
    genre = [],
    language,
    durationMinutes,
    rating,
    posterUrl,
    price = 250,
  } = movie;

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  const formattedDuration = `${hours}h ${minutes}m`;

  return (
    <article className="movie-card">
      <div className="card-poster-wrapper">
        <img
          src={posterUrl}
          alt={title}
          className="card-poster"
          loading="lazy"
          onError={(e) => {
            // High reliability fallback poster
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div className="card-rating-tag">
          <Star size={13} fill="#f59e0b" color="#f59e0b" />
          <span>{rating ? rating.toFixed(1) : '8.0'}</span>
        </div>
        <div className="card-lang-tag">
          {language}
        </div>
      </div>

      <div className="card-content">
        <h3 className="card-title" title={title}>
          <Link to={`/movie/${_id}`}>{title}</Link>
        </h3>
        <p className="card-genre">
          {Array.isArray(genre) ? genre.join(' • ') : genre}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
          <Clock size={13} />
          <span>{formattedDuration}</span>
        </div>

        <div className="card-footer">
          <div className="card-price">
            From <span className="price-amount">₹{price}</span>
          </div>
          <Link to={`/movie/${_id}`} className="card-book-btn">
            <Ticket size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: '-2px' }} />
            Book
          </Link>
        </div>
      </div>
    </article>
  );
};

export default MovieCard;
