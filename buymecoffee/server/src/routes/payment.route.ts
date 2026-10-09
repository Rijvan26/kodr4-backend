import { Router } from "express";
import { createOrder, verifyPayment } from "../controller/payment.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/create-order", requireAuth, createOrder);

router.post(
    "/verify-payment",
    requireAuth,
    verifyPayment
);

export default router;