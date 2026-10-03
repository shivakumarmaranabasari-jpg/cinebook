import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Movie from '../models/Movie.js';
import Theatre from '../models/Theatre.js';
import Screen from '../models/Screen.js';
import Show from '../models/Show.js';
import Booking from '../models/Booking.js';
import {
  mockUsers,
  mockMovies,
  mockTheatres,
  mockScreens,
  mockShows,
  mockBookings,
} from '../data/mockData.js';

dotenv.config();

const runSeed = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cinebook';

  try {
    console.log(`\n======================================================`);
    console.log(`  🌱 Seeding CineBook Database`);
    console.log(`  🔗 Connecting to MongoDB at: ${mongoUri}`);
    console.log(`======================================================\n`);

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB successfully.');

    // 1. Clear existing collections
    console.log('🧹 Clearing existing collections...');
    await Promise.all([
      User.deleteMany({}),
      Movie.deleteMany({}),
      Theatre.deleteMany({}),
      Screen.deleteMany({}),
      Show.deleteMany({}),
      Booking.deleteMany({}),
    ]);
    console.log('✨ Collections wiped.');

    // 2. Insert Users
    console.log(`👤 Seeding ${mockUsers.length} users (Admin & Customer)...`);
    // Note: mockUsers passwords are raw hashes, insert directly without running pre-save hook again
    await User.insertMany(mockUsers);
    console.log('   - Admin: admin@cinebook.com (Password: Admin@123)');
    console.log('   - User:  john@example.com (Password: User@123)');

    // 3. Insert Movies
    console.log(`🎬 Seeding ${mockMovies.length} movies...`);
    await Movie.insertMany(mockMovies);

    // 4. Insert Theatres
    console.log(`🏛️  Seeding ${mockTheatres.length} multiplex theatres...`);
    await Theatre.insertMany(mockTheatres);

    // 5. Insert Screens
    console.log(`🖥️  Seeding ${mockScreens.length} cinema screens...`);
    await Screen.insertMany(mockScreens);

    // 6. Insert Shows
    console.log(`⏰ Seeding ${mockShows.length} showtimes...`);
    await Show.insertMany(mockShows);

    // 7. Insert Sample Bookings
    console.log(`🎟️  Seeding ${mockBookings.length} initial bookings...`);
    await Booking.insertMany(mockBookings);

    console.log(`\n======================================================`);
    console.log(`  🎉 Database Seeded Successfully!`);
    console.log(`======================================================\n`);
    process.exit(0);
  } catch (error) {
    console.error(`\n❌ Seeding failed: ${error.message}`);
    console.log(`\nNOTE: If your local MongoDB daemon is not currently active,`);
    console.log(`CineBook features an automatic In-Memory Store so that you can`);
    console.log(`still run and test the complete app seamlessly without any errors!\n`);
    process.exit(1);
  }
};

runSeed();
