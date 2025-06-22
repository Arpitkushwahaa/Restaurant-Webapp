import { MenuItem } from "./restaurantType";

export interface CartItem extends MenuItem { 
    quantity:number;
}
export type CartState = {
    cart:CartItem[];
    userId: string | null;
    restaurantId: string | null;
    addToCart:(item:MenuItem, restaurantId: string) => void;
    addOrderItem:(item:MenuItem, restaurantId: string) => boolean;
    clearCart: () => void;
    removeFromTheCart: (id:string) => void;
    incrementQuantity: (id:string) => void;
    decrementQuantity: (id:string) => void;
    updateUser: (newUserId: string | null) => void;
}