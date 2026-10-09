import { Router } from "express";
import { getCreatorProfile, updateCreatorProfile, } from "../controller/creator.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateCreatorProfileUpdate } from "../validators/creator.validator.js";
const router = Router();
router.get("/profile", requireAuth, getCreatorProfile);
router.patch("/profile", requireAuth, ...validateCreatorProfileUpdate, updateCreatorProfile);
export default router;
//# sourceMappingURL=creator.routes.js.map