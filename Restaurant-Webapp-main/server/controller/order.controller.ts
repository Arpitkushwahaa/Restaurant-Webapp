import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import { Order, IOrder } from "../models/order.model";
import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || ""
});

type CheckoutSessionRequest = {
  cartItems: {
    menuId: string;
    name: string;
    image: string;
    price: number | string;
    quantity: number | string;
  }[];
  deliveryDetails: {
    name: string;
    email: string;
    address: string;
    city: string;
    contact: string;
    country: string;
  };
  restaurantId: string;
};

const mockUserOrders = [
  {
    _id: "mock-user-order-1",
    user: "demo-user-id-for-development",
    restaurant: {
      _id: "mock-restaurant-1",
      name: "Pizza Palace",
      location: "123 Main St",
      cuisine: "Italian"
    },
    items: [
      { name: "Pepperoni Pizza", price: 14.99, quantity: 1 },
      { name: "Garlic Bread", price: 4.99, quantity: 1 }
    ],
    totalAmount: 19.98,
    status: "Delivered",
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
  },
  {
    _id: "mock-user-order-2",
    user: "demo-user-id-for-development",
    restaurant: {
      _id: "mock-restaurant-2",
      name: "Burger Joint",
      location: "456 Oak Ave",
      cuisine: "American"
    },
    items: [
      { name: "Cheeseburger", price: 9.99, quantity: 2 },
      { name: "French Fries", price: 3.99, quantity: 1 },
      { name: "Milkshake", price: 4.99, quantity: 1 }
    ],
    totalAmount: 28.96,
    status: "Preparing",
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
  }
];

export const getUserOrders = async (req: Request & { id?: string }, res: Response) => {
  try {
    if (req.id === "demo-user-id-for-development") {
      return res.status(200).json({ success: true, orders: mockUserOrders });
    }

    const orders = await Order.find({ user: req.id })
      .populate("restaurant")
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error in getUserOrders:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const createCheckoutSession = async (req: Request & { id?: string }, res: Response) => {
  try {
    const data: CheckoutSessionRequest = req.body;
    
    console.log("Received checkout data:", data);
    
    if (!data.restaurantId) {
      return res.status(400).json({ success: false, message: "Restaurant ID is required" });
    }
    
    const restaurant = await Restaurant.findById(data.restaurantId);

    if (!restaurant) {
      return res.status(404).json({ success: false, message: "Restaurant not found" });
    }
    
    if (!data.cartItems || data.cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart cannot be empty" });
    }

    // Ensure price and quantity are numbers
    const processedCartItems = data.cartItems.map(item => ({
      ...item,
      price: typeof item.price === 'string' ? parseFloat(item.price) : item.price,
      quantity: typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : item.quantity
    }));

    const totalAmount = processedCartItems.reduce(
      (sum, item) => sum + (Number(item.price) * Number(item.quantity)),
      0
    );

    const amountInPaise = Math.round(totalAmount * 100);
    
    console.log("Creating order with total amount:", totalAmount);

    const orderDoc = await Order.create({
      restaurant: restaurant._id,
      user: req.id,
      deliveryDetails: data.deliveryDetails,
      cartItems: processedCartItems,
      status: "pending",
      totalAmount
    });
    
    // Cast the document to get TypeScript to recognize the _id property
    const order = orderDoc.toObject();
    const orderId = order._id.toString();
    const restaurantId = restaurant._id.toString();
    
    console.log("Order created with ID:", orderId);

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: orderId,
      notes: {
        orderId: orderId,
        userId: req.id || "",
        restaurantId: restaurantId
      }
    });
    
    console.log("Razorpay order created:", razorpayOrder.id);
    
    // Ensure we have a restaurant name to use
    const restaurantName = restaurant.restaurantName || "Restaurant Order";

    return res.status(200).json({
      success: true,
      order: razorpayOrder,
      key_id: process.env.RAZORPAY_KEY_ID,
      order_id: orderId,
      amount: amountInPaise,
      currency: "INR",
      name: restaurantName,
      description: `Order from ${restaurantName}`,
      customer_name: data.deliveryDetails.name,
      customer_email: data.deliveryDetails.email,
      customer_contact: data.deliveryDetails.contact || ""
    });
  } catch (error: any) {
    console.error("Error in createCheckoutSession:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Internal server error",
      error: error.toString()
    });
  }
};

// ✅ Manual client-side payment verification
export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_id } = req.body;

    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "");
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest("hex");

    if (digest === razorpay_signature) {
      const order = await Order.findById(order_id);
      if (!order) {
        return res.status(404).json({ success: false, message: "Order not found" });
      }

      order.status = "confirmed";
      order.paymentId = razorpay_payment_id;
      await order.save();

      return res.status(200).json({
        success: true,
        message: "Payment verified successfully"
      });
    } else {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error("Error in verifyPayment:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Delete an order
export const deleteOrder = async (req: Request & { id?: string }, res: Response) => {
  try {
    const { id } = req.params;
    
    // Validate order ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid order ID" });
    }
    
    // Find the order
    const order = await Order.findById(id);
    
    // Check if order exists
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    
    // Check if the user owns the order
    if (order.user.toString() !== req.id) {
      return res.status(403).json({ success: false, message: "You are not authorized to delete this order" });
    }
    
    // Delete the order
    await Order.findByIdAndDelete(id);
    
    return res.status(200).json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error in deleteOrder:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};
