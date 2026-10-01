import { type ValidationChain } from "express-validator";
/**
 * Validation chain for POST /auth/register.
 */
export declare const registerValidator: ValidationChain[];
/**
 * Validation chain for POST /auth/login.
 * Uses a generic message to avoid leaking which field failed.
 */
export declare const loginValidator: ValidationChain[];
//# sourceMappingURL=auth.validator.d.ts.map