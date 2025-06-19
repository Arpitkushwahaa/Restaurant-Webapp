import { Request, Response } from "express";
import { User, IUserDocument } from "../models/user.model";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";

// Extended IUserDocument interface for TypeScript support
interface ExtendedUserDocument extends IUserDocument {
    createdAt: Date;
    updatedAt: Date;
}

// We'll use type assertions instead of extending the Request type

export const signup = async (req: Request, res: Response) => {
    try {
        const { fullname, email, password, contact } = req.body;

        // Validate required fields
        if (!fullname || !email || !password || !contact) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "A user with this email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            fullname,
            email,
            password: hashedPassword,
            contact: Number(contact),
            admin: false // For security, admin should be set manually in the database
        });

        generateToken(res, user as ExtendedUserDocument);

        const typedUser = user as ExtendedUserDocument;

        const userData = {
            _id: typedUser._id,
            fullname: typedUser.fullname,
            email: typedUser.email,
            contact: typedUser.contact,
            admin: typedUser.admin,
            createdAt: typedUser.createdAt
        };

        return res.status(201).json({
            success: true,
            message: "Account created successfully.",
            user: userData
        });

    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ success: false, message: "An internal server error occurred." });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found. Please sign up." });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials." });
        }

        generateToken(res, user);
        
        user.lastLogin = new Date();
        await user.save();

        const userData = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            contact: user.contact,
            admin: user.admin,
            address: user.address,
            city: user.city,
            country: user.country,
            profilePicture: user.profilePicture,
            lastLogin: user.lastLogin
        };

        return res.status(200).json({
            success: true,
            message: `Welcome back, ${user.fullname}!`,
            user: userData
        });

    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ success: false, message: "An internal server error occurred." });
    }
};

export const logout = async (_: Request, res: Response) => {
    try {
        // Clear both regular token and demo mode cookies
        res.clearCookie("token");
        res.clearCookie("demo_mode");
        
        return res.status(200).json({
            success: true,
            message: "Logged out successfully."
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ 
            success: false,
            message: "An error occurred during logout. Please try again." 
        });
    }
};

export const checkAuth = async (req: Request & { id?: string, isDemoUser?: boolean }, res: Response) => {
    try {
        // For demo mode
        if (req.isDemoUser) {
            return res.status(200).json({
                success: true,
                isDemoUser: true,
                user: {
                    _id: "demo-user-id",
                    fullname: "Demo User",
                    email: "demo@example.com",
                    contact: 1234567890,
                    address: "",
                    city: "",
                    country: "",
                    profilePicture: "",
                    admin: true,
                    lastLogin: new Date()
                }
            });
        }

        // For authenticated users
        if (!req.id) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }
        
        const user = await User.findById(req.id).select("-password") as ExtendedUserDocument;
        if (!user) {
            console.log('User not found in database with ID:', req.id);
            
            return res.status(401).json({
                success: false,
                message: "Session expired. Please log in again."
            });
        }
        
        return res.status(200).json({
            success: true,
            isDemoUser: false,
            user
        });
    } catch (error: any) {
        console.error('Error in checkAuth:', error.message || error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

export const updateProfile = async (req: Request & { id?: string }, res: Response) => {
    try {
        const { fullname, contact, address, city, country } = req.body;
        
        // For demo mode
        if (req.query.demo === 'true' || process.env.DEMO_MODE === 'true' || !process.env.MONGO_URI) {
            return res.status(200).json({
                success: true,
                message: "Profile updated successfully in demo mode",
                isDemoUser: true,
                user: {
                    _id: "demo-user-id",
                    fullname: fullname || "Demo User",
                    email: "demo@example.com",
                    contact: contact || 1234567890,
                    address: address || "",
                    city: city || "",
                    country: country || "",
                    profilePicture: "",
                    admin: true,
                    lastLogin: new Date()
                }
            });
        }
        
        // Update the user's profile
        const updatedUser = await User.findByIdAndUpdate(
            req.id,
            { fullname, contact, address, city, country },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating profile."
        });
    }
};

export const setAdmin = async (req: Request, res: Response) => {
    try {
        const { userId, isAdmin } = req.body;
        
        console.log('Setting admin status:', { userId, isAdmin });
        
        // Validate inputs
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        // For demo mode
        if (req.query.demo === 'true' || process.env.DEMO_MODE === 'true' || !process.env.MONGO_URI) {
            return res.status(200).json({
                success: true,
                message: "Admin status updated in demo mode",
                isDemoUser: true
            });
        }
        
        // Update user admin status
        const user = await User.findByIdAndUpdate(
            userId, 
            { admin: !!isAdmin }, 
            { new: true }
        ).select("-password");
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        
        return res.status(200).json({
            success: true,
            message: `User ${isAdmin ? 'is now an admin' : 'is no longer an admin'}`,
            user
        });
    } catch (error) {
        console.error("Error setting admin status:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating admin status."
        });
    }
};

export const getUsers = async (req: Request & { id?: string }, res: Response) => {
    try {
        // First check if requesting user is admin
        const adminUser = await User.findById(req.id);
        if (!adminUser?.admin) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        // For demo mode
        if (req.query.demo === 'true' || process.env.DEMO_MODE === 'true' || !process.env.MONGO_URI) {
            return res.status(200).json({
                success: true,
                isDemoUser: true,
                users: [
                    {
                        _id: "demo-user-id-1",
                        fullname: "Demo Admin",
                        email: "admin@example.com",
                        contact: 1234567890,
                        admin: true
                    },
                    {
                        _id: "demo-user-id-2",
                        fullname: "Demo User",
                        email: "user@example.com",
                        contact: 9876543210,
                        admin: false
                    }
                ]
            });
        }

        // Get all users, excluding password field
        const users = await User.find().select("-password -__v");
        
        return res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while fetching users."
        });
    }
};
