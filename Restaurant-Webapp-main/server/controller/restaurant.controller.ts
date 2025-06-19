import { Request, Response } from "express";
import { Restaurant } from "../models/restaurant.model";
import { Multer } from "multer";
import uploadImageOnCloudinary from "../utils/imageUpload";
import { Order } from "../models/order.model";

// Add this mock data at the top of the file
const mockRestaurantOrders = [
    {
        _id: "mock-order-1",
        user: {
            _id: "demo-user-id",
            fullname: "Demo Customer"
        },
        restaurant: "demo-restaurant-id",
        items: [
            {
                name: "Pizza Margherita",
                price: 12.99,
                quantity: 2
            },
            {
                name: "Chicken Wings",
                price: 8.99,
                quantity: 1
            }
        ],
        totalAmount: 34.97,
        status: "Pending",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: "mock-order-2",
        user: {
            _id: "demo-user-id-2",
            fullname: "Another Customer"
        },
        restaurant: "demo-restaurant-id",
        items: [
            {
                name: "Burger",
                price: 9.99,
                quantity: 1
            }
        ],
        totalAmount: 9.99,
        status: "Completed",
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

export const createRestaurant = async (req: Request, res: Response) => {
    try {
        // For development mode
        if (req.id === "demo-user-id-for-development") {
            return res.status(201).json({
                success: true,
                message: "Restaurant created successfully in development mode",
                restaurant: {
                    _id: "demo-restaurant-id",
                    name: "Demo Restaurant",
                    cuisine: "International",
                    address: "123 Demo Street",
                    phone: "123-456-7890",
                    image: "https://placehold.co/600x400?text=Demo+Restaurant",
                    owner: "demo-user-id-for-development",
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });
        }
        
        // Original code for production
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
        const file = req.file;

        if (!restaurantName || !city || !country || !deliveryTime || !cuisines) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // Handle file upload if provided
        let imageUrl = "";
        if (file) {
            imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
        }

        const parsedCuisines = typeof cuisines === 'string' ? cuisines.split(',').map(c => c.trim()) : cuisines;

        const restaurant = await Restaurant.create({
            restaurantName,
            city,
            country,
            deliveryTime,
            cuisines: parsedCuisines,
            imageUrl,
            user: req.id
        });

        res.status(201).json({
            success: true,
            message: "Restaurant created successfully",
            restaurant
        });
    } catch (error) {
        console.error("Error creating restaurant:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create restaurant"
        });
    }
};

export const getRestaurant = async (req: Request, res: Response) => {
    try {
        const restaurant = await Restaurant.findOne({ user: req.id }).populate('menus');
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                restaurant:[],
                message: "Restaurant not found"
            })
        };
        return res.status(200).json({ success: true, restaurant });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}
export const updateRestaurant = async (req: Request, res: Response) => {
    try {
        const { restaurantName, city, country, deliveryTime, cuisines } = req.body;
        const file = req.file;
        const restaurant = await Restaurant.findOne({ user: req.id });
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            })
        };
        restaurant.restaurantName = restaurantName;
        restaurant.city = city;
        restaurant.country = country;
        restaurant.deliveryTime = deliveryTime;
        if(typeof cuisines === 'string'){
            restaurant.cuisines = cuisines.split(',').map(cuisine => cuisine.trim());
        } else if (Array.isArray(cuisines)){
            restaurant.cuisines = cuisines;
        }

        if (file) {
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            restaurant.imageUrl = imageUrl;
        }
        await restaurant.save();
        return res.status(200).json({
            success: true,
            message: "Restaurant updated",
            restaurant
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}
export const getRestaurantOrders = async (req: Request & { id?: string }, res: Response) => {
    try {
        // For development - Return mock orders
        if (req.id === "demo-user-id-for-development") {
            return res.status(200).json({
                success: true,
                orders: mockRestaurantOrders
            });
        }

        // Original logic for production
        const restaurants = await Restaurant.find({ owner: req.id });
        const restaurantIds = restaurants.map(restaurant => restaurant._id);
        
        const orders = await Order.find({ restaurant: { $in: restaurantIds } })
            .populate("user", "fullname")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        console.error('Error in getRestaurantOrders:', error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
export const updateOrderStatus = async (req: Request, res: Response) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            })
        }
        order.status = status;
        await order.save();
        return res.status(200).json({
            success: true,
            status:order.status,
            message: "Status updated"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" })
    }
}
export const searchRestaurant = async (req: Request, res: Response) => {
    try {
        const searchText = req.params.searchText || "";
        const searchQuery = req.query.searchQuery as string || "";
        const selectedCuisines = (req.query.selectedCuisines as string || "").split(",").filter(cuisine => cuisine);
        let query: any = {};
        
        // Basic search based on searchText (name, city, country)
        if (searchText) {
            query.$or = [
                { restaurantName: { $regex: searchText, $options: 'i' } },
                { city: { $regex: searchText, $options: 'i' } },
                { country: { $regex: searchText, $options: 'i' } },
            ];
        }
        
        // Filter on the basis of searchQuery
        if (searchQuery) {
            // If there's already a $or from searchText, we need to handle it differently
            if (query.$or) {
                // Combine both conditions with $and
                query.$and = [
                    { $or: query.$or },
                    { $or: [
                        { restaurantName: { $regex: searchQuery, $options: 'i' } },
                        { cuisines: { $regex: searchQuery, $options: 'i' } }
                    ]}
                ];
                delete query.$or; // Remove the original $or as it's now in $and
            } else {
                query.$or = [
                    { restaurantName: { $regex: searchQuery, $options: 'i' } },
                    { cuisines: { $regex: searchQuery, $options: 'i' } }
                ];
            }
        }
        
        // Get all restaurants with their menus populated
        const allRestaurants = await Restaurant.find(query).populate({
            path: 'menus',
            select: 'name description' // Select fields we need from menus
        });
        
        let filteredRestaurants = allRestaurants;
        
        // If cuisine filters are applied, filter restaurants
        if (selectedCuisines.length > 0) {
            filteredRestaurants = allRestaurants.filter(restaurant => {
                // Check if restaurant has any of the selected cuisines in its cuisines array
                const hasCuisine = restaurant.cuisines.some(cuisine => 
                    selectedCuisines.some(selected => 
                        cuisine.toLowerCase().includes(selected.toLowerCase())
                    )
                );
                
                // If restaurant has the cuisine, include it
                if (hasCuisine) return true;
                
                // Otherwise, check if any menu items include the cuisine in their name or description
                if (restaurant.menus && restaurant.menus.length > 0) {
                    return restaurant.menus.some((menu: any) => {
                        return selectedCuisines.some(cuisine => 
                            (menu.name && menu.name.toLowerCase().includes(cuisine.toLowerCase())) ||
                            (menu.description && menu.description.toLowerCase().includes(cuisine.toLowerCase()))
                        );
                    });
                }
                
                return false;
            });
        }
        
        return res.status(200).json({
            success: true,
            data: filteredRestaurants
        });
    } catch (error) {
        console.error("Search restaurant error:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}
export const getRestaurantById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id).populate("menus");
        if (!restaurant) {
            return res.status(404).json({
                success: false,
                message: "Restaurant not found"
            });
        }
        res.status(200).json({
            success: true,
            restaurant
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}