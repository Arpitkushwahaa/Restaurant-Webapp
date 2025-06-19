import { Request, Response } from "express";
import uploadImageOnCloudinary from "../utils/imageUpload";
import {Menu} from "../models/menu.model";
import { Restaurant } from "../models/restaurant.model";
import mongoose, { ObjectId } from "mongoose";

// Mock menu items for development
const mockMenuItems = [
    {
        _id: "mock-menu-1",
        name: "Classic Burger",
        description: "Juicy beef patty with lettuce, tomato, and special sauce",
        price: 8.99,
        image: "https://placehold.co/300x200?text=Classic+Burger",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: "mock-menu-2",
        name: "Margherita Pizza",
        description: "Traditional pizza with tomato sauce, mozzarella, and basil",
        price: 12.99,
        image: "https://placehold.co/300x200?text=Pizza",
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        _id: "mock-menu-3",
        name: "Caesar Salad",
        description: "Fresh romaine lettuce with parmesan, croutons, and Caesar dressing",
        price: 7.99,
        image: "https://placehold.co/300x200?text=Salad",
        createdAt: new Date(),
        updatedAt: new Date()
    }
];

export const addMenu = async (req: Request & { id?: string }, res: Response) => {
    try {
        // For development mode
        if (req.id === "demo-user-id-for-development") {
            const mockMenu = {
                _id: `mock-menu-${Date.now()}`,
                name: req.body.name || "New Menu Item",
                description: req.body.description || "Delicious new menu item",
                price: req.body.price || 9.99,
                image: "https://placehold.co/300x200?text=New+Menu+Item",
                category: req.body.category || "Main Course",
                createdAt: new Date(),
                updatedAt: new Date()
            };
            
            return res.status(201).json({
                success: true,
                message: "Menu added successfully in development mode",
                menu: mockMenu
            });
        }
        
        // Original code for production
        const {name, description, price, category} = req.body;
        const file = req.file;
        if(!file){
            return res.status(400).json({
                success:false,
                message:"Image is required"
            })
        };
        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
        const menu: any = await Menu.create({
            name , 
            description,
            price,
            category: category || "Main Course",
            image:imageUrl
        });
        const restaurant = await Restaurant.findOne({user:req.id});
        if(restaurant){
            (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id);
            await restaurant.save();
        }

        return res.status(201).json({
            success:true,
            message:"Menu added successfully",
            menu
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"}); 
    }
}

export const editMenu = async (req: Request & { id?: string }, res: Response) => {
    try {
        // For development mode
        if (req.id === "demo-user-id-for-development") {
            return res.status(200).json({
                success: true,
                message: "Menu updated in development mode",
                menu: {
                    _id: req.params.id,
                    name: req.body.name || "Updated Menu Item",
                    description: req.body.description || "Updated description",
                    price: req.body.price || 10.99,
                    category: req.body.category || "Main Course",
                    image: "https://placehold.co/300x200?text=Updated+Menu+Item",
                    updatedAt: new Date()
                }
            });
        }
        
        // Original code for production
        const {id} = req.params;
        const {name, description, price, category} = req.body;
        const file = req.file;
        const menu = await Menu.findById(id);
        if(!menu){
            return res.status(404).json({
                success:false,
                message:"Menu not found!"
            })
        }
        if(name) menu.name = name;
        if(description) menu.description = description;
        if(price) menu.price = price;
        if(category) menu.category = category;

        if(file){
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            menu.image = imageUrl;
        }
        await menu.save();

        return res.status(200).json({
            success:true,
            message:"Menu updated",
            menu,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"}); 
    }
}

// Add a getMenus function for the GET endpoint
export const getMenus = async (req: Request, res: Response) => {
    try {
        // For development mode, return mock menu items
        return res.status(200).json({
            success: true,
            menus: mockMenuItems
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        }); 
    }
}

// Add a deleteMenu function
export const deleteMenu = async (req: Request & { id?: string }, res: Response) => {
    try {
        // For development mode
        if (req.id === "demo-user-id-for-development") {
            return res.status(200).json({
                success: true,
                message: "Menu deleted in development mode"
            });
        }
        
        // Original code for production
        const { id } = req.params;
        await Menu.findByIdAndDelete(id);
        
        return res.status(200).json({
            success: true,
            message: "Menu deleted successfully"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        }); 
    }
}