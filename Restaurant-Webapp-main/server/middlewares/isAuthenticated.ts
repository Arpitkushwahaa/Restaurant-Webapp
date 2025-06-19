import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

// Hardcoded secret key for development only
const SECRET_KEY = "thisisasecretkeyandshouldbereplacedinproduction";

declare global {
    namespace Express{
        interface Request {
            id: string;
            isDemoUser?: boolean;
        }
    }
}

export const isAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // First try normal authentication with JWT
        const token = req.cookies.token;
        
        if (token) {
            try {
                const decoded = jwt.verify(token, SECRET_KEY) as { userId: string };
                req.id = decoded.userId;
                req.isDemoUser = false;
                return next();
            } catch (tokenError) {
                // Token verification failed, continue to fallback
                console.error("Token verification failed:", tokenError);
            }
        }
        
        // Check if demo mode is requested via query parameter or fallback is needed
        if (req.query.demo === 'true' || process.env.DEMO_MODE === 'true' || !process.env.MONGO_URI) {
            req.id = "demo-user-id-for-development";
            req.isDemoUser = true;
            return next();
        }
        
        // If normal auth failed and demo mode not enabled, return 401
        return res.status(401).json({
            success: false,
            message: "Please login to access this resource",
        });
    } catch (error) {
        console.error("Authentication error:", error);
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token",
        });
    }
};