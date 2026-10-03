import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Create an Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: attach JWT token if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cinebook_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: extract response data or format clean error
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message || error.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// HEALTH
export const checkBackendHealth = () => api.get('/health');

// AUTHENTICATION
export const loginApi = (credentials) => api.post('/auth/login', credentials);
export const registerApi = (userData) => api.post('/auth/register', userData);
export const fetchUserProfile = () => api.get('/auth/profile');
export const updateUserProfile = (profileData) => api.put('/auth/profile', profileData);

// MOVIES
export const fetchMovies = (params) => api.get('/movies', { params });
export const fetchMovieById = (id) => api.get(`/movies/${id}`);
export const createMovieApi = (data) => api.post('/movies', data);
export const updateMovieApi = (id, data) => api.put(`/movies/${id}`, data);
export const deleteMovieApi = (id) => api.delete(`/movies/${id}`);

// THEATRES
export const fetchTheatres = (params) => api.get('/theatres', { params });
export const fetchTheatreById = (id) => api.get(`/theatres/${id}`);
export const createTheatreApi = (data) => api.post('/theatres', data);
export const updateTheatreApi = (id, data) => api.put(`/theatres/${id}`, data);
export const deleteTheatreApi = (id) => api.delete(`/theatres/${id}`);

// SHOWS
export const fetchShows = (params) => api.get('/shows', { params });
export const fetchShowById = (id) => api.get(`/shows/${id}`);
export const createShowApi = (data) => api.post('/shows', data);
export const updateShowApi = (id, data) => api.put(`/shows/${id}`, data);
export const deleteShowApi = (id) => api.delete(`/shows/${id}`);

// BOOKINGS
export const createBookingApi = (bookingData) => api.post('/bookings', bookingData);
export const fetchBookings = () => api.get('/bookings');
export const fetchBookingById = (id) => api.get(`/bookings/${id}`);
export const cancelBookingApi = (id) => api.put(`/bookings/${id}/cancel`);

// ADMIN
export const fetchAdminStats = () => api.get('/admin/stats');
export const fetchAdminUsers = () => api.get('/admin/users');

export default api;
