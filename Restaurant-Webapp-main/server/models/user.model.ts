import mongoose, { Document, Model } from "mongoose";

export interface IUser {
    fullname: string;
    email: string;
    password: string;
    contact: number;
    address?: string;
    city?: string;
    country?: string;
    profilePicture?: string;
    admin?: boolean;
    lastLogin?: Date;
}

export interface IUserDocument extends IUser, Document {}

const userSchema = new mongoose.Schema<IUserDocument>({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        default: ""
    },
    city: {
        type: String,
        default: ""
    },
    country: {
        type: String,
        default: ""
    },
    profilePicture: {
        type: String,
        default: "",
    },
    admin: {
        type: Boolean, 
        default: false
    },
    lastLogin: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

export const User: Model<IUserDocument> = mongoose.model<IUserDocument>("User", userSchema);