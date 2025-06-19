import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import { Order } from "../models/order.model";

type CheckoutSessionRequest = {
    cartItems: {
        menuId: string;
        name: string;
        image: string;
        price: number;
        quantity: number
    }[],
    deliveryDetails: {
        name: string;
        email: string;
        address: string;
        city: string;
        contact?: string;
        country?: string;
    },
    restaurantId: string
}

// Add mock data at the top of the file
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
            {
                name: "Pepperoni Pizza",
                price: 14.99,
                quantity: 1
            },
            {
                name: "Garlic Bread",
                price: 4.99,
                quantity: 1
            }
        ],
        totalAmount: 19.98,
        status: "Delivered",
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
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
            {
                name: "Cheeseburger",
                price: 9.99,
                quantity: 2
            },
            {
                name: "French Fries",
                price: 3.99,
                quantity: 1
            },
            {
                name: "Milkshake",
                price: 4.99,
                quantity: 1
            }
        ],
        totalAmount: 28.96,
        status: "Preparing",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
    }
];

export const getUserOrders = async (req: Request & { id?: string }, res: Response) => {
    try {
        // For development - Return mock orders
        if (req.id === "demo-user-id-for-development") {
            return res.status(200).json({
                success: true,
                orders: mockUserOrders
            });
        }

        // Original logic for production
        const orders = await Order.find({ user: req.id })
            .populate("restaurant")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Error in getUserOrders:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export const createCheckoutSession = async (req: Request, res: Response) => {
    try {
        const checkoutSessionRequest: CheckoutSessionRequest = req.body;
        const restaurant = await Restaurant.findById(checkoutSessionRequest.restaurantId).populate('menus');
        
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found."
            });
        }
        
        // Calculate total amount
        let totalAmount = 0;
        checkoutSessionRequest.cartItems.forEach(item => {
            totalAmount += item.price * item.quantity;
        });
        
        // Create a new order
        const order = new Order({
            restaurant: restaurant._id,
            user: req.id,
            deliveryDetails: checkoutSessionRequest.deliveryDetails,
            cartItems: checkoutSessionRequest.cartItems,
            status: "confirmed", // Directly mark as confirmed since we're bypassing payment
            totalAmount: totalAmount
        });
        
        // Save order
        await order.save();
        
        // Return success response with order ID
        return res.status(200).json({
            success: true,
            message: "Order created successfully",
            order_id: order._id
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            success: false,
            message: "Internal server error" 
        });
    }
};