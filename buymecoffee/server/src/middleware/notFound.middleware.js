import { appError } from "../utils/appError.js";
/**
 * Throws a 404 for unmatched routes.
 */
export function notFound(req, res, next) {
    throw new appError(`Route not found: ${req.originalUrl}`, 404);
}
//# sourceMappingURL=notFound.middleware.js.map