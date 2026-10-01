import { SessionModel } from "../models/session.model.js";
import crypto from "crypto";
/**
 * Gets the session by token.
 * @param token The raw refresh token
 */
export async function getSessionByToken(token) {
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
export async function updateRefreshToken(id, refreshToken) {
    return SessionModel.findOneAndUpdate({ userId: id }, { tokenHash: refreshToken }, {
        upsert: true,
        new: true // Returns the newly created/updated document instead of the old one
    });
}
/**
 * Clears the stored refresh token for the user.
 * @param token The raw refresh token
 */
export async function clearRefreshToken(token) {
    // Replaced require("crypto") with the top-level import
    const tokenHash = crypto.createHash("sha512").update(token).digest("hex");
    return await SessionModel.findOneAndDelete({
        tokenHash: tokenHash,
    });
}
//# sourceMappingURL=session.dao.js.map