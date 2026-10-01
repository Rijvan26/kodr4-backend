import type { Request, Response, CookieOptions } from "express";
import {
    createUser,
    findUserByEmail,
    findUserById,
} from "../DAO/user.dao.js";
import { updateRefreshToken, clearRefreshToken, getSessionByToken } from "../DAO/session.dao.js";
import { configEnv } from "../config/env.js";
import { appError } from "../utils/appError.js"; // Ensure this matches your file capitalization
import { sendSuccess } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.js";
import type { User, PublicUser, TokenPair } from "../types/user.js";

const REFRESH_COOKIE = "refreshToken";
const COOKIE_PATH = "/api/v1/auth";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

const refreshCookieOptions: CookieOptions = {
    httpOnly: true,
    secure: configEnv.NODE_ENV === "production",
    sameSite: "strict",
    path: COOKIE_PATH,
};

/**
 * Maps a user document to its public representation.
 */
function toPublicUser(user: User): PublicUser {
    return {
        id: user._id.toString(),
        name: user.name,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}

/**
 * Issues a new token pair and persists the refresh token.
 */
async function issueTokens(user: User): Promise<TokenPair> {
    const payload = { id: user._id.toString(), email: user.email };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);
    
    await updateRefreshToken(payload.id, refreshToken);
    
    return { accessToken, refreshToken };
}

/**
 * Sets the refresh token cookie.
 */
function setRefreshCookie(res: Response, token: string): void {
    res.cookie(REFRESH_COOKIE, token, { ...refreshCookieOptions, maxAge: SEVEN_DAYS_MS });
}

/**
 * POST /auth/register — creates a user and issues tokens.
 */
export const register = asyncHandler(async (req: Request, res: Response) => {
    const { name, username, email, password, coffeePrice, bio } = req.body;
    
    const user = await createUser({ 
        name, 
        username, 
        email, 
        password, 
        coffeePrice:  coffeePrice * 100 , 
        bio 
    });
    
    const { accessToken, refreshToken } = await issueTokens(user);

    setRefreshCookie(res, refreshToken);
    sendSuccess(res, 201, "Registration successful", {
        user: toPublicUser(user),
        accessToken,
    });
});

/**
 * POST /auth/login — authenticates with email and password.
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    
    // Because user is typed, TS knows comparePassword exists
    if (!user || !(await user.comparePassword(password))) {
        throw new appError("Invalid credentials",401);
    }

    const { accessToken, refreshToken } = await issueTokens(user);
    
    setRefreshCookie(res, refreshToken);
    sendSuccess(res, 200, "Login successful", {
        user: toPublicUser(user),
        accessToken,
    });
});

/**
 * POST /auth/refresh — rotates the token pair using the refresh cookie.
 */
export const refresh = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (!token) throw new appError( "Refresh token missing",401);

    const payload = verifyRefreshToken(token) as { id: string; email: string };

    const user = await findUserById(payload.id);
    const session = await getSessionByToken(token);

    if (!user || !session) {
        res.clearCookie(REFRESH_COOKIE, refreshCookieOptions);
        throw new appError( "Invalid refresh token",401);
    }

    const tokens = await issueTokens(user);
    
    setRefreshCookie(res, tokens.refreshToken);
    sendSuccess(res, 200, "Token refreshed", { accessToken: tokens.accessToken });
});

/**
 * POST /auth/logout — invalidates the stored refresh token and clears the cookie.
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies?.[REFRESH_COOKIE];
    if (token) {
        try {
            verifyRefreshToken(token);
            await clearRefreshToken(token);
        } catch {
            // Invalid/expired cookie: nothing to revoke, still clear it.
        }
    }

    res.clearCookie(REFRESH_COOKIE, refreshCookieOptions);
    sendSuccess(res, 200, "Logout successful", null);
});

/**
 * GET /auth/me — returns the authenticated user.
 */
export const me = asyncHandler(async (req: Request, res: Response) => {
    // The "!" tells TypeScript: "I guarantee req.user exists here" 
    // because this route sits behind the requireAuth middleware.
    sendSuccess(res, 200, "User fetched", { user: toPublicUser(req.user!) });
});