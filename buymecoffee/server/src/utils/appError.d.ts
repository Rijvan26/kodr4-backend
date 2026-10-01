export declare class appError extends Error {
    statusCode: number;
    isOperational: boolean;
    errors: any[];
    constructor(message: string, statusCode: number, errors?: any[], // 3rd parameter: Defaults to empty array
    isOperational?: boolean);
}
//# sourceMappingURL=appError.d.ts.map