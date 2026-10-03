import Booking from '../models/Booking.js';
import Show from '../models/Show.js';
import Movie from '../models/Movie.js';
import Theatre from '../models/Theatre.js';
import { isDbConnected } from '../config/db.js';
import { inMemoryStore } from '../data/dataStore.js';

/**
 * @desc   Create a new booking with concurrency collision prevention
 * @route  POST /api/bookings
 * @access Private
 */
export const createBooking = async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      showId,
      movieId,
      theatreId,
      screenName,
      showDate,
      showTime,
      selectedSeats,
      subtotal,
      convenienceFee = 30,
      totalAmount,
      paymentMethod = 'UPI / Card (Online)',
    } = req.body;

    if (!showId || !selectedSeats || selectedSeats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide valid show and seat selection',
      });
    }

    const requestedSeatNumbers = selectedSeats.map((s) => s.seatNumber);

    if (isDbConnected()) {
      try {
        // Concurrency Check: Verify show exists and seats are not already booked
        const show = await Show.findById(showId);
        if (!show) {
          return res.status(404).json({ success: false, message: 'Show not found' });
        }

        const conflictSeats = requestedSeatNumbers.filter((s) =>
          show.bookedSeats.includes(s)
        );

        if (conflictSeats.length > 0) {
          return res.status(400).json({
            success: false,
            message: `Seat collision: Seats ${conflictSeats.join(', ')} were just booked by another user. Please choose alternate seats.`,
          });
        }

        // Atomically update Show bookedSeats
        const updatedShow = await Show.findOneAndUpdate(
          {
            _id: showId,
            bookedSeats: { $nin: requestedSeatNumbers },
          },
          {
            $push: { bookedSeats: { $each: requestedSeatNumbers } },
          },
          { new: true }
        );

        if (!updatedShow) {
          return res.status(400).json({
            success: false,
            message: 'One or more selected seats were concurrently booked. Please reselect.',
          });
        }

        const bookingId = `CB-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

        const booking = await Booking.create({
          bookingId,
          user: userId,
          show: showId,
          movie: movieId || show.movie,
          theatre: theatreId || show.theatre,
          screenName: screenName || show.screenName,
          showDate: showDate || show.showDate,
          showTime: showTime || show.showTime,
          selectedSeats,
          numberOfTickets: selectedSeats.length,
          subtotal: subtotal || selectedSeats.reduce((acc, curr) => acc + (curr.price || 250), 0),
          convenienceFee,
          totalAmount: totalAmount || (subtotal + convenienceFee),
          bookingStatus: 'confirmed',
          paymentStatus: 'paid',
          paymentMethod,
        });

        const populatedBooking = await Booking.findById(booking._id)
          .populate('movie')
          .populate('theatre')
          .populate('user', 'name email phone');

        return res.status(201).json({
          success: true,
          message: 'Booking confirmed successfully!',
          data: {
            ...populatedBooking.toObject(),
            movieDetails: populatedBooking.movie,
            theatreDetails: populatedBooking.theatre,
          },
        });
      } catch (mongoErr) {
        console.error('Mongo booking creation error:', mongoErr);
      }
    }

    // In-Memory Fallback
    try {
      const booking = inMemoryStore.createBooking({
        userId,
        showId,
        movieId,
        theatreId,
        screenName,
        showDate,
        showTime,
        selectedSeats,
        numberOfTickets: selectedSeats.length,
        subtotal,
        convenienceFee,
        totalAmount,
        paymentMethod,
      });

      return res.status(201).json({
        success: true,
        message: 'Booking confirmed successfully!',
        data: booking,
      });
    } catch (inMemErr) {
      return res.status(inMemErr.statusCode || 400).json({
        success: false,
        message: inMemErr.message,
      });
    }
  } catch (error) {
    console.error('Booking Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing booking',
      error: error.message,
    });
  }
};

/**
 * @desc   Get user's bookings (or all bookings if admin)
 * @route  GET /api/bookings
 * @access Private
 */
export const getBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    if (isDbConnected()) {
      const query = isAdmin ? {} : { user: userId };
      const bookings = await Booking.find(query)
        .populate('movie', 'title posterUrl durationMinutes rating')
        .populate('theatre', 'name city address')
        .populate('user', 'name email phone')
        .sort({ createdAt: -1 });

      const formatted = bookings.map((b) => ({
        ...b.toObject(),
        movieDetails: b.movie,
        theatreDetails: b.theatre,
        userName: b.user?.name,
        userEmail: b.user?.email,
      }));

      return res.status(200).json({
        success: true,
        count: formatted.length,
        data: formatted,
      });
    }

    const bookings = inMemoryStore.getBookings({ userId, isAdmin });
    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving bookings',
      error: error.message,
    });
  }
};

/**
 * @desc   Get single booking by ID
 * @route  GET /api/bookings/:id
 * @access Private
 */
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    if (isDbConnected()) {
      try {
        const query = id.startsWith('CB-') ? { bookingId: id } : { _id: id };
        const booking = await Booking.findOne(query)
          .populate('movie')
          .populate('theatre')
          .populate('user', 'name email phone');

        if (booking) {
          if (!isAdmin && String(booking.user._id) !== String(userId)) {
            return res.status(403).json({ success: false, message: 'Access denied' });
          }

          return res.status(200).json({
            success: true,
            data: {
              ...booking.toObject(),
              movieDetails: booking.movie,
              theatreDetails: booking.theatre,
              userName: booking.user?.name,
              userEmail: booking.user?.email,
            },
          });
        }
      } catch {
        // Fallback
      }
    }

    const booking = inMemoryStore.getBookingById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (!isAdmin && String(booking.user) !== String(userId)) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving booking',
      error: error.message,
    });
  }
};

/**
 * @desc   Cancel booking & release seats
 * @route  PUT /api/bookings/:id/cancel
 * @access Private
 */
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    if (isDbConnected()) {
      try {
        const query = id.startsWith('CB-') ? { bookingId: id } : { _id: id };
        const booking = await Booking.findOne(query);

        if (!booking) {
          return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        if (!isAdmin && String(booking.user) !== String(userId)) {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to cancel this booking',
          });
        }

        if (booking.bookingStatus === 'cancelled') {
          return res.status(400).json({
            success: false,
            message: 'Booking is already cancelled',
          });
        }

        booking.bookingStatus = 'cancelled';
        booking.paymentStatus = 'refunded';
        await booking.save();

        // Release seats on the show
        const seatNumbers = booking.selectedSeats.map((s) => s.seatNumber);
        await Show.findByIdAndUpdate(booking.show, {
          $pull: { bookedSeats: { $in: seatNumbers } },
        });

        return res.status(200).json({
          success: true,
          message: 'Booking cancelled and seats successfully released. Refund initiated.',
          data: booking,
        });
      } catch {
        // Fallback
      }
    }

    const cancelled = inMemoryStore.cancelBooking(id, userId, isAdmin);
    return res.status(200).json({
      success: true,
      message: 'Booking cancelled and seats released. Refund initiated.',
      data: cancelled,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server error cancelling booking',
    });
  }
};
