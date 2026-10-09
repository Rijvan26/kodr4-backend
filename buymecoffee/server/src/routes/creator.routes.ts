import { Router } from "express";
import {
  getCreatorDashboard,
  getCreatorProfile,
  updateCreatorProfile,
} from "../controller/creator.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";
import { validateCreatorProfileUpdate } from "../validators/creator.validator.js";

const router = Router();

router.get("/dashboard", requireAuth, getCreatorDashboard);
router.get("/profile", requireAuth, getCreatorProfile);
router.patch(
  "/profile",
  requireAuth,
  ...validateCreatorProfileUpdate,
  updateCreatorProfile,
);

export default router;