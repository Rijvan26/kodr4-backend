import type { Request, Response, NextFunction } from "express";
import { appError } from "../utils/appError.js";

/**
 * Throws a 404 for unmatched routes.
 */
export function notFound(req: Request, res: Response, next: NextFunction): never {
    throw new appError( `Route not found: ${req.originalUrl}`, 404);
}