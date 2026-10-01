import type { Request, Response } from "express";
import crypto from "crypto";
import { configEnv } from "../config/env.js";
import { updatePaymentByRazorpayOrderId } from "../DAO/payment.dao.js";

export const razorpayWebhook = async (req: Request, res: Response) => {
    const signature = req.headers["x-razorpay-signature"];

    if (!signature || typeof signature !== "string") {
        return res.status(400).json({
            success: false,
            message: "Missing webhook signature",
        });
    }

    const rawBody = req.body as Buffer;

    const expectedSignature = crypto
        .createHmac("sha256", configEnv.RAZORPAY_WEBHOOK_SECRET)
        .update(rawBody)
        .digest("hex");

    if (signature !== expectedSignature) {
        return res.status(400).json({
            success: false,
            message: "Invalid webhook signature",
        });
    }

    const event = JSON.parse(rawBody.toString("utf-8"));

    console.log("Razorpay webhook received:", event.event);

    if (event.event === "payment.captured") {
        const paymentEntity = event.payload.payment.entity;

        const razorpayOrderId = paymentEntity.order_id;
        const razorpayPaymentId = paymentEntity.id;

     const payment = await updatePaymentByRazorpayOrderId(
    razorpayOrderId,
    {
        status: "paid",
        razorpayPaymentId,
    }
);

if (!payment) {
    console.error(
        "Payment record not found:",
        razorpayOrderId
    );

    return res.status(404).json({
        success: false,
        message: "Payment record not found",
    });
}
    }

    if (event.event === "payment.failed") {
        const paymentEntity = event.payload.payment.entity;

        const razorpayOrderId = paymentEntity.order_id;

     const payment = await updatePaymentByRazorpayOrderId(
    razorpayOrderId,
    {
        status: "failed",
    }
);

if (!payment) {
    console.error(
        "Payment record not found:",
        razorpayOrderId
    );

    return res.status(404).json({
        success: false,
        message: "Payment record not found",
    });
}
}
};