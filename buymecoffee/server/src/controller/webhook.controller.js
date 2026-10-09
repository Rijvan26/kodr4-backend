import crypto from "crypto";
import { configEnv } from "../config/env.js";
import { updatePaymentByRazorpayOrderId } from "../DAO/payment.dao.js";
export const razorpayWebhook = async (req, res) => {
    const signature = req.headers["x-razorpay-signature"];
    if (!signature || typeof signature !== "string") {
        return res.status(400).json({
            success: false,
            message: "Missing webhook signature",
        });
    }
    const rawBody = req.body;
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
    if (event.event === "payment.captured") {
        const paymentEntity = event.payload.payment.entity;
        const razorpayOrderId = paymentEntity.order_id;
        const razorpayPaymentId = paymentEntity.id;
        const payment = await updatePaymentByRazorpayOrderId(razorpayOrderId, {
            status: "paid",
            razorpayPaymentId,
        });
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment record not found",
            });
        }
    }
    if (event.event === "payment.failed") {
        const paymentEntity = event.payload.payment.entity;
        const razorpayOrderId = paymentEntity.order_id;
        const payment = await updatePaymentByRazorpayOrderId(razorpayOrderId, {
            status: "failed",
        });
        if (!payment) {
            return res.status(404).json({
                success: false,
                message: "Payment record not found",
            });
        }
    }
};
//# sourceMappingURL=webhook.controller.js.map