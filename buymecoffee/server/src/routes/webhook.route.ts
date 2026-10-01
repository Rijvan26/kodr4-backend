import { Router } from "express";
import express from "express";
import { razorpayWebhook } from "../controller/webhook.controller.js";

const router = Router();

router.post(
    "/",
    express.raw({ type: "application/json" }),
    razorpayWebhook
);

export default router;