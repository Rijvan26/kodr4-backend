import type { Request, Response, NextFunction } from "express";
import { configEnv } from "../config/env.js";
import { appError } from "../utils/appError.js";
import type { ApiError, ApiFieldError } from "../types/api.js";

/**
 * Centralized error handler; the only place that writes failure responses.
 */
export function errorHandler(
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
): void {
    let statusCode = 500;
    let message = "Internal server error";
    let errors: ApiFieldError[] = [];
    const errorDetails =
        typeof err === "object" && err !== null
            ? (err as Record<string, unknown>)
            : {};

    if (err instanceof appError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors || [];
    } else if (errorDetails.code === 11000) {
        const keyData = errorDetails.keyValue ?? errorDetails.keyPattern;
        const keyRecord =
            typeof keyData === "object" && keyData !== null
                ? (keyData as Record<string, unknown>)
                : {};
        const field = Object.keys(keyRecord)[0] ?? "unknown";
        statusCode = 409;
        message = "Duplicate value";
        errors = [{ field, message: `${field} is already in use` }];
    } else if (errorDetails.name === "CastError") {
        statusCode = 400;
        message = "Invalid identifier";
        const path = typeof errorDetails.path === "string" ? errorDetails.path : "identifier";
        errors = [{ field: path, message: `Invalid ${path}` }];
    } else if (errorDetails.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    } else if (errorDetails.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    } else if (errorDetails.type === "entity.parse.failed") {
        statusCode = 400;
        message = "Malformed JSON body";
    } else {
        const errorName = err instanceof Error ? err.name : "UnknownError";
        console.error("Unhandled request error:", errorName);
    }

    const body: ApiError = { success: false, message, errors };
    
    // Add stack trace only in development
    if (
        configEnv.NODE_ENV === "development" &&
        err instanceof Error &&
        err.stack
    ) {
        body.stack = err.stack;
    }

    res.status(statusCode).json(body);
}