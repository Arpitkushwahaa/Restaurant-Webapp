import jwt from "jsonwebtoken";
import { IUserDocument } from "../models/user.model";
import { Response } from "express";

// Hardcoded secret key for development only
const SECRET_KEY = "thisisasecretkeyandshouldbereplacedinproduction";

export const generateToken = (res: Response, user: IUserDocument) => {
    // Using hardcoded SECRET_KEY for development
    // Extend token expiration to 7 days for better persistence
    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '7d' });
    
    // Set cookie with longer expiration as well
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        path: '/'
    });
    
    return token;
}