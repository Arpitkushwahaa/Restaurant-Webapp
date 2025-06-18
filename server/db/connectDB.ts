
import mongoose from "mongoose";
import { MongoMemoryServer } from 'mongodb-memory-server';

// Create a singleton instance of MongoMemoryServer
let mongoMemoryServer: MongoMemoryServer | null = null;

const connectDB = async () => {
    try {
        // Check if we should use a real MongoDB instance
        if (process.env.MONGO_URI) {
            try {
                await mongoose.connect(process.env.MONGO_URI);
                console.log('Connected to MongoDB at', process.env.MONGO_URI);
                return;
            } catch (mongoError) {
                console.log('Could not connect to MongoDB:', mongoError);
                console.log('Falling back to in-memory MongoDB...');
            }
        } else {
            console.log('MONGO_URI is not defined in environment variables.');
            console.log('Using in-memory MongoDB for development...');
        }

        // Start MongoDB Memory Server if not already running
        if (!mongoMemoryServer) {
            mongoMemoryServer = await MongoMemoryServer.create();
            const uri = mongoMemoryServer.getUri();
            await mongoose.connect(uri);
            console.log('Connected to in-memory MongoDB at', uri);
            
            // Set up sample data if needed
            // await setupSampleData();
        }
    } catch (error) {
        console.log('MongoDB connection error:', error);
        console.log('Server will continue to run, but database functionality will be limited.');
    }
}

export default connectDB;