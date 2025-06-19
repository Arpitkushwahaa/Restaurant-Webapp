import mongoose, { Document } from "mongoose";

type DeliveryDetails = {
    email: string;
    name: string;
    contact: string;
    address: string;
    city: string;
    country: string;
}

type CartItems = {
    menuId: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
}

export interface IOrder extends Document {
    _id: mongoose.Types.ObjectId;
    user: mongoose.Schema.Types.ObjectId;
    restaurant: mongoose.Schema.Types.ObjectId;
    deliveryDetails: DeliveryDetails,
    cartItems: CartItems[];
    totalAmount: number;
    status: "pending" | "confirmed" | "preparing" | "outfordelivery" | "delivered";
    paymentId?: string;
}

const orderSchema = new mongoose.Schema<IOrder>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    deliveryDetails:{
        email:{type:String, required:true},
        name:{type:String, required:true},
        contact:{type:String, required:true},
        address:{type:String, required:true},
        city:{type:String, required:true},
        country:{type:String, required:true},
    },
    cartItems:[
        {
            menuId:{type:String, required:true},
            name:{type:String, required:true},
            image:{type:String, required:true},
            price:{type:Number, required:true},
            quantity:{type:Number, required:true},
        }
    ],
    totalAmount:Number,
    status:{
        type:String,
        enum:["pending" , "confirmed" , "preparing" , "outfordelivery" , "delivered"],
        required:true
    },
    paymentId: {
        type: String,
        default: null
    }

}, { timestamps: true });

export const Order = mongoose.model<IOrder>("Order", orderSchema);