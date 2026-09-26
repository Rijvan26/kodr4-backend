import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });

/**
 * Reads and validates required environment variables.
 * @throws {Error} If a required environment variable is missing.
 * @returns {{port: number, nodeEnv: string, mongodbUri: string, accessTokenSecret: string, refreshTokenSecret: string}}
 */
function loadEnv() {
    const required = [
        "MONGODB_URI",
        "ACCESS_TOKEN_SECRET",
        "REFRESH_TOKEN_SECRET",
        "RAZORPAY_KEY_ID",
        "RAZORPAY_KEY_SECRET",
    ];

    for (const key of required) {
        if (!process.env[ key ]) {
            throw new Error(`Missing required environment variable: ${key}`);
        }
    }

    return Object.freeze({
        port: Number(process.env.PORT) || 3000,
        nodeEnv: process.env.NODE_ENV || "development",
        mongodbUri: process.env.MONGODB_URI,
        accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
        refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
        RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
        RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    });
}

export const env = loadEnv();
