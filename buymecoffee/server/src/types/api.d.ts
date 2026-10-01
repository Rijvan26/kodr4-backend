export interface ApiFieldError {
    field: string;
    message: string;
}
export interface ApiSuccess<T = unknown> {
    success: true;
    message: string;
    data: T | null;
}
export interface ApiError {
    success: false;
    message: string;
    errors: ApiFieldError[];
    stack?: string;
}
//# sourceMappingURL=api.d.ts.map