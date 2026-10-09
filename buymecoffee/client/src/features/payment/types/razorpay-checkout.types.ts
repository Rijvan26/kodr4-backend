export interface RazorpayCheckoutResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayPaymentFailure {
  error?: {
    code?: string;
    description?: string;
    reason?: string;
  };
}

export interface RazorpayCheckoutOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
  };
  handler: (response: RazorpayCheckoutResponse) => void;
  modal: {
    ondismiss: () => void;
  };
}

export interface RazorpayCheckoutInstance {
  open(): void;
  on(
    event: "payment.failed",
    handler: (response: RazorpayPaymentFailure) => void,
  ): void;
}

export interface RazorpayCheckoutConstructor {
  new (options: RazorpayCheckoutOptions): RazorpayCheckoutInstance;
}

declare global {
  interface Window {
    Razorpay?: RazorpayCheckoutConstructor;
  }
}

export {};