import jwt from "jsonwebtoken"
import {configEnv} from "../config/env.js"



export interface TokenPayload {
    id:string,
    email:string
}

export function signAccessToken(payload: TokenPayload): string {
    return jwt.sign(
        { id: payload.id, email: payload.email },
        configEnv.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
    );
}

export function verifyAccessToken(token: string): TokenPayload {
    return jwt.verify(
        token,
        configEnv.ACCESS_TOKEN_SECRET
    ) as TokenPayload;
}

/**
 * Signs a 7-day refresh token.
 */
export function signRefreshToken(payload: TokenPayload): string {
    return jwt.sign({ id: payload.id, email: payload.email }, configEnv.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
}



/**
 * Verifies a refresh token.
 * @throws {jwt.JsonWebTokenError | jwt.TokenExpiredError}
 */
export function verifyRefreshToken(token: string): TokenPayload {
    return jwt.verify(token, configEnv.REFRESH_TOKEN_SECRET) as TokenPayload;
}