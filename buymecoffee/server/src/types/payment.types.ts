export interface CreateSupportOrderRequest {
  creatorUsername: string;
  name: string;
  email: string;
  coffeeQuantity: number;
  message?: string;
  isPrivate?: boolean;
}
