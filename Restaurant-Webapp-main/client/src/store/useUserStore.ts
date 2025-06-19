import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import axios from "axios";
import { LoginInputState, SignupInputState } from "@/schema/userSchema";
import { toast } from "sonner";
import { useCartStore } from "./useCartStore";

const API_END_POINT = "http://localhost:8085/api/v1/user"
axios.defaults.withCredentials = true;

type User = {
    fullname:string;
    email:string;
    contact:number;
    address:string;
    city:string;
    country:string;
    profilePicture:string;
    admin:boolean;
}

type UserState = {
    user: User | null;
    isAuthenticated: boolean;
    isCheckingAuth: boolean;
    loading: boolean;
    signup: (input:SignupInputState) => Promise<void>;
    login: (input:LoginInputState) => Promise<void>;
    checkAuthentication: () => Promise<void>;
    logout: () => Promise<void>;
    forgotPassword: (email:string) => Promise<void>; 
    resetPassword: (token:string, newPassword:string) => Promise<void>; 
    updateProfile: (input:any) => Promise<void>; 
    setAdmin: (userId: string, isAdmin: boolean) => Promise<void>;
}

export const useUserStore = create<UserState>()(persist((set) => ({
    user: null,
    isAuthenticated: false,
    isCheckingAuth: true,
    loading: false,
    // signup api implementation
    signup: async (input: SignupInputState) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/signup`, input, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.data.success) { 
                toast.success(response.data.message);
                set({ loading: false, user: response.data.user, isAuthenticated: true });
                // Update cart store with new user ID
                useCartStore.getState().updateUser(response.data.user.email);
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    login: async (input: LoginInputState) => {
        try {
            set({ loading: true });
            console.log('Login attempt with data:', input);
            const response = await axios.post(`${API_END_POINT}/login`, input, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Login response:', response.data);
            if (response.data.success) { 
                // Store credentials for future auto-login attempts (in case session expires)
                localStorage.setItem('last-user-email', input.email);
                localStorage.setItem('last-user-password', input.password);
                
                toast.success(response.data.message);
                set({ loading: false, user: response.data.user, isAuthenticated: true });
                // Update cart store with new user ID
                useCartStore.getState().updateUser(response.data.user.email);
            }
        } catch (error: any) {
            console.error('Login error details:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Login failed');
            set({ loading: false });
        }
    },
    checkAuthentication: async () => {
        try {
            set({ isCheckingAuth: true });
            const response = await axios.get(`${API_END_POINT}/check-auth`);
            if (response.data.success) {
                set({user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
                // Update cart store with user ID
                useCartStore.getState().updateUser(response.data.user.email);
            }
        } catch (error: any) {
            console.log('Auth check failed:', error?.response?.status);
            
            // Check if this is a 401 unauthorized error (session expired)
            if (error?.response?.status === 401) {
                // Clear session state
                set({isAuthenticated: false, user: null, isCheckingAuth: false });
                // Clear cart user ID
                useCartStore.getState().updateUser(null);
                
                // If we have stored credentials in localStorage, try to silently login
                const storedUser = localStorage.getItem('last-user-email');
                const storedPass = localStorage.getItem('last-user-password');
                
                if (storedUser && storedPass) {
                    try {
                        console.log('Attempting silent login with stored credentials');
                        // Attempt silent login
                        const loginResponse = await axios.post(`${API_END_POINT}/login`, 
                            { email: storedUser, password: storedPass },
                            { headers: { 'Content-Type': 'application/json' } }
                        );
                        
                        if (loginResponse.data.success) {
                            set({user: loginResponse.data.user, isAuthenticated: true, isCheckingAuth: false });
                            // Update cart store with user ID
                            useCartStore.getState().updateUser(loginResponse.data.user.email);
                            return;
                        }
                    } catch (loginError) {
                        // Silent login failed, clear stored credentials
                        localStorage.removeItem('last-user-email');
                        localStorage.removeItem('last-user-password');
                    }
                }
            }
            
            set({isAuthenticated: false, isCheckingAuth: false });
            // Clear cart user ID when not authenticated
            useCartStore.getState().updateUser(null);
        }
    },
    logout: async () => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/logout`);
            if (response.data.success) {
                toast.success(response.data.message);
                
                // Clear stored credentials
                localStorage.removeItem('last-user-email');
                localStorage.removeItem('last-user-password');
                
                // Clear cart user ID on logout
                useCartStore.getState().updateUser(null);
                
                set({ loading: false, user: null, isAuthenticated: false })
            }
        } catch (error:any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    forgotPassword: async (email: string) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/forgot-password`, { email });
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false });
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    resetPassword: async (token: string, newPassword: string) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/reset-password/${token}`, { newPassword });
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false });
            }
        } catch (error: any) {
            toast.error(error.response.data.message);
            set({ loading: false });
        }
    },
    updateProfile: async (input:any) => {
        try {
            set({ loading: true });
            console.log('Updating profile with data:', input);
            
            const response = await axios.put(`${API_END_POINT}/profile/update`, input, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            console.log('Profile update response:', response.data);
            
            if (response.data.success) {
                toast.success(response.data.message);
                // Make sure to update the user state with the updated data
                set({ user: response.data.user, isAuthenticated: true, loading: false });
            } else {
                // Handle non-error but unsuccessful responses
                toast.error(response.data.message || 'Failed to update profile');
                set({ loading: false });
            }
        } catch (error: any) {
            console.error('Error updating profile:', error);
            
            // Handle different error scenarios
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error('Error response data:', error.response.data);
                console.error('Error response status:', error.response.status);
                toast.error(error.response.data.message || 'Failed to update profile');
            } else if (error.request) {
                // The request was made but no response was received
                console.error('No response received:', error.request);
                toast.error('No response from server. Please check your connection.');
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error message:', error.message);
                toast.error('An error occurred while updating profile');
            }
            
            set({ loading: false });
        }
    },
    setAdmin: async (userId: string, isAdmin: boolean) => {
        try {
            set({ loading: true });
            const response = await axios.post(`${API_END_POINT}/set-admin`, 
                { userId, isAdmin },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            
            if (response.data.success) {
                toast.success(response.data.message);
                set({ loading: false });
                return response.data.user;
            }
        } catch (error: any) {
            console.error('Error setting admin status:', error.response?.data || error.message);
            toast.error(error.response?.data?.message || 'Failed to update admin status');
            set({ loading: false });
        }
    }
}),
    {
        name: 'user-state',
        storage: createJSONStorage(() => localStorage),
        partialize: (state) => ({
            user: state.user,
            isAuthenticated: state.isAuthenticated,
            // Don't store loading or isCheckingAuth states
        }),
    }
))