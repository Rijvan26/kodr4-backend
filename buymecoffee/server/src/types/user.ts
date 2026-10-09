import type { Types } from "mongoose";

export interface User {
    _id: Types.ObjectId;
    name: string;
    username: string;
    email: string;
    password?: string;
    coffeePrice: number;
    refreshToken?: string | null;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidate: string): Promise<boolean>;
}

export interface RegisterInput {
    name: string;
    username: string;
    email: string;
    password: string;
    bio?: string;
    coffeePrice: number;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface PublicUser {
    id: string;
    name: string;
    username: string;
    email: string;
    coffeePrice: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface TokenPair {
    accessToken: string;
    refreshToken: string;
}