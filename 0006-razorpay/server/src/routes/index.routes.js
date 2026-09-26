import { Router } from "express";
import authRoutes from "./auth.routes.js";
import paymentRoutes from "./payment.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/payments", paymentRoutes);

export default router;
