export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  coffeePrice: number;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  username: string;
  email: string;
  password: string;
  bio?: string;
  coffeePrice: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
  };
}

export interface MeResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
  };
}

export interface RefreshResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
  };
}

export interface LogoutResponse {
  success: true;
  message: string;
  data: null;
}