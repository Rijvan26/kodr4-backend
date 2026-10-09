import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";
import {  Document } from "mongoose";


import {
    DEFAULT_COFFEE_PRICE,
    MAX_COFFEE_PRICE,
    MIN_COFFEE_PRICE,
    getValidCoffeePrice,
} from "../config/constants.js";

export interface IUserMethods {
    comparePassword(candidate: string): Promise<boolean>;
}

export interface Iuser extends Document, IUserMethods {
   username: string;
   name: string;
   bio: string;
   email: string;
   password: string;
   avatarUrl: string;
   coffeePrice: number;
   createdAt: Date; 
   updatedAt: Date; 
}



const userSchema = new Schema<Iuser>(
    {
        name: { type: String, required: true, trim: true, minlength: 2, maxlength: 50 },
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
            minlength: 3,
            maxlength: 30,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        bio: {
            type: String,
            maxlength: 160,
        },
        avatarUrl: {
            type: String,
            default: "https://ik.imagekit.io/hnoglyswo0/user-avatar.webp"
        },
        coffeePrice: {
            type: Number,
            required: true,
            min: MIN_COFFEE_PRICE,
            max: MAX_COFFEE_PRICE,
            default: DEFAULT_COFFEE_PRICE,
            get: (val: number) => getValidCoffeePrice(val),
            set: (val: number) => getValidCoffeePrice(val),
        },
        password: { type: String, required: true, minlength: 8, select: false }
    },
    { timestamps: true, toJSON: { getters: true }, toObject: { getters: true } },
);

userSchema.pre("save", async function hashPassword() {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

/**
 * Compares a plain-text password against the stored hash.
 * @param {string} candidate
 * @returns {Promise<boolean>}
 */
userSchema.methods.comparePassword = function comparePassword(candidate:string): Promise<boolean> {
    return bcrypt.compare(candidate, this.password);
};

export const UserModel = mongoose.model("User", userSchema);
