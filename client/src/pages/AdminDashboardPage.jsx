import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  fetchAdminStats,
  fetchAdminUsers,
  fetchMovies,
  createMovieApi,
  updateMovieApi,
  deleteMovieApi,
  fetchTheatres,
  createTheatreApi,
  updateTheatreApi,
  deleteTheatreApi,
  fetchShows,
  createShowApi,
  deleteShowApi,
  fetchBookings,
  cancelBookingApi,
} from '../services/api';
import {
  LayoutDashboard,
  Film,
  Building,
  Calendar,
  Ticket,
  Users,
  DollarSign,
  Plus,
  Trash2,
  Edit,
  X,
  AlertCircle,
  CheckCircle,
  ShieldAlert,
  Search,
} from 'lucide-react';

const AdminDashboardPage = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview'); // overview, movies, theatres, shows, bookings, users
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Stats Data
  const [stats, setStats] = useState({
    totalMovies: 0,
    totalTheatres: 0,
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
  });

  // Entities Data
  const [moviesList, setMoviesList] = useState([]);
  const [theatresList, setTheatresList] = useState([]);
  const [showsList, setShowsList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [usersList, setUsersList] = useState([]);

  // Modals state
  const [movieModalOpen, setMovieModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);
  const [movieFormData, setMovieFormData] = useState({
    title: '',
    description: '',
    genre: 'Action, Sci-Fi',
    language: 'English',
    durationMinutes: 150,
    releaseDate: '2025-01-01',
    rating: 8.5,
    posterUrl: '',
    bannerUrl: '',
    trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
    price: 300,
    certificate: 'UA',
  });

  const [theatreModalOpen, setTheatreModalOpen] = useState(false);
  const [editingTheatre, setEditingTheatre] = useState(null);
  const [theatreFormData, setTheatreFormData] = useState({
    name: '',
    city: 'Bengaluru',
    address: '',
    facilities: 'IMAX 4K, Dolby Atmos, Recliners, Food Court',
    totalScreens: 4,
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
  });

  const [showModalOpen, setShowModalOpen] = useState(false);
  const [showFormData, setShowFormData] = useState({
    movie: '',
    theatre: '',
    showDate: new Date().toISOString().split('T')[0],
    showTime: '06:00 PM',
    silverPrice: 180,
    goldPrice: 280,
    platinumPrice: 420,
    screenName: 'Audi 1 (IMAX 4K)',
  });

  // Load Admin Data
  const loadAllAdminData = async () => {
    if (!isAuthenticated || !isAdmin) return;
    setLoading(true);
    try {
      const [statsRes, moviesRes, theatresRes, showsRes, bookingsRes, usersRes] =
        await Promise.all([
          fetchAdminStats(),
          fetchMovies(),
          fetchTheatres(),
          fetchShows(),
          fetchBookings(),
          fetchAdminUsers(),
        ]);

      if (statsRes?.data) setStats(statsRes.data);
      if (moviesRes?.data) setMoviesList(moviesRes.data);
      if (theatresRes?.data) setTheatresList(theatresRes.data);
      if (showsRes?.data) setShowsList(showsRes.data);
      if (bookingsRes?.data) setBookingsList(bookingsRes.data);
      if (usersRes?.data) setUsersList(usersRes.data);
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
      setError(err.message || 'Error retrieving admin records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, [isAuthenticated, isAdmin]);

  // MOVIE CRUD HANDLERS
  const openAddMovieModal = () => {
    setEditingMovie(null);
    setMovieFormData({
      title: '',
      description: '',
      genre: 'Action, Sci-Fi',
      language: 'English',
      durationMinutes: 150,
      releaseDate: '2025-01-01',
      rating: 8.5,
      posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=600&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1400&q=80',
      trailerUrl: 'https://www.youtube.com/watch?v=Way9Dexny3w',
      price: 300,
      certificate: 'UA',
    });
    setMovieModalOpen(true);
  };

  const openEditMovieModal = (m) => {
    setEditingMovie(m);
    setMovieFormData({
      title: m.title || '',
      description: m.description || '',
      genre: Array.isArray(m.genre) ? m.genre.join(', ') : m.genre || '',
      language: m.language || 'English',
      durationMinutes: m.durationMinutes || 150,
      releaseDate: m.releaseDate || '2025-01-01',
      rating: m.rating || 8.0,
      posterUrl: m.posterUrl || '',
      bannerUrl: m.bannerUrl || '',
      trailerUrl: m.trailerUrl || '',
      price: m.price || 250,
      certificate: m.certificate || 'UA',
    });
    setMovieModalOpen(true);
  };

  const handleSaveMovie = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    try {
      const payload = {
        ...movieFormData,
        genre: movieFormData.genre.split(',').map((g) => g.trim()),
        durationMinutes: Number(movieFormData.durationMinutes),
        rating: Number(movieFormData.rating),
        price: Number(movieFormData.price),
      };

      if (editingMovie) {
        await updateMovieApi(editingMovie._id, payload);
        setSuccessMsg(`Movie "${payload.title}" updated successfully!`);
      } else {
        await createMovieApi(payload);
        setSuccessMsg(`Movie "${payload.title}" added to catalogue!`);
      }

      setMovieModalOpen(false);
      await loadAllAdminData();
    } catch (err) {
      setError(err.message || 'Failed to save movie');
    }
  };

  const handleDeleteMovie = async (movieId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    setError(null);
    try {
      await deleteMovieApi(movieId);
      setSuccessMsg(`Movie "${title}" deleted.`);
      await loadAllAdminData();
    } catch (err) {
      setError(err.message || 'Failed to delete movie');
    }
  };

  // THEATRE CRUD HANDLERS
  const openAddTheatreModal = () => {
    setEditingTheatre(null);
    setTheatreFormData({
      name: '',
      city: 'Bengaluru',
      address: '',
      facilities: 'IMAX 4K, Dolby Atmos, Recliners, Food Court',
      totalScreens: 4,
      image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
    });
    setTheatreModalOpen(true);
  };

  const openEditTheatreModal = (t) => {
    setEditingTheatre(t);
    setTheatreFormData({
      name: t.name || '',
      city: t.city || 'Bengaluru',
      address: t.address || '',
      facilities: Array.isArray(t.facilities) ? t.facilities.join(', ') : t.facilities || '',
      totalScreens: t.totalScreens || 4,
      image: t.image || '',
    });
    setTheatreModalOpen(true);
  };

  const handleSaveTheatre = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    try {
      const payload = {
        ...theatreFormData,
        facilities: theatreFormData.facilities.split(',').map((f) => f.trim()),
        totalScreens: Number(theatreFormData.totalScreens),
      };

      if (editingTheatre) {
        await updateTheatreApi(editingTheatre._id, payload);
        setSuccessMsg(`Theatre "${payload.name}" updated successfully!`);
      } else {
        await createTheatreApi(payload);
        setSuccessMsg(`Theatre "${payload.name}" added successfully!`);
      }

      setTheatreModalOpen(false);
      await loadAllAdminData();
    } catch (err) {
      setError(err.message || 'Failed to save theatre');
    }
  };

  const handleDeleteTheatre = async (theatreId, name) => {
    if (!window.confirm(`Are you sure you want to delete theatre "${name}"?`)) return;
    setError(null);
    try {
      await deleteTheatreApi(theatreId);
      setSuccessMsg(`Theatre "${name}" deleted.`);
      await loadAllAdminData();
    } catch (err) {
      setError(err.message || 'Failed to delete theatre');
    }
  };

  // SHOW CRUD HANDLERS
  const openAddShowModal = () => {
    setShowFormData({
      movie: moviesList[0]?._id || '',
      theatre: theatresList[0]?._id || '',
      showDate: new Date().toISOString().split('T')[0],
      showTime: '06:00 PM',
      silverPrice: 180,
      goldPrice: 280,
      platinumPrice: 420,
      screenName: 'Audi 1 (IMAX 4K)',
    });
    setShowModalOpen(true);
  };

  const handleSaveShow = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    try {
      const payload = {
        movie: showFormData.movie,
        theatre: showFormData.theatre,
        showDate: showFormData.showDate,
        showTime: showFormData.showTime,
        screenName: showFormData.screenName,
        ticketPrice: {
          silver: Number(showFormData.silverPrice),
          gold: Number(showFormData.goldPrice),
          platinum: Number(showFormData.platinumPrice),
        },
      };

      await createShowApi(payload);
      setSuccessMsg('Showtime created successfully!');
      setShowModalOpen(false);
      await loadAllAdminData();
    } catch (err) {
      setError(err.message || 'Failed to create show');
    }
  };

  const handleDeleteShow = async (showId) => {
    if (!window.confirm('Delete this showtime?')) return;
    try {
      await deleteShowApi(showId);
      setSuccessMsg('Showtime removed.');
      await loadAllAdminData();
    } catch (err) {
      setError(err.message || 'Failed to delete show');
    }
  };

  // CANCEL BOOKING (ADMIN)
  const handleAdminCancelBooking = async (bookingId) => {
    if (!window.confirm(`Admin Action: Cancel booking ${bookingId} and refund user?`)) return;
    try {
      await cancelBookingApi(bookingId);
      setSuccessMsg(`Booking ${bookingId} has been cancelled.`);
      await loadAllAdminData();
    } catch (err) {
      setError(err.message || 'Failed to cancel booking');
    }
  };

  // ACCESS CONTROL CHECK
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="section-wrapper" style={{ textAlign: 'center', padding: '6rem 1.5rem' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', background: '#161f30', padding: '3.5rem 2rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <ShieldAlert size={34} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Admin Privileges Required</h2>
          <p style={{ color: '#94a3b8', fontSize: '0.92rem', marginBottom: '2rem', lineHeight: '1.6' }}>
            You must be logged in as an administrator to access the CineBook management portal.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/login" className="btn-primary">
              Go to Sign In
            </Link>
            <Link to="/" className="btn-secondary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div style={{ padding: '0.5rem 0.75rem 1.25rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>
            CineBook Administration
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fb7185', marginTop: '2px' }}>
            Operations Portal
          </div>
        </div>

        <button
          onClick={() => setActiveTab('overview')}
          className={`admin-sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
          style={{ width: '100%', background: activeTab === 'overview' ? 'rgba(225, 29, 72, 0.15)' : 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <LayoutDashboard size={18} />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('movies')}
          className={`admin-sidebar-link ${activeTab === 'movies' ? 'active' : ''}`}
          style={{ width: '100%', background: activeTab === 'movies' ? 'rgba(225, 29, 72, 0.15)' : 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <Film size={18} />
          <span>Manage Movies</span>
        </button>

        <button
          onClick={() => setActiveTab('theatres')}
          className={`admin-sidebar-link ${activeTab === 'theatres' ? 'active' : ''}`}
          style={{ width: '100%', background: activeTab === 'theatres' ? 'rgba(225, 29, 72, 0.15)' : 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <Building size={18} />
          <span>Theatres & Screens</span>
        </button>

        <button
          onClick={() => setActiveTab('shows')}
          className={`admin-sidebar-link ${activeTab === 'shows' ? 'active' : ''}`}
          style={{ width: '100%', background: activeTab === 'shows' ? 'rgba(225, 29, 72, 0.15)' : 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <Calendar size={18} />
          <span>Manage Showtimes</span>
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`admin-sidebar-link ${activeTab === 'bookings' ? 'active' : ''}`}
          style={{ width: '100%', background: activeTab === 'bookings' ? 'rgba(225, 29, 72, 0.15)' : 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <Ticket size={18} />
          <span>Customer Bookings</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`admin-sidebar-link ${activeTab === 'users' ? 'active' : ''}`}
          style={{ width: '100%', background: activeTab === 'users' ? 'rgba(225, 29, 72, 0.15)' : 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <Users size={18} />
          <span>Registered Users</span>
        </button>
      </aside>

      {/* Main Admin Content Body */}
      <main className="admin-main">
        {/* Top Notifications */}
        {error && (
          <div className="alert-box alert-error">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert-box alert-success">
            <CheckCircle size={20} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Platform Summary & KPIs</h1>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
                Live overview of catalogue, reservations, multiplexes, and revenue.
              </p>
            </div>

            {/* KPI Cards */}
            <div className="admin-stats-grid">
              <div className="stat-kpi-card">
                <div className="stat-label">Total Movies</div>
                <div className="stat-value">{stats.totalMovies}</div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Catalogue titles</span>
              </div>

              <div className="stat-kpi-card">
                <div className="stat-label">Total Theatres</div>
                <div className="stat-value">{stats.totalTheatres}</div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Active multiplexes</span>
              </div>

              <div className="stat-kpi-card">
                <div className="stat-label">Total Users</div>
                <div className="stat-value">{stats.totalUsers}</div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Registered members</span>
              </div>

              <div className="stat-kpi-card">
                <div className="stat-label">Total Bookings</div>
                <div className="stat-value">{stats.totalBookings}</div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Reservations made</span>
              </div>

              <div className="stat-kpi-card">
                <div className="stat-label">Gross Revenue</div>
                <div className="stat-value" style={{ color: '#f59e0b' }}>₹{stats.totalRevenue}</div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Confirmed ticket sales</span>
              </div>
            </div>

            {/* Recent Bookings Feed */}
            <div className="admin-table-wrapper">
              <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Customer Bookings</h3>
                <button onClick={() => setActiveTab('bookings')} className="view-all-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                  View All Bookings
                </button>
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer</th>
                    <th>Movie</th>
                    <th>Seats</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(stats.recentBookings || []).map((b) => (
                    <tr key={b._id}>
                      <td style={{ fontWeight: 700 }}>{b.bookingId}</td>
                      <td>{b.userName || b.userEmail || 'Customer'}</td>
                      <td>{b.movieDetails?.title || 'Movie'}</td>
                      <td>{b.selectedSeats?.map((s) => s.seatNumber).join(', ')}</td>
                      <td style={{ fontWeight: 700, color: '#f59e0b' }}>₹{b.totalAmount}</td>
                      <td>
                        <span className={b.bookingStatus === 'confirmed' ? 'badge-confirmed' : 'badge-cancelled'}>
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. MANAGE MOVIES TAB */}
        {activeTab === 'movies' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Movie Catalogue</h1>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
                  Add, update, or remove movies showing across your cinema network.
                </p>
              </div>
              <button onClick={openAddMovieModal} className="btn-primary">
                <Plus size={16} /> Add New Movie
              </button>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Poster</th>
                    <th>Title</th>
                    <th>Genre</th>
                    <th>Language</th>
                    <th>Rating</th>
                    <th>Duration</th>
                    <th>Price</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {moviesList.map((m) => (
                    <tr key={m._id}>
                      <td>
                        <img
                          src={m.posterUrl}
                          alt={m.title}
                          style={{ width: '40px', height: '56px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      </td>
                      <td style={{ fontWeight: 700 }}>{m.title}</td>
                      <td>{Array.isArray(m.genre) ? m.genre.join(', ') : m.genre}</td>
                      <td>{m.language}</td>
                      <td style={{ color: '#f59e0b', fontWeight: 700 }}>★ {m.rating}</td>
                      <td>{m.durationMinutes}m</td>
                      <td>₹{m.price}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => openEditMovieModal(m)}
                            className="btn-secondary"
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                            title="Edit movie"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteMovie(m._id, m.title)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#f87171',
                              padding: '0.35rem 0.6rem',
                              borderRadius: '6px',
                              cursor: 'pointer',
                            }}
                            title="Delete movie"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. MANAGE THEATRES TAB */}
        {activeTab === 'theatres' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Multiplex Theatres</h1>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
                  Manage cinema complexes, auditorium counts, and amenities.
                </p>
              </div>
              <button onClick={openAddTheatreModal} className="btn-primary">
                <Plus size={16} /> Add Multiplex
              </button>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Theatre Name</th>
                    <th>City</th>
                    <th>Address</th>
                    <th>Screens</th>
                    <th>Key Facilities</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {theatresList.map((t) => (
                    <tr key={t._id}>
                      <td style={{ fontWeight: 700 }}>{t.name}</td>
                      <td>{t.city}</td>
                      <td style={{ maxWidth: '240px', fontSize: '0.82rem', color: '#cbd5e1' }}>{t.address}</td>
                      <td>{t.totalScreens || 4} Screens</td>
                      <td style={{ fontSize: '0.82rem' }}>
                        {Array.isArray(t.facilities) ? t.facilities.slice(0, 3).join(', ') : t.facilities}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => openEditTheatreModal(t)}
                            className="btn-secondary"
                            style={{ padding: '0.35rem 0.6rem', fontSize: '0.8rem' }}
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteTheatre(t._id, t.name)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#f87171',
                              padding: '0.35rem 0.6rem',
                              borderRadius: '6px',
                              cursor: 'pointer',
                            }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. MANAGE SHOWS TAB */}
        {activeTab === 'shows' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <div>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Showtimes & Schedules</h1>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
                  Assign movies to screens and configure category ticket pricing.
                </p>
              </div>
              <button onClick={openAddShowModal} className="btn-primary">
                <Plus size={16} /> Schedule Show
              </button>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date & Time</th>
                    <th>Movie</th>
                    <th>Multiplex</th>
                    <th>Auditorium</th>
                    <th>Prices (Silv/Gold/Plat)</th>
                    <th>Booked Seats</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {showsList.map((s) => (
                    <tr key={s._id}>
                      <td style={{ fontWeight: 700 }}>
                        {s.showDate} <br />
                        <span style={{ color: '#38bdf8', fontSize: '0.82rem' }}>{s.showTime}</span>
                      </td>
                      <td>{s.movieDetails?.title || s.movie?.title || 'Movie'}</td>
                      <td>{s.theatreDetails?.name || s.theatre?.name || 'Theatre'}</td>
                      <td>{s.screenName || 'Audi 1'}</td>
                      <td style={{ color: '#f59e0b', fontWeight: 600 }}>
                        ₹{s.ticketPrice?.silver || 180} / ₹{s.ticketPrice?.gold || 280} / ₹{s.ticketPrice?.platinum || 420}
                      </td>
                      <td>
                        <span style={{ background: 'rgba(255, 255, 255, 0.08)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>
                          {(s.bookedSeats || []).length} / {s.totalSeats || 70}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleDeleteShow(s._id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#f87171',
                            padding: '0.35rem 0.6rem',
                            borderRadius: '6px',
                            cursor: 'pointer',
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. MANAGE BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>All Customer Bookings</h1>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
                Complete transaction ledger with seat allocation and refund controls.
              </p>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Booking ID</th>
                    <th>Customer</th>
                    <th>Movie</th>
                    <th>Showtime</th>
                    <th>Seats</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookingsList.map((b) => (
                    <tr key={b._id}>
                      <td style={{ fontWeight: 700 }}>{b.bookingId}</td>
                      <td>
                        <div style={{ fontWeight: 600 }}>{b.userName || 'Member'}</div>
                        <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>{b.userEmail}</div>
                      </td>
                      <td>{b.movieDetails?.title || b.movie?.title || 'Movie'}</td>
                      <td>
                        {b.showDate} {b.showTime}
                      </td>
                      <td>{b.selectedSeats?.map((s) => s.seatNumber).join(', ')}</td>
                      <td style={{ fontWeight: 700, color: '#f59e0b' }}>₹{b.totalAmount}</td>
                      <td>
                        <span className={b.bookingStatus === 'confirmed' ? 'badge-confirmed' : 'badge-cancelled'}>
                          {b.bookingStatus}
                        </span>
                      </td>
                      <td>
                        {b.bookingStatus === 'confirmed' && (
                          <button
                            onClick={() => handleAdminCancelBooking(b.bookingId || b._id)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.1)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#f87171',
                              padding: '0.35rem 0.6rem',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '0.78rem',
                            }}
                          >
                            Cancel & Refund
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. REGISTERED USERS TAB */}
        {activeTab === 'users' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.8rem', fontWeight: 800 }}>User Accounts</h1>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '4px' }}>
                View all registered customer and staff profiles.
              </p>
            </div>

            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((u) => (
                    <tr key={u._id}>
                      <td style={{ fontWeight: 700 }}>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone || '+91 98765 43210'}</td>
                      <td>
                        <span
                          style={{
                            background: u.role === 'admin' ? 'rgba(225, 29, 72, 0.15)' : 'rgba(56, 189, 248, 0.15)',
                            color: u.role === 'admin' ? '#fb7185' : '#38bdf8',
                            padding: '0.2rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* MOVIE MODAL */}
        {movieModalOpen && (
          <div className="modal-overlay" onClick={() => setMovieModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>
                  {editingMovie ? `Edit Movie: ${editingMovie.title}` : 'Add New Movie to Catalogue'}
                </h3>
                <button onClick={() => setMovieModalOpen(false)} style={{ background: 'transparent', color: '#94a3b8' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveMovie} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Movie Title</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={movieFormData.title}
                    onChange={(e) => setMovieFormData({ ...movieFormData, title: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description / Synopsis</label>
                  <textarea
                    rows={3}
                    required
                    className="form-input"
                    value={movieFormData.description}
                    onChange={(e) => setMovieFormData({ ...movieFormData, description: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Genre (comma-separated)</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={movieFormData.genre}
                      onChange={(e) => setMovieFormData({ ...movieFormData, genre: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Language</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={movieFormData.language}
                      onChange={(e) => setMovieFormData({ ...movieFormData, language: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Duration (min)</label>
                    <input
                      type="number"
                      required
                      className="form-input"
                      value={movieFormData.durationMinutes}
                      onChange={(e) => setMovieFormData({ ...movieFormData, durationMinutes: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Rating (0-10)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      className="form-input"
                      value={movieFormData.rating}
                      onChange={(e) => setMovieFormData({ ...movieFormData, rating: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Base Price (₹)</label>
                    <input
                      type="number"
                      required
                      className="form-input"
                      value={movieFormData.price}
                      onChange={(e) => setMovieFormData({ ...movieFormData, price: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Poster Image URL</label>
                  <input
                    type="url"
                    required
                    className="form-input"
                    value={movieFormData.posterUrl}
                    onChange={(e) => setMovieFormData({ ...movieFormData, posterUrl: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Banner Image URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={movieFormData.bannerUrl}
                    onChange={(e) => setMovieFormData({ ...movieFormData, bannerUrl: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Trailer Link (YouTube)</label>
                  <input
                    type="url"
                    className="form-input"
                    value={movieFormData.trailerUrl}
                    onChange={(e) => setMovieFormData({ ...movieFormData, trailerUrl: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setMovieModalOpen(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingMovie ? 'Update Movie' : 'Create Movie'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* THEATRE MODAL */}
        {theatreModalOpen && (
          <div className="modal-overlay" onClick={() => setTheatreModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>
                  {editingTheatre ? `Edit Multiplex: ${editingTheatre.name}` : 'Add New Multiplex Theatre'}
                </h3>
                <button onClick={() => setTheatreModalOpen(false)} style={{ background: 'transparent', color: '#94a3b8' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveTheatre} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Multiplex Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={theatreFormData.name}
                    onChange={(e) => setTheatreFormData({ ...theatreFormData, name: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={theatreFormData.city}
                      onChange={(e) => setTheatreFormData({ ...theatreFormData, city: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Total Screens</label>
                    <input
                      type="number"
                      required
                      className="form-input"
                      value={theatreFormData.totalScreens}
                      onChange={(e) => setTheatreFormData({ ...theatreFormData, totalScreens: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={theatreFormData.address}
                    onChange={(e) => setTheatreFormData({ ...theatreFormData, address: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Facilities (comma-separated)</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={theatreFormData.facilities}
                    onChange={(e) => setTheatreFormData({ ...theatreFormData, facilities: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={theatreFormData.image}
                    onChange={(e) => setTheatreFormData({ ...theatreFormData, image: e.target.value })}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setTheatreModalOpen(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingTheatre ? 'Update Theatre' : 'Create Theatre'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* SHOWTIME MODAL */}
        {showModalOpen && (
          <div className="modal-overlay" onClick={() => setShowModalOpen(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.25rem' }}>Schedule New Screening</h3>
                <button onClick={() => setShowModalOpen(false)} style={{ background: 'transparent', color: '#94a3b8' }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveShow} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Select Movie</label>
                  <select
                    className="form-input"
                    value={showFormData.movie}
                    onChange={(e) => setShowFormData({ ...showFormData, movie: e.target.value })}
                    required
                  >
                    <option value="">-- Choose Movie --</option>
                    {moviesList.map((m) => (
                      <option key={m._id} value={m._id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Select Multiplex Theatre</label>
                  <select
                    className="form-input"
                    value={showFormData.theatre}
                    onChange={(e) => setShowFormData({ ...showFormData, theatre: e.target.value })}
                    required
                  >
                    <option value="">-- Choose Theatre --</option>
                    {theatresList.map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name} ({t.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Show Date (YYYY-MM-DD)</label>
                    <input
                      type="date"
                      required
                      className="form-input"
                      value={showFormData.showDate}
                      onChange={(e) => setShowFormData({ ...showFormData, showDate: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Show Time</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. 06:30 PM"
                      value={showFormData.showTime}
                      onChange={(e) => setShowFormData({ ...showFormData, showTime: e.target.value })}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Auditorium / Screen Name</label>
                  <input
                    type="text"
                    required
                    className="form-input"
                    value={showFormData.screenName}
                    onChange={(e) => setShowFormData({ ...showFormData, screenName: e.target.value })}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Silver Price (₹)</label>
                    <input
                      type="number"
                      required
                      className="form-input"
                      value={showFormData.silverPrice}
                      onChange={(e) => setShowFormData({ ...showFormData, silverPrice: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Gold Price (₹)</label>
                    <input
                      type="number"
                      required
                      className="form-input"
                      value={showFormData.goldPrice}
                      onChange={(e) => setShowFormData({ ...showFormData, goldPrice: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Platinum Price (₹)</label>
                    <input
                      type="number"
                      required
                      className="form-input"
                      value={showFormData.platinumPrice}
                      onChange={(e) => setShowFormData({ ...showFormData, platinumPrice: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setShowModalOpen(false)} className="btn-secondary">
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    Create Showtime
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
