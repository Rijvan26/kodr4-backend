export interface TokenPayload {
    id: string;
    email: string;
}
export declare function signAccessToken(payload: TokenPayload): string;
/**
 * Signs a 7-day refresh token.
 */
export declare function signRefreshToken(payload: TokenPayload): string;
/**
 * Verifies an access token.
 * @throws {jwt.JsonWebTokenError | jwt.TokenExpiredError}
 */
export declare function verifyAccessToken(token: string): TokenPayload;
/**
 * Verifies a refresh token.
 * @throws {jwt.JsonWebTokenError | jwt.TokenExpiredError}
 */
export declare function verifyRefreshToken(token: string): TokenPayload;
//# sourceMappingURL=jwt.d.ts.map