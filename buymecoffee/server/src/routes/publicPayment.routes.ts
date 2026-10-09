import { Router } from "express";
import {
  createSupportOrder,
  getPublicPaymentStatus,
} from "../controller/payment.controller.js";
import { validateCreateSupportOrder } from "../validators/payment.validator.js";

const router = Router();

router.post(
  "/create-order",
  ...validateCreateSupportOrder,
  createSupportOrder,
);

router.get("/status/:orderId", getPublicPaymentStatus);

export default router;