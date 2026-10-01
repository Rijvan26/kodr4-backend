export class appError extends Error {
    statusCode;
    isOperational;
    errors; // Holds the field validation errors
    constructor(message, statusCode, errors = [], // 3rd parameter: Defaults to empty array
    isOperational = true // 4th parameter: Defaults to true
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
//# sourceMappingURL=appError.js.map