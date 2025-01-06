import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async (): Promise<void> => {
  try {
    console.log('@@@@@@@@@@@22Attempting to connect with URI:', process.env.MONGO_URI);
    await mongoose.connect(process.env.MONGO_URI as string); // Simplified, no extra options
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
    process.exit(1); // Exit the process on failure
  }
};

export default connectDB;
