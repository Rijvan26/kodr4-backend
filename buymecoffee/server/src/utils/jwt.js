import jwt from "jsonwebtoken";
import { configEnv } from "../config/env.js";
export function signAccessToken(payload) {
    return jwt.sign({ id: payload.id, email: payload.email }, configEnv.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
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
 * Verifies an access token.
 * @throws {jwt.JsonWebTokenError | jwt.TokenExpiredError}
 */
export function verifyAccessToken(token) {
    // 2. Replace JSDoc @type casting with the TypeScript 'as' keyword
    return jwt.verify(token, configEnv.ACCESS_TOKEN_SECRET);
}
/**
 * Verifies a refresh token.
 * @throws {jwt.JsonWebTokenError | jwt.TokenExpiredError}
 */
export function verifyRefreshToken(token) {
    return jwt.verify(token, configEnv.REFRESH_TOKEN_SECRET);
}
//# sourceMappingURL=jwt.js.map