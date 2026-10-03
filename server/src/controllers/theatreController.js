import Theatre from '../models/Theatre.js';
import Screen from '../models/Screen.js';
import { isDbConnected } from '../config/db.js';
import { inMemoryStore } from '../data/dataStore.js';

/**
 * @desc   Get all theatres
 * @route  GET /api/theatres
 * @access Public
 */
export const getTheatres = async (req, res) => {
  try {
    const { city } = req.query;

    if (isDbConnected()) {
      const query = { isActive: true };
      if (city && city !== 'All') {
        query.city = { $regex: city, $options: 'i' };
      }
      const theatres = await Theatre.find(query).sort({ name: 1 });
      return res.status(200).json({
        success: true,
        count: theatres.length,
        data: theatres,
      });
    }

    const theatres = inMemoryStore.getTheatres({ city });
    return res.status(200).json({
      success: true,
      count: theatres.length,
      data: theatres,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving theatres',
      error: error.message,
    });
  }
};

/**
 * @desc   Get single theatre by ID
 * @route  GET /api/theatres/:id
 * @access Public
 */
export const getTheatreById = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      try {
        const theatre = await Theatre.findById(id);
        if (theatre) {
          const screens = await Screen.find({ theatre: id });
          return res.status(200).json({
            success: true,
            data: { ...theatre.toObject(), screens },
          });
        }
      } catch {
        // Fallback
      }
    }

    const theatre = inMemoryStore.getTheatreById(id);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    const screens = inMemoryStore.screens.filter((s) => String(s.theatre) === String(id));
    return res.status(200).json({
      success: true,
      data: { ...theatre, screens },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error retrieving theatre',
      error: error.message,
    });
  }
};

/**
 * @desc   Create theatre
 * @route  POST /api/theatres
 * @access Private (Admin)
 */
export const createTheatre = async (req, res) => {
  try {
    const { name, city, address, facilities, totalScreens, image } = req.body;

    if (!name || !city || !address) {
      return res.status(400).json({
        success: false,
        message: 'Name, city, and address are required',
      });
    }

    if (isDbConnected()) {
      const theatre = await Theatre.create({
        name,
        city,
        address,
        facilities: facilities || ['IMAX 4K', 'Dolby Atmos', 'Recliner Lounges'],
        totalScreens: totalScreens || 4,
        image,
      });

      // Automatically create a default screen for this theatre
      await Screen.create({
        theatre: theatre._id,
        screenNumber: 'Screen 1',
        screenType: 'IMAX 4K',
        totalSeats: 70,
      });

      return res.status(201).json({
        success: true,
        message: 'Theatre created successfully',
        data: theatre,
      });
    }

    const newTheatre = inMemoryStore.createTheatre({
      name,
      city,
      address,
      facilities: facilities || ['IMAX 4K', 'Dolby Atmos', 'Recliner Lounges'],
      totalScreens: totalScreens || 4,
      image,
    });

    inMemoryStore.screens.push({
      _id: `mem_screen_${Date.now()}`,
      theatre: newTheatre._id,
      screenNumber: 'Screen 1',
      screenType: 'IMAX 4K',
      totalSeats: 70,
      rows: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      seatsPerRow: 10,
    });

    return res.status(201).json({
      success: true,
      message: 'Theatre created successfully',
      data: newTheatre,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error creating theatre',
      error: error.message,
    });
  }
};

/**
 * @desc   Update theatre
 * @route  PUT /api/theatres/:id
 * @access Private (Admin)
 */
export const updateTheatre = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (isDbConnected()) {
      try {
        const theatre = await Theatre.findByIdAndUpdate(id, updateData, {
          new: true,
          runValidators: true,
        });
        if (theatre) {
          return res.status(200).json({
            success: true,
            message: 'Theatre updated successfully',
            data: theatre,
          });
        }
      } catch {
        // Fallback
      }
    }

    const updated = inMemoryStore.updateTheatre(id, updateData);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Theatre updated successfully',
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error updating theatre',
      error: error.message,
    });
  }
};

/**
 * @desc   Delete theatre
 * @route  DELETE /api/theatres/:id
 * @access Private (Admin)
 */
export const deleteTheatre = async (req, res) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
      try {
        const theatre = await Theatre.findByIdAndDelete(id);
        if (theatre) {
          await Screen.deleteMany({ theatre: id });
          return res.status(200).json({
            success: true,
            message: 'Theatre and associated screens deleted successfully',
          });
        }
      } catch {
        // Fallback
      }
    }

    const deleted = inMemoryStore.deleteTheatre(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Theatre deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error deleting theatre',
      error: error.message,
    });
  }
};
