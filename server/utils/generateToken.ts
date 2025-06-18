import jwt from "jsonwebtoken";
import { IUserDocument } from "../models/user.model";
import { Response } from "express";

export const generateToken = (res:Response, user:IUserDocument ) => {
    if (!process.env.SECRET_KEY) {
        throw new Error('FATAL_ERROR: SECRET_KEY is not defined in environment variables.');
    }
    const token = jwt.sign({userId:user._id}, process.env.SECRET_KEY, {expiresIn:'1d'});
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24*60*60*1000,
        path: '/'
    });
    return token;
}