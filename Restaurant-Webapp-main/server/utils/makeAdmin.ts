/**
 * Utility function to make a user an admin
 * 
 * This can be run from the command line with:
 * npx ts-node server/utils/makeAdmin.ts [email]
 * 
 * If email is provided, it will make that user an admin
 * If no email is provided, it will create a new admin user
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { expand } from "dotenv-expand";
import path from "path";
import bcrypt from "bcryptjs";
import { User } from "../models/user.model";

// Load environment variables
const myEnv = dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
expand(myEnv);

// Connect to MongoDB
async function connectToMongo() {
  try {
    // Use provided MONGO_URI or default to localhost
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/food-app";
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  }
}

// Make user an admin by email
async function makeUserAdmin(email: string) {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error(`User with email ${email} not found`);
      return false;
    }

    user.admin = true;
    await user.save();
    console.log(`User ${email} is now an admin`);
    return true;
  } catch (error) {
    console.error("Failed to update user:", error);
    return false;
  }
}

// Create a new admin user
async function createAdminUser() {
  try {
    const adminEmail = "admin@eathub.com";
    const existingUser = await User.findOne({ email: adminEmail });
    
    if (existingUser) {
      console.log(`Admin user ${adminEmail} already exists`);
      if (!existingUser.admin) {
        existingUser.admin = true;
        await existingUser.save();
        console.log(`Updated ${adminEmail} to be an admin`);
      }
      return;
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const newAdmin = new User({
      fullname: "Admin User",
      email: adminEmail,
      password: hashedPassword,
      contact: 1234567890,
      admin: true
    });

    await newAdmin.save();
    console.log(`Created new admin user ${adminEmail} with password "admin123"`);
  } catch (error) {
    console.error("Failed to create admin user:", error);
  }
}

// Main function
async function main() {
  await connectToMongo();
  
  const targetEmail = process.argv[2];
  if (targetEmail) {
    await makeUserAdmin(targetEmail);
  } else {
    await createAdminUser();
  }

  await mongoose.disconnect();
}

// Run the script if called directly
if (require.main === module) {
  main().catch(console.error);
}

export { makeUserAdmin, createAdminUser }; 