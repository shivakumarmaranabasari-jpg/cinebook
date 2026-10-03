import Show from '../models/Show.js';
import Movie from '../models/Movie.js';
import Theatre from '../models/Theatre.js';
import Screen from '../models/Screen.js';
import { isDbConnected } from '../config/db.js';
import { inMemoryStore } from '../data/dataStore.js';

/**
 * @desc   Get shows with optional filters (movieId, theatreId, date)
 * @route  GET /api/shows
 * @access Public
 */
export const getShows = async (req, res) => {
  try {
    const { movieId, theatreId, date } = req.query;

    if (isDbConnected()) {
      const query = { status: { $ne: 'cancelled' } };

      if (movieId) query.movie = movieId;
      if (theatreId) query.theatre = theatreId;
      if (date) query.showDate = date;

      const shows = await Show.find(query)
        .populate('movie', 'title posterUrl durationMinutes rating certificate language')
        .populate('theatre', 'name city address facilities')
        .sort({ showDate: 1, showTime: 1 });

      // Transform so frontend has unified structure
      const formatted = shows.map((s) => ({
        ...s.toObject(),
        movieDetails: s.movie,
        theatreDetails: s.theatre,
      }));

      return res.status(200).json({
        success: true,
        count: formatted.length,
        data: formatted,
      });
    }

    const shows = inMemoryStore.getShows({ movieId, theatreId, date });
    return res.status(200).json({
      success: true,
      count: shows.length,
      data: shows,
    });
  } catch (error) {
    console.error('Error fetching shows:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving shows',
      error: error.message,
    });
  }
};

/**
 * @desc   Get single show by ID (including seat layout & booked seats)
 * @route  GET /api/shows/:id
 * @access Public
 */
export const getShowById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      try {
        const show = await Show.findById(id)
          .populate('movie')
          .populate('theatre')
          .populate('screen');

        if (show) {
          return res.status(200).json({
            success: true,
            data: {
              ...show.toObject(),
              movieDetails: show.movie,
              theatreDetails: show.theatre,
              screenDetails: show.screen,
            },
          });
        }
      } catch {
        // Fallback
      }
    }

    const show = inMemoryStore.getShowById(id);
    if (!show) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    return res.status(200).json({
      success: true,
      data: show,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving show',
      error: error.message,
    });
  }
};

/**
 * @desc   Create new show
 * @route  POST /api/shows
 * @access Private (Admin)
 */
export const createShow = async (req, res) => {
  try {
    const {
      movie,
      theatre,
      screen,
      screenName,
      showDate,
      showTime,
      ticketPrice,
    } = req.body;

    if (!movie || !theatre || !showDate || !showTime) {
      return res.status(400).json({
        success: false,
        message: 'Movie, theatre, showDate, and showTime are required',
      });
    }

    const defaultPrices = ticketPrice || { silver: 180, gold: 280, platinum: 420 };

    if (isDbConnected()) {
      let resolvedScreen = screen;
      if (!resolvedScreen) {
        const firstScreen = await Screen.findOne({ theatre });
        resolvedScreen = firstScreen ? firstScreen._id : new mongoose.Types.ObjectId();
      }

      const show = await Show.create({
        movie,
        theatre,
        screen: resolvedScreen,
        screenName: screenName || 'Audi 1 (IMAX 4K)',
        showDate,
        showTime,
        ticketPrice: defaultPrices,
        bookedSeats: [],
      });

      return res.status(201).json({
        success: true,
        message: 'Show created successfully',
        data: show,
      });
    }

    const newShow = inMemoryStore.createShow({
      movie,
      theatre,
      screen: screen || '662000000000000000000001',
      screenName: screenName || 'Audi 1 (IMAX 4K Laser)',
      showDate,
      showTime,
      ticketPrice: defaultPrices,
    });

    return res.status(201).json({
      success: true,
      message: 'Show created successfully',
      data: newShow,
    });
  } catch (error) {
    console.error('Create Show Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating show',
      error: error.message,
    });
  }
};

/**
 * @desc   Update show
 * @route  PUT /api/shows/:id
 * @access Private (Admin)
 */
export const updateShow = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (isDbConnected()) {
      try {
        const show = await Show.findByIdAndUpdate(id, updateData, { new: true });
        if (show) {
          return res.status(200).json({
            success: true,
            message: 'Show updated successfully',
            data: show,
          });
        }
      } catch {
        // Fallback
      }
    }

    const updated = inMemoryStore.updateShow(id, updateData);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Show updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating show',
      error: error.message,
    });
  }
};

/**
 * @desc   Delete show
 * @route  DELETE /api/shows/:id
 * @access Private (Admin)
 */
export const deleteShow = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      try {
        const show = await Show.findByIdAndDelete(id);
        if (show) {
          return res.status(200).json({
            success: true,
            message: 'Show deleted successfully',
          });
        }
      } catch {
        // Fallback
      }
    }

    const deleted = inMemoryStore.deleteShow(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Show not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Show deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting show',
      error: error.message,
    });
  }
};
