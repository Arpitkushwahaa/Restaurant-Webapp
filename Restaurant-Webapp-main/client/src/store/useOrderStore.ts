import { CheckoutSessionRequest, OrderState } from "@/types/orderType";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "sonner";

// Use local API server for development, production server for production
const API_END_POINT: string = "http://localhost:8085/api/v1/order";
axios.defaults.withCredentials = true;

export const useOrderStore = create<OrderState>()(persist((set => ({
    loading: false,
    orders: [],
    createCheckoutSession: async (checkoutSession: CheckoutSessionRequest) => {
        try {
            set({ loading: true });
            
            // Create order on server
            const response = await axios.post(`${API_END_POINT}/checkout/create-checkout-session`, checkoutSession, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.data.success) {
                toast.success("Order placed successfully!");
                // Redirect to order status page
                window.location.href = "/order/status";
            } else {
                toast.error("Failed to place order");
            }
            
            set({ loading: false });
        } catch (error) {
            console.error("Error creating checkout session:", error);
            toast.error("Failed to create checkout session");
            set({ loading: false });
        }
    },
    getOrderDetails: async () => {
        try {
            set({loading:true});
            const response = await axios.get(`${API_END_POINT}/`);
          
            set({loading:false, orders:response.data.orders});
        } catch (error) {
            console.error("Error fetching order details:", error);
            toast.error("Failed to fetch order details");
            set({loading:false});
        }
    }
})), {
    name: 'order-name',
    storage: createJSONStorage(() => localStorage)
}))