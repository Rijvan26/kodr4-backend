export class appError extends Error {
    statusCode: number;
    isOperational: boolean;
    errors: any[]; // Holds the field validation errors

    constructor(
        message: string,
        statusCode: number,
        errors: any[] = [],    // 3rd parameter: Defaults to empty array
        isOperational = true   // 4th parameter: Defaults to true
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}