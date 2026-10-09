import type { ApiFieldError } from "../types/api.js";

export class appError extends Error {
    statusCode: number;
    isOperational: boolean;
    errors: ApiFieldError[];

    constructor(
        message: string,
        statusCode: number,
        errors: ApiFieldError[] = [],
        isOperational = true   // 4th parameter: Defaults to true
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}