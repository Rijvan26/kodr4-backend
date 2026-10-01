import { SessionModel } from "../models/session.model.js";
import crypto from "crypto";

/**
 * Gets the session by token.
 * @param token The raw refresh token
 */
export async function getSessionByToken(token: string) {
    const tokenHash = crypto.createHash("sha512").update(token).digest("hex");
    return await SessionModel.findOne({
        tokenHash: tokenHash,
    });
}

/**
 * Persists a new refresh token for the user.
 * @param id The user's database ID
 * @param refreshToken The raw refresh token
 */
export async function updateRefreshToken(
    id: string,
    refreshToken: string
) {
    const tokenHash = crypto
        .createHash("sha512")
        .update(refreshToken)
        .digest("hex");

    return SessionModel.findOneAndUpdate(
        { userId: id },
        {
            tokenHash,
        },
        {
            upsert: true,
            new: true,
        }
    );
}

/**
 * Clears the stored refresh token for the user.
 * @param token The raw refresh token
 */
export async function clearRefreshToken(token: string) {
    // Replaced require("crypto") with the top-level import
    const tokenHash = crypto.createHash("sha512").update(token).digest("hex");
    return await SessionModel.findOneAndDelete({
        tokenHash: tokenHash,
    });
}