import { asyncHandler } from "../utils/asyncHandler.js";
import { appError } from "../utils/appError.js";
import { verifyAccessToken } from "../utils/jwt.js";
import { findUserById } from "../DAO/user.dao.js";
export const requireAuth = asyncHandler(async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
        throw new appError("Authentication required", 401);
    }
    const payload = verifyAccessToken(header.slice(7));
    const user = await findUserById(payload.id);
    if (!user) {
        throw new appError("Authentication required", 401);
    }
    req.user = user;
    next();
});
//# sourceMappingURL=auth.middleware.js.map