import mongoose from 'mongoose';

/**
 * Connect to MongoDB with error handling and diagnostic messages.
 */
export const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/cinebook';

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
    });

    console.log(`[Database] MongoDB Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`\n======================================================`);
    console.error(`[Database Error] Could not connect to MongoDB: ${error.message}`);
    console.error(`------------------------------------------------------`);
    console.error(`TIPS FOR BEGINNERS:`);
    console.error(`1. If using Local MongoDB:`);
    console.error(`   - Ensure MongoDB service is running (e.g. 'net start MongoDB' or 'mongod')`);
    console.error(`2. If using MongoDB Atlas (Cloud):`);
    console.error(`   - Put your Atlas connection string in backend/.env:`);
    console.error(`     MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/cinebook`);
    console.error(`======================================================\n`);
    return false;
  }
};

/**
 * Returns true if MongoDB connection is open.
 */
export const isDbConnected = () => {
  return mongoose.connection.readyState === 1;
};
