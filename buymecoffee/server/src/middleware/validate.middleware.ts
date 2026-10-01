import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { appError } from "../utils/appError.js";

/**
 * Converts express-validator results into a 422 AppError.
 */
export function validate(req: Request, _res: Response, next: NextFunction): void {
    const result = validationResult(req);
    
    if (result.isEmpty()) {
        next();
        return;
    }

    const fieldErrors = result.array().map((err) => ({
        field: err.type === "field" ? err.path : err.type,
        message: String(err.msg),
    }));
    
    throw new appError( "Validation failed", 422,fieldErrors);
}