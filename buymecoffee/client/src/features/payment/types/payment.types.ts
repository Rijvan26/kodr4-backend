export interface CreatePaymentOrderRequest {
  creatorUsername: string;
  name: string;
  email: string;
  coffeeQuantity: number;
}

export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt?: string;
  status: "created" | "attempted" | "paid";
  attempts: number;
  created_at: number;
}

export interface SupportPaymentResponse {
  _id: string;
  creator: string;
  supporterName: string;
  supporterEmail: string;
  coffeeQuantity?: number;
  amount: number;
  currency: string;
  razorpayOrderId: string;
  status: "created" | "paid" | "failed";
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentOrderResponse {
  success: true;
  order: RazorpayOrderResponse;
  payment: SupportPaymentResponse;
}

export interface PaymentStatusData {
  status: "created" | "paid" | "failed";
  amount: number;
  coffeeQuantity?: number;
  currency: string;
  createdAt: string;
}

export interface PaymentStatusResponse {
  success: boolean;
  data: PaymentStatusData;
}