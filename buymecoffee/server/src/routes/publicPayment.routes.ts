import { Router } from "express";
import {
  createSupportOrder,
  getPublicPaymentStatus,
  verifyPayment,
} from "../controller/payment.controller.js";
import {
  validateCreateSupportOrder,
  validateVerifyPayment,
} from "../validators/payment.validator.js";

const router = Router();

router.post(
  "/create-order",
  ...validateCreateSupportOrder,
  createSupportOrder,
);

router.post(
  "/verify",
  ...validateVerifyPayment,
  verifyPayment,
);

router.post(
  "/verify-payment",
  ...validateVerifyPayment,
  verifyPayment,
);

router.get("/status/:orderId", getPublicPaymentStatus);

export default router;
