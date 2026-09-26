import express from "express";
import {
    createPaymentOrder,
    verifyPayment,
} from "../controller/payment.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = express.Router();

router.post("/create-order",  asyncHandler(createPaymentOrder));
router.post("/verify", asyncHandler(verifyPayment));

export default router;