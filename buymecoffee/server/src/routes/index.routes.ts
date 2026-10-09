import { Router } from "express";
import authRoutes from "./auth.routes.js";
import creatorRoutes from "./creator.routes.js";
import publicCreatorRoutes from "./publicCreator.routes.js";
import publicPaymentRoutes from "./publicPayment.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/creator", creatorRoutes);
router.use("/creators", publicCreatorRoutes);
router.use("/payment", publicPaymentRoutes);

export default router;
