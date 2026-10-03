import Movie from '../models/Movie.js';
import Theatre from '../models/Theatre.js';
import User from '../models/User.js';
import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import { isDbConnected } from '../config/db.js';
import { inMemoryStore } from '../data/dataStore.js';

/**
 * @desc   Get admin dashboard statistics
 * @route  GET /api/admin/stats
 * @access Private (Admin only)
 */
export const getAdminStats = async (req, res) => {
  try {
    if (isDbConnected()) {
      const [totalMovies, totalTheatres, totalUsers, totalShows, bookings] =
        await Promise.all([
          Movie.countDocuments(),
          Theatre.countDocuments(),
          User.countDocuments({ role: 'user' }),
          Show.countDocuments(),
          Booking.find()
            .populate('movie', 'title posterUrl')
            .populate('theatre', 'name')
            .populate('user', 'name email')
            .sort({ createdAt: -1 }),
        ]);

      const totalBookings = bookings.length;
      const confirmedBookings = bookings.filter((b) => b.bookingStatus === 'confirmed');
      const totalRevenue = confirmedBookings.reduce(
        (sum, b) => sum + (b.totalAmount || 0),
        0
      );
      const totalTicketsSold = confirmedBookings.reduce(
        (sum, b) => sum + (b.numberOfTickets || 0),
        0
      );

      const recentBookings = bookings.slice(0, 5).map((b) => ({
        ...b.toObject(),
        movieDetails: b.movie,
        theatreDetails: b.theatre,
        userName: b.user?.name,
        userEmail: b.user?.email,
      }));

      return res.status(200).json({
        success: true,
        data: {
          totalMovies,
          totalTheatres,
          totalUsers,
          totalShows,
          totalBookings,
          totalRevenue,
          totalTicketsSold,
          recentBookings,
        },
      });
    }

    const stats = inMemoryStore.getStats();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error('Error calculating admin stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving admin statistics',
      error: error.message,
    });
  }
};

/**
 * @desc   Get all registered users
 * @route  GET /api/admin/users
 * @access Private (Admin only)
 */
export const getAllUsers = async (req, res) => {
  try {
    if (isDbConnected()) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.status(200).json({
        success: true,
        count: users.length,
        data: users,
      });
    }

    const users = inMemoryStore.users.map(({ password, ...u }) => u);
    return res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving users',
      error: error.message,
    });
  }
};
