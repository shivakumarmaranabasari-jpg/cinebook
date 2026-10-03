import { mockUsers, mockTheatres, mockScreens, mockMovies, mockShows, mockBookings } from './mockData.js';
import bcrypt from 'bcryptjs';

/**
 * Resilient In-Memory Data Store for CineBook.
 * Keeps state active during execution if MongoDB is offline or before Atlas is configured.
 * When MongoDB is connected, controllers use Mongoose directly.
 */
class DataStore {
  constructor() {
    this.users = [...mockUsers];
    this.theatres = [...mockTheatres];
    this.screens = [...mockScreens];
    this.movies = [...mockMovies];
    this.shows = [...mockShows];
    this.bookings = [...mockBookings];
  }

  // USERS
  async findUserByEmail(email) {
    const normalized = email.toLowerCase().trim();
    return this.users.find((u) => u.email === normalized) || null;
  }

  findUserById(id) {
    const user = this.users.find((u) => String(u._id) === String(id));
    if (!user) return null;
    const { password, ...rest } = user;
    return rest;
  }

  async createUser({ name, email, password, role = 'user', phone = '+91 98765 43210' }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = {
      _id: `mem_user_${Date.now()}`,
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      phone,
      role: role === 'admin' ? 'admin' : 'user',
      createdAt: new Date(),
    };
    this.users.push(newUser);
    const { password: _, ...cleanUser } = newUser;
    return cleanUser;
  }

  // MOVIES
  getMovies({ genre, search, status } = {}) {
    let result = [...this.movies];
    if (genre && genre !== 'All') {
      result = result.filter((m) => m.genre && m.genre.includes(genre));
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.description.toLowerCase().includes(q) ||
          m.language.toLowerCase().includes(q)
      );
    }
    if (status === 'now_showing') {
      result = result.filter((m) => m.isNowShowing);
    } else if (status === 'upcoming') {
      result = result.filter((m) => !m.isNowShowing);
    }
    return result;
  }

  getMovieById(id) {
    return this.movies.find((m) => String(m._id) === String(id)) || null;
  }

  createMovie(movieData) {
    const newMovie = {
      _id: `mem_movie_${Date.now()}`,
      rating: 8.0,
      certificate: 'UA',
      isNowShowing: true,
      isFeatured: false,
      ...movieData,
      createdAt: new Date(),
    };
    this.movies.unshift(newMovie);
    return newMovie;
  }

  updateMovie(id, updateData) {
    const idx = this.movies.findIndex((m) => String(m._id) === String(id));
    if (idx === -1) return null;
    this.movies[idx] = { ...this.movies[idx], ...updateData, updatedAt: new Date() };
    return this.movies[idx];
  }

  deleteMovie(id) {
    const idx = this.movies.findIndex((m) => String(m._id) === String(id));
    if (idx === -1) return false;
    this.movies.splice(idx, 1);
    // Also remove associated shows
    this.shows = this.shows.filter((s) => String(s.movie) !== String(id));
    return true;
  }

  // THEATRES
  getTheatres({ city } = {}) {
    let result = [...this.theatres];
    if (city && city !== 'All') {
      result = result.filter((t) => t.city.toLowerCase() === city.toLowerCase());
    }
    return result;
  }

  getTheatreById(id) {
    return this.theatres.find((t) => String(t._id) === String(id)) || null;
  }

  createTheatre(theatreData) {
    const newTheatre = {
      _id: `mem_theatre_${Date.now()}`,
      isActive: true,
      totalScreens: 4,
      facilities: ['IMAX 4K', 'Dolby Atmos', 'Recliners'],
      ...theatreData,
      createdAt: new Date(),
    };
    this.theatres.unshift(newTheatre);
    return newTheatre;
  }

  updateTheatre(id, updateData) {
    const idx = this.theatres.findIndex((t) => String(t._id) === String(id));
    if (idx === -1) return null;
    this.theatres[idx] = { ...this.theatres[idx], ...updateData, updatedAt: new Date() };
    return this.theatres[idx];
  }

  deleteTheatre(id) {
    const idx = this.theatres.findIndex((t) => String(t._id) === String(id));
    if (idx === -1) return false;
    this.theatres.splice(idx, 1);
    this.shows = this.shows.filter((s) => String(s.theatre) !== String(id));
    return true;
  }

  // SHOWS
  getShows({ movieId, theatreId, date } = {}) {
    let result = [...this.shows];
    if (movieId) {
      result = result.filter((s) => String(s.movie) === String(movieId));
    }
    if (theatreId) {
      result = result.filter((s) => String(s.theatre) === String(theatreId));
    }
    if (date) {
      result = result.filter((s) => s.showDate === date);
    }
    // Populate movie and theatre names
    return result.map((show) => {
      const movieObj = this.getMovieById(show.movie);
      const theatreObj = this.getTheatreById(show.theatre);
      return {
        ...show,
        movieDetails: movieObj,
        theatreDetails: theatreObj,
      };
    });
  }

  getShowById(id) {
    const show = this.shows.find((s) => String(s._id) === String(id));
    if (!show) return null;
    const movieObj = this.getMovieById(show.movie);
    const theatreObj = this.getTheatreById(show.theatre);
    return {
      ...show,
      movieDetails: movieObj,
      theatreDetails: theatreObj,
    };
  }

  createShow(showData) {
    const newShow = {
      _id: `mem_show_${Date.now()}`,
      bookedSeats: [],
      totalSeats: 70,
      status: 'scheduled',
      ticketPrice: { silver: 180, gold: 280, platinum: 420 },
      ...showData,
      createdAt: new Date(),
    };
    this.shows.unshift(newShow);
    return newShow;
  }

  updateShow(id, updateData) {
    const idx = this.shows.findIndex((s) => String(s._id) === String(id));
    if (idx === -1) return null;
    this.shows[idx] = { ...this.shows[idx], ...updateData, updatedAt: new Date() };
    return this.shows[idx];
  }

  deleteShow(id) {
    const idx = this.shows.findIndex((s) => String(s._id) === String(id));
    if (idx === -1) return false;
    this.shows.splice(idx, 1);
    return true;
  }

  // BOOKINGS (With Concurrency / Duplicate Seat Booking Prevention)
  createBooking({
    userId,
    showId,
    movieId,
    theatreId,
    screenName,
    showDate,
    showTime,
    selectedSeats,
    numberOfTickets,
    subtotal,
    convenienceFee = 30,
    totalAmount,
    paymentMethod = 'Online Payment',
  }) {
    const show = this.shows.find((s) => String(s._id) === String(showId));
    if (!show) {
      throw new Error('Selected show was not found');
    }

    const requestedSeatNumbers = selectedSeats.map((s) => s.seatNumber);
    // Duplicate seat collision detection
    const alreadyBooked = requestedSeatNumbers.filter((seatNum) =>
      show.bookedSeats.includes(seatNum)
    );

    if (alreadyBooked.length > 0) {
      const err = new Error(
        `Seats already booked: ${alreadyBooked.join(', ')}. Please select other seats.`
      );
      err.statusCode = 400;
      throw err;
    }

    // Atomically reserve the seats on the show
    show.bookedSeats.push(...requestedSeatNumbers);

    const bookingId = `CB-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const newBooking = {
      _id: `mem_booking_${Date.now()}`,
      bookingId,
      user: userId,
      show: showId,
      movie: movieId,
      theatre: theatreId,
      screenName: screenName || show.screenName,
      showDate: showDate || show.showDate,
      showTime: showTime || show.showTime,
      selectedSeats,
      numberOfTickets,
      subtotal,
      convenienceFee,
      totalAmount,
      bookingStatus: 'confirmed',
      paymentStatus: 'paid',
      paymentMethod,
      bookingDate: new Date(),
    };

    this.bookings.unshift(newBooking);

    // Populate details for confirmation receipt
    const movieObj = this.getMovieById(movieId);
    const theatreObj = this.getTheatreById(theatreId);

    return {
      ...newBooking,
      movieDetails: movieObj,
      theatreDetails: theatreObj,
    };
  }

  getBookings({ userId, isAdmin = false } = {}) {
    let result = [...this.bookings];
    if (!isAdmin && userId) {
      result = result.filter((b) => String(b.user) === String(userId));
    }

    return result.map((b) => {
      const movieObj = this.getMovieById(b.movie);
      const theatreObj = this.getTheatreById(b.theatre);
      const userObj = this.users.find((u) => String(u._id) === String(b.user));
      return {
        ...b,
        movieDetails: movieObj,
        theatreDetails: theatreObj,
        userName: userObj ? userObj.name : 'Customer',
        userEmail: userObj ? userObj.email : 'customer@example.com',
      };
    });
  }

  getBookingById(id) {
    const booking = this.bookings.find(
      (b) => String(b._id) === String(id) || b.bookingId === id
    );
    if (!booking) return null;
    const movieObj = this.getMovieById(booking.movie);
    const theatreObj = this.getTheatreById(booking.theatre);
    const userObj = this.users.find((u) => String(u._id) === String(booking.user));
    return {
      ...booking,
      movieDetails: movieObj,
      theatreDetails: theatreObj,
      userName: userObj ? userObj.name : 'Customer',
      userEmail: userObj ? userObj.email : 'customer@example.com',
    };
  }

  cancelBooking(id, userId, isAdmin = false) {
    const booking = this.bookings.find(
      (b) => String(b._id) === String(id) || b.bookingId === id
    );
    if (!booking) {
      throw new Error('Booking not found');
    }

    if (!isAdmin && String(booking.user) !== String(userId)) {
      const err = new Error('Not authorized to cancel this booking');
      err.statusCode = 403;
      throw err;
    }

    if (booking.bookingStatus === 'cancelled') {
      const err = new Error('Booking is already cancelled');
      err.statusCode = 400;
      throw err;
    }

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';

    // Free up the seats from the show!
    const show = this.shows.find((s) => String(s._id) === String(booking.show));
    if (show) {
      const seatsToFree = booking.selectedSeats.map((s) => s.seatNumber);
      show.bookedSeats = show.bookedSeats.filter((seat) => !seatsToFree.includes(seat));
    }

    return booking;
  }

  // ADMIN STATS
  getStats() {
    const totalMovies = this.movies.length;
    const totalTheatres = this.theatres.length;
    const totalUsers = this.users.filter((u) => u.role !== 'admin').length;
    const totalBookings = this.bookings.length;
    const confirmedBookings = this.bookings.filter((b) => b.bookingStatus === 'confirmed');
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const totalTicketsSold = confirmedBookings.reduce(
      (sum, b) => sum + (b.numberOfTickets || 0),
      0
    );

    return {
      totalMovies,
      totalTheatres,
      totalUsers,
      totalBookings,
      totalRevenue,
      totalTicketsSold,
      recentBookings: this.getBookings({ isAdmin: true }).slice(0, 5),
    };
  }
}

export const inMemoryStore = new DataStore();
