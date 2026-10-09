import jwt from "jsonwebtoken";
import { configEnv } from "../config/env.js";
export function signAccessToken(payload) {
    return jwt.sign({ id: payload.id, email: payload.email }, configEnv.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
}
export function verifyAccessToken(token) {
    return jwt.verify(token, configEnv.ACCESS_TOKEN_SECRET);
}
/**
 * Signs a 7-day refresh token.
 */
export function signRefreshToken(payload) {
    return jwt.sign({ id: payload.id, email: payload.email }, configEnv.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
}
/**
 * Verifies a refresh token.
 * @throws {jwt.JsonWebTokenError | jwt.TokenExpiredError}
 */
export function verifyRefreshToken(token) {
    return jwt.verify(token, configEnv.REFRESH_TOKEN_SECRET);
}
//# sourceMappingURL=jwt.js.map