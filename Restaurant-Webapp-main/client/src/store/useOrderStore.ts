import { CheckoutSessionRequest, OrderState } from "@/types/orderType";
import axios from "axios";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { toast } from "sonner";
import { API_URL, getEndpoint } from "@/lib/api";

// Use the API_URL from environment variables
const API_END_POINT: string = getEndpoint("/order");
axios.defaults.withCredentials = true;

// Load Razorpay script
const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

export const useOrderStore = create<OrderState>()(
    persist(
        (set) => ({
            loading: false,
            orders: [],
            createCheckoutSession: async (checkoutSession: CheckoutSessionRequest) => {
                try {
                    set({ loading: true });
                    
                    // Convert string values to numbers for API
                    const processedCheckoutSession = {
                        ...checkoutSession,
                        cartItems: checkoutSession.cartItems.map(item => ({
                            ...item,
                            price: Number(item.price),
                            quantity: Number(item.quantity)
                        }))
                    };
                    
                    // Create order on server
                    console.log("Sending checkout request:", processedCheckoutSession);
                    const response = await axios.post(`${API_END_POINT}/checkout/create-checkout-session`, processedCheckoutSession, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    console.log("Checkout response:", response.data);
                    
                    // Load Razorpay script
                    const isScriptLoaded = await loadRazorpayScript();
                    if (!isScriptLoaded) {
                        toast.error("Failed to load Razorpay. Please try again.");
                        set({ loading: false });
                        return;
                    }
                    
                    // Get the Razorpay response data
                    const { 
                        key_id, 
                        order: razorpayOrder, 
                        amount, 
                        currency, 
                        name, 
                        description,
                        customer_name,
                        customer_email,
                        customer_contact,
                        order_id
                    } = response.data;
                    
                    // Validate required fields
                    if (!key_id || !razorpayOrder || !razorpayOrder.id) {
                        toast.error("Payment initialization failed. Missing required data.");
                        set({ loading: false });
                        return;
                    }
                    
                    // Initialize Razorpay options with fallbacks for missing data
                    const options = {
                        key: key_id,
                        amount: amount?.toString() || "0",
                        currency: currency || "INR",
                        name: name || "Food Order",
                        description: description || "Order from Restaurant",
                        order_id: razorpayOrder.id,
                        prefill: {
                            name: customer_name || "",
                            email: customer_email || "",
                            contact: customer_contact || ""
                        },
                        notes: {
                            order_id: order_id || ""
                        },
                        theme: {
                            color: "#FF6B35" // Use the app's primary color
                        },
                        handler: async function(response: any) {
                            try {
                                // Verify payment on server
                                const verifyResponse = await axios.post(`${API_END_POINT}/payment/verify`, {
                                    razorpay_order_id: response.razorpay_order_id,
                                    razorpay_payment_id: response.razorpay_payment_id,
                                    razorpay_signature: response.razorpay_signature,
                                    order_id: order_id
                                });
                                
                                if (verifyResponse.data.success) {
                                    toast.success("Payment successful!");
                                    // Redirect to order status page
                                    window.location.href = "/order/status";
                                } else {
                                    toast.error("Payment verification failed");
                                }
                            } catch (error) {
                                console.error("Payment verification error:", error);
                                toast.error("Payment verification failed");
                            }
                        }
                    };
                    
                    // Open Razorpay checkout
                    const razorpay = new (window as any).Razorpay(options);
                    razorpay.open();
                    
                    set({ loading: false });
                } catch (error: any) {
                    console.error("Error creating checkout session:", error);
                    const errorMsg = error.response?.data?.message || "Failed to create checkout session";
                    toast.error(errorMsg);
                    set({ loading: false });
                }
            },
            getOrderDetails: async () => {
                try {
                    set({ loading: true });
                    const response = await axios.get(`${API_END_POINT}/`);
                    set({ loading: false, orders: response.data.orders });
                } catch (error) {
                    console.error("Error fetching order details:", error);
                    toast.error("Failed to fetch order details");
                    set({ loading: false });
                }
            },
            deleteOrder: async (orderId: string) => {
                try {
                    set({ loading: true });
                    await axios.delete(`${API_END_POINT}/${orderId}`);
                    
                    // Update the orders list after deletion
                    set((state) => ({
                        loading: false,
                        orders: state.orders.filter(order => order._id !== orderId)
                    }));
                    
                    return true;
                } catch (error) {
                    console.error("Error deleting order:", error);
                    toast.error("Failed to delete order");
                    set({ loading: false });
                    throw error;
                }
            }
        }),
        {
            name: 'order-name',
            storage: createJSONStorage(() => localStorage)
        }
    )
);