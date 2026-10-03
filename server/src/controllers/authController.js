import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import { isDbConnected } from '../config/db.js';
import { inMemoryStore } from '../data/dataStore.js';

/**
 * Helper to find memory user by ID
 */
export const findMemoryUserById = (id) => {
  return inMemoryStore.findUserById(id);
};

/**
 * @desc   Register a new user
 * @route  POST /api/auth/register
 * @access Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isDbConnected()) {
      const userExists = await User.findOne({ email: normalizedEmail });
      if (userExists) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists',
        });
      }

      const user = await User.create({
        name,
        email: normalizedEmail,
        password,
        phone: phone || '+91 98765 43210',
        role: role === 'admin' ? 'admin' : 'user',
      });

      return res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          token: generateToken(user._id.toString()),
        },
      });
    }

    // In-memory fallback
    const existing = await inMemoryStore.findUserByEmail(normalizedEmail);
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    const newUser = await inMemoryStore.createUser({
      name,
      email: normalizedEmail,
      password,
      phone: phone || '+91 98765 43210',
      role,
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful (Active Session)',
      data: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
        token: generateToken(newUser._id),
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
};

/**
 * @desc   Authenticate user & return JWT token
 * @route  POST /api/auth/login
 * @access Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    if (isDbConnected()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (user && (await user.matchPassword(password))) {
        return res.status(200).json({
          success: true,
          message: 'Login successful',
          data: {
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: generateToken(user._id.toString()),
          },
        });
      }
    }

    // Check in-memory store
    const memUser = await inMemoryStore.findUserByEmail(normalizedEmail);
    if (memUser) {
      // Default passwords for demo accounts
      const isMatch =
        (await bcrypt.compare(password, memUser.password)) ||
        (normalizedEmail === 'admin@cinebook.com' && password === 'Admin@123') ||
        (normalizedEmail === 'john@example.com' && password === 'User@123');

      if (isMatch) {
        return res.status(200).json({
          success: true,
          message: 'Login successful',
          data: {
            _id: memUser._id,
            name: memUser.name,
            email: memUser.email,
            phone: memUser.phone,
            role: memUser.role,
            token: generateToken(memUser._id),
          },
        });
      }
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

/**
 * @desc   Get current logged-in user profile
 * @route  GET /api/auth/profile
 * @access Private
 */
export const getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      });
    }

    res.status(200).json({
      success: true,
      data: req.user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile',
      error: error.message,
    });
  }
};

/**
 * @desc   Update user profile
 * @route  PUT /api/auth/profile
 * @access Private
 */
export const updateUserProfile = async (req, res) => {
  try {
    const { name, phone, password } = req.body;
    const userId = req.user._id;

    if (isDbConnected()) {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (name) user.name = name;
      if (phone) user.phone = phone;
      if (password) user.password = password;

      const updatedUser = await user.save();
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          _id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          phone: updatedUser.phone,
          role: updatedUser.role,
        },
      });
    }

    // In-memory fallback
    const user = inMemoryStore.users.find((u) => String(u._id) === String(userId));
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message,
    });
  }
};
