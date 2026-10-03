import Movie from '../models/Movie.js';
import { isDbConnected } from '../config/db.js';
import { inMemoryStore } from '../data/dataStore.js';

/**
 * @desc   Get all movies with optional search, genre, and status filters
 * @route  GET /api/movies
 * @access Public
 */
export const getMovies = async (req, res) => {
  try {
    const { genre, search, status } = req.query;

    if (isDbConnected()) {
      const query = {};

      if (genre && genre !== 'All') {
        query.genre = { $in: [genre] };
      }

      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { language: { $regex: search, $options: 'i' } },
        ];
      }

      if (status === 'now_showing') {
        query.isNowShowing = true;
      } else if (status === 'upcoming') {
        query.isNowShowing = false;
      }

      const movies = await Movie.find(query).sort({ rating: -1, createdAt: -1 });
      return res.status(200).json({
        success: true,
        source: 'mongodb',
        count: movies.length,
        data: movies,
      });
    }

    // In-memory fallback
    const movies = inMemoryStore.getMovies({ genre, search, status });
    return res.status(200).json({
      success: true,
      source: 'in_memory',
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({
      success: false,
      message: 'Server error retrieving movies',
      error: error.message,
    });
  }
};

/**
 * @desc   Get single movie by ID
 * @route  GET /api/movies/:id
 * @access Public
 */
export const getMovieById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      try {
        const movie = await Movie.findById(id);
        if (movie) {
          return res.status(200).json({ success: true, data: movie });
        }
      } catch {
        // Continue to check in-memory if invalid Mongo ObjectId
      }
    }

    const movie = inMemoryStore.getMovieById(id);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    return res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving movie',
      error: error.message,
    });
  }
};

/**
 * @desc   Create a new movie
 * @route  POST /api/movies
 * @access Private (Admin only)
 */
export const createMovie = async (req, res) => {
  try {
    const movieData = req.body;

    if (!movieData.title || !movieData.description || !movieData.posterUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and posterUrl',
      });
    }

    if (isDbConnected()) {
      const movie = await Movie.create(movieData);
      return res.status(201).json({
        success: true,
        message: 'Movie added successfully',
        data: movie,
      });
    }

    const newMovie = inMemoryStore.createMovie(movieData);
    return res.status(201).json({
      success: true,
      message: 'Movie added successfully',
      data: newMovie,
    });
  } catch (error) {
    console.error('Create Movie Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating movie',
      error: error.message,
    });
  }
};

/**
 * @desc   Update movie by ID
 * @route  PUT /api/movies/:id
 * @access Private (Admin only)
 */
export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (isDbConnected()) {
      try {
        const movie = await Movie.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        });
        if (movie) {
          return res.status(200).json({
            success: true,
            message: 'Movie updated successfully',
            data: movie,
          });
        }
      } catch {
        // Fallback
      }
    }

    const updated = inMemoryStore.updateMovie(id, updateData);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating movie',
      error: error.message,
    });
  }
};

/**
 * @desc   Delete movie by ID
 * @route  DELETE /api/movies/:id
 * @access Private (Admin only)
 */
export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      try {
        const movie = await Movie.findByIdAndDelete(id);
        if (movie) {
          return res.status(200).json({
            success: true,
            message: 'Movie deleted successfully',
          });
        }
      } catch {
        // Fallback
      }
    }

    const deleted = inMemoryStore.deleteMovie(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Movie deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting movie',
      error: error.message,
    });
  }
};
