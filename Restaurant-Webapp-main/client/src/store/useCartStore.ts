import { CartState } from "@/types/cartType";
import { MenuItem } from "@/types/restaurantType";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "sonner";


export const useCartStore = create<CartState>()(persist((set) => ({
    cart: [],
    userId: null, // Store current user ID
    restaurantId: null, // Store restaurant ID
    addToCart: (item: MenuItem, restaurantId: string) => {
        if (!item._id || !item.name || item.price == null) {
            console.error("Attempted to add an invalid item to the cart.", item);
            return; // Do not add item if it's invalid
        }
        
        set((state) => {
            // If adding from a different restaurant, clear the cart first
            if (state.restaurantId && state.restaurantId !== restaurantId) {
                console.log("Clearing cart because item is from a different restaurant");
                return {
                    cart: [{ ...item, quantity: 1 }],
                    restaurantId: restaurantId
                };
            }
            
            const exisitingItem = state.cart.find((cartItem) => cartItem._id === item._id);
            if (exisitingItem) {
                // already added in cart then inc qty
                return {
                    cart: state?.cart.map((cartItem) => cartItem._id === item._id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem),
                    restaurantId: restaurantId
                };
            } else {
                // add cart
                return {
                    cart: [...state.cart, { ...item, quantity: 1 }],
                    restaurantId: restaurantId
                }
            }
        })
    },
    // Function to add a single order item or multiple items to cart
    addOrderItem: (item: MenuItem | MenuItem[], restaurantId: string) => {
        // Handle array of items (for bulk adding from previous order)
        if (Array.isArray(item)) {
            if (item.length === 0) return false;
            
            let success = true;
            
            set((state) => {
                // If adding from a different restaurant, show error and don't add
                if (state.restaurantId && state.restaurantId !== restaurantId) {
                    toast.error("Cannot add items from different restaurants. Please clear your cart first.");
                    success = false;
                    return state; // Return unchanged state
                }
                
                const updatedCart = [...state.cart];
                
                // Process each item in the array
                item.forEach(menuItem => {
                    if (!menuItem._id || !menuItem.name || menuItem.price == null) {
                        console.error("Attempted to add an invalid item to the cart.", menuItem);
                        return; // Skip this item
                    }
                    
                    const existingItemIndex = updatedCart.findIndex((cartItem) => cartItem._id === menuItem._id);
                    
                    if (existingItemIndex >= 0) {
                        // Item already exists, increment quantity
                        updatedCart[existingItemIndex] = {
                            ...updatedCart[existingItemIndex],
                            quantity: updatedCart[existingItemIndex].quantity + (menuItem.quantity || 1)
                        };
                    } else {
                        // Add new item
                        updatedCart.push({ ...menuItem, quantity: menuItem.quantity || 1 });
                    }
                });
                
                return {
                    cart: updatedCart,
                    restaurantId: restaurantId
                };
            });
            
            return success;
        } 
        // Handle single item (original functionality)
        else {
            if (!item._id || !item.name || item.price == null) {
                console.error("Attempted to add an invalid item to the cart.", item);
                return false; // Do not add item if it's invalid
            }
            
            if (!restaurantId) {
                toast.error("Restaurant information is missing");
                return false;
            }
            
            let success = true;
            
            set((state) => {
                // If adding from a different restaurant, show error and don't add
                if (state.restaurantId && state.restaurantId !== restaurantId) {
                    toast.error("Cannot add items from different restaurants. Please clear your cart first.");
                    success = false;
                    return state; // Return unchanged state
                }
                
                const existingItem = state.cart.find((cartItem) => cartItem._id === item._id);
                if (existingItem) {
                    // Item already exists, increment quantity
                    return {
                        cart: state.cart.map((cartItem) => 
                            cartItem._id === item._id 
                                ? { ...cartItem, quantity: cartItem.quantity + (item.quantity || 1) } 
                                : cartItem
                        ),
                        restaurantId: restaurantId
                    };
                } else {
                    // Add new item
                    return {
                        cart: [...state.cart, { ...item, quantity: item.quantity || 1 }],
                        restaurantId: restaurantId
                    };
                }
            });
            
            return success;
        }
    },
    clearCart: () => {
        set({ cart: [], restaurantId: null });
    },
    removeFromTheCart: (id: string) => {
        set((state) => {
            const updatedCart = state.cart.filter((item) => item._id !== id);
            // If cart becomes empty, reset restaurant ID
            return {
                cart: updatedCart,
                restaurantId: updatedCart.length > 0 ? state.restaurantId : null
            };
        });
    },
    incrementQuantity: (id: string) => {
        set((state) => ({
            cart: state.cart.map((item) => item._id === id ? { ...item, quantity: item.quantity + 1 } : item)
        }))
    },
    decrementQuantity: (id: string) => {
        set((state) => ({
            cart: state.cart.map((item) => item._id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item)
        }))
    },
    // Add this function to update user ID and clear cart on user change
    updateUser: (newUserId: string | null) => {
        set((state) => {
            // If user ID changed, clear the cart
            if (state.userId !== newUserId) {
                return { cart: [], userId: newUserId, restaurantId: null };
            }
            return { userId: newUserId };
        });
    }
}),
    {
        name: 'cart-name',
        storage: createJSONStorage(() => localStorage)
    }
))