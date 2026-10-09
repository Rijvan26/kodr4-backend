import { configEnv } from "../config/env.js";
import { appError } from "../utils/appError.js";
/**
 * Centralized error handler; the only place that writes failure responses.
 */
export function errorHandler(err, _req, res, _next) {
    let statusCode = 500;
    let message = "Internal server error";
    let errors = [];
    if (err instanceof appError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors || [];
    }
    else if (err?.code === 11000) {
        const field = Object.keys(err.keyValue ?? err.keyPattern ?? {})[0] ?? "unknown";
        statusCode = 409;
        message = "Duplicate value";
        errors = [{ field, message: `${field} is already in use` }];
    }
    else if (err?.name === "CastError") {
        statusCode = 400;
        message = "Invalid identifier";
        errors = [{ field: err.path, message: `Invalid ${err.path}` }];
    }
    else if (err?.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Token expired";
    }
    else if (err?.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid token";
    }
    else if (err?.type === "entity.parse.failed") {
        statusCode = 400;
        message = "Malformed JSON body";
    }
    else {
        console.error("Unhandled request error:", err instanceof Error ? err.name : "UnknownError");
    }
    const body = { success: false, message, errors };
    // Add stack trace only in development
    if (configEnv.NODE_ENV !== "production" && err?.stack) {
        body.stack = err.stack;
    }
    res.status(statusCode).json(body);
}
//# sourceMappingURL=error.middleware.js.map