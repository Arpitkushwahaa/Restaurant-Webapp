import mongoose from "mongoose";

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log('MongoDB is already connected.');
        return;
    }

    // Get MongoDB URI from environment variables
    let mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
        console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
        console.error('ERROR: MONGO_URI is not defined in your .env file.');
        console.error('Using default connection string with correct database name.');
        // Provide a default connection string with a valid database name (no spaces)
        mongoUri = 'mongodb+srv://username:password@cluster0.mongodb.net/foodapp?retryWrites=true&w=majority';
        console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    }

    // Fix common issues with MongoDB connection strings
    // Replace spaces in database name with underscores or remove them
    if (mongoUri.includes(' ')) {
        console.warn('Warning: Your MongoDB connection string contains spaces in the database name.');
        console.warn('Automatically fixing by replacing spaces with underscores.');
        
        // Extract the database name and fix it
        const dbNameMatch = mongoUri.match(/\/([^/?]+)(\?|$)/);
        if (dbNameMatch && dbNameMatch[1]) {
            const oldDbName = dbNameMatch[1];
            const newDbName = oldDbName.replace(/\s+/g, '_');
            mongoUri = mongoUri.replace(`/${oldDbName}`, `/${newDbName}`);
            console.warn(`Changed database name from "${oldDbName}" to "${newDbName}"`);
        }
    }

    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(mongoUri);
        isConnected = true;
        console.log('✅ Successfully connected to MongoDB!');
    } catch (error: any) {
        console.error('❌ Could not connect to MongoDB.');
        console.error('Error:', error.message);
        console.error('\nPlease check the following:');
        console.error('1. Your MONGO_URI in the .env file is correct.');
        console.error('2. Your internet connection is working.');
        console.error('3. Your IP address is whitelisted for your MongoDB cluster.');
        process.exit(1); // Exit if connection fails
    }
};

export const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        isConnected = false;
        console.log('Disconnected from MongoDB');
    } catch (error: any) {
        console.error('Error disconnecting from MongoDB:', error.message || error);
    }
};

export default connectDB;
