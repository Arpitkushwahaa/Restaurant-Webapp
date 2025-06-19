interface RazorpayOptions {
  key: string;
  amount: string;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
    method?: string;
  };
  notes?: Record<string, string>;
  theme?: {
    color?: string;
    backdrop_color?: string;
    hide_topbar?: boolean;
  };
  modal?: {
    backdropclose?: boolean;
    escape?: boolean;
    handleback?: boolean;
    confirm_close?: boolean;
    ondismiss?: () => void;
  };
  handler?: (response: RazorpayResponse) => void;
  callback_url?: string;
  redirect?: boolean;
  customer_id?: string;
  timeout?: number;
  remember_customer?: boolean;
  readonly?: boolean;
  retry?: {
    enabled?: boolean;
    max_count?: number;
  };
  send_sms_hash?: boolean;
  allow_rotation?: boolean;
  subscription_id?: string;
  subscription_card_change?: boolean;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  on: (event: string, callback: Function) => void;
  open: () => void;
  close: () => void;
}

interface RazorpayConstructor {
  new (options: RazorpayOptions): RazorpayInstance;
}

interface Window {
  Razorpay: RazorpayConstructor;
} 