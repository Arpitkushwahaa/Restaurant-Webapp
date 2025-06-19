/**
 * Script to make a user an admin
 * 
 * Run with: node make-admin.js user@example.com
 */

const mongoose = require('mongoose');
require('dotenv').config();

// Check if email was provided
const userEmail = process.argv[2];
if (!userEmail) {
  console.error('Please provide an email address');
  console.error('Usage: node make-admin.js user@example.com');
  process.exit(1);
}

// Connect to MongoDB
async function makeUserAdmin() {
  try {
    // Get MongoDB URI from environment variable or use a default
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/foodapp';
    
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');
    
    // Define a simple user schema for this script
    const userSchema = new mongoose.Schema({
      email: String,
      admin: Boolean
    });
    
    const User = mongoose.model('User', userSchema);
    
    // Find and update the user
    const result = await User.updateOne(
      { email: userEmail },
      { $set: { admin: true } }
    );
    
    if (result.matchedCount === 0) {
      console.error(`No user found with email: ${userEmail}`);
      process.exit(1);
    }
    
    if (result.modifiedCount === 0) {
      console.log(`User ${userEmail} is already an admin`);
    } else {
      console.log(`User ${userEmail} is now an admin!`);
    }
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

makeUserAdmin(); 