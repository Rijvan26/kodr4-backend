import type { Request, Response } from "express";
import crypto from "crypto";
import { configEnv } from "../config/env.js";
import {
    findPaymentByRazorpayOrderId,
    markPaymentFailedByRazorpayOrderId,
    markPaymentPaidByRazorpayOrderId,
} from "../DAO/payment.dao.js";

interface RazorpayPaymentEntity {
    id: string;
    order_id: string;
    amount: number;
    currency: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function isRazorpayPaymentEntity(
    value: unknown,
): value is RazorpayPaymentEntity {
    return (
        isRecord(value) &&
        typeof value.id === "string" &&
        typeof value.order_id === "string" &&
        typeof value.amount === "number" &&
        Number.isSafeInteger(value.amount) &&
        typeof value.currency === "string"
    );
}

export const razorpayWebhook = async (req: Request, res: Response) => {
    console.info("\n========== RAZORPAY WEBHOOK ==========");

    // --------------------------------------------------
    // 1. Check request
    // --------------------------------------------------

    console.info("Method:", req.method);
    console.info("Content-Type:", req.headers["content-type"]);
    console.info("Body is Buffer:", Buffer.isBuffer(req.body));

    const signature = req.headers["x-razorpay-signature"];

    console.info(
        "Signature received:",
        typeof signature === "string" ? "YES" : "NO",
    );

    if (
        typeof signature !== "string" ||
        !/^[a-f\d]{64}$/i.test(signature)
    ) {
        console.error("❌ WEBHOOK ERROR: Invalid webhook signature");

        return res.status(400).json({
            success: false,
            message: "Invalid webhook signature",
        });
    }

    // --------------------------------------------------
    // 2. Verify raw body
    // --------------------------------------------------

    if (!Buffer.isBuffer(req.body)) {
        console.error("❌ WEBHOOK ERROR: Body is not a Buffer");

        return res.status(400).json({
            success: false,
            message: "Raw webhook body is required",
        });
    }

    console.info("Raw body length:", req.body.length);

    // --------------------------------------------------
    // 3. Verify Razorpay webhook signature
    // --------------------------------------------------

    const expectedSignature = crypto
        .createHmac(
            "sha256",
            configEnv.RAZORPAY_WEBHOOK_SECRET,
        )
        .update(req.body)
        .digest();

    const providedSignature = Buffer.from(signature, "hex");

    if (!crypto.timingSafeEqual(
        expectedSignature,
        providedSignature,
    )) {
        console.error("❌ WEBHOOK ERROR: Invalid webhook signature");

        return res.status(400).json({
            success: false,
            message: "Invalid webhook signature",
        });
    }

    console.info("✅ Webhook signature verified");

    // --------------------------------------------------
    // 4. Parse webhook payload
    // --------------------------------------------------

    let event: unknown;

    try {
        event = JSON.parse(
            req.body.toString("utf-8"),
        ) as unknown;
    } catch {
        console.error("❌ WEBHOOK ERROR: Malformed JSON payload");

        return res.status(400).json({
            success: false,
            message: "Malformed webhook payload",
        });
    }

    if (
        !isRecord(event) ||
        typeof event.event !== "string"
    ) {
        console.error("❌ WEBHOOK ERROR: Invalid webhook payload");

        return res.status(400).json({
            success: false,
            message: "Invalid webhook payload",
        });
    }

    console.info("Event:", event.event);

    // --------------------------------------------------
    // 5. Ignore events we don't need
    // --------------------------------------------------

    if (
        event.event !== "payment.captured" &&
        event.event !== "payment.failed"
    ) {
        console.info(
            "ℹ️ Event ignored:",
            event.event,
        );

        return res.status(200).json({
            success: true,
        });
    }

    // --------------------------------------------------
    // 6. Validate payment payload
    // --------------------------------------------------

    const payload = event.payload;

    if (
        !isRecord(payload) ||
        !isRecord(payload.payment)
    ) {
        console.error(
            "❌ WEBHOOK ERROR: Invalid payment event payload",
        );

        return res.status(400).json({
            success: false,
            message: "Invalid payment event payload",
        });
    }

    const paymentEntity = payload.payment.entity;

    if (!isRazorpayPaymentEntity(paymentEntity)) {
        console.error(
            "❌ WEBHOOK ERROR: Invalid Razorpay payment data",
        );

        return res.status(400).json({
            success: false,
            message: "Invalid Razorpay payment data",
        });
    }

    console.info("Payment identifiers:", {
        orderId: paymentEntity.order_id,
        paymentId: paymentEntity.id,
    });

    console.info("Payment amount:", paymentEntity.amount);
    console.info("Payment currency:", paymentEntity.currency);

    // --------------------------------------------------
    // 7. Find our payment record
    // --------------------------------------------------

    const payment = await findPaymentByRazorpayOrderId(
        paymentEntity.order_id,
    );

    console.info(
        "Payment record found:",
        Boolean(payment),
    );

    if (!payment) {
        console.error(
            "❌ PAYMENT ERROR: Payment record not found",
            {
                orderId: paymentEntity.order_id,
            },
        );

        return res.status(404).json({
            success: false,
            message: "Payment record not found",
        });
    }

    // --------------------------------------------------
    // 8. Verify amount and currency
    // --------------------------------------------------

    const expectedAmount = payment.amount * 100;

    console.info("Database amount:", expectedAmount);
    console.info(
        "Razorpay amount:",
        paymentEntity.amount,
    );

    console.info(
        "Database currency:",
        payment.currency,
    );

    console.info(
        "Razorpay currency:",
        paymentEntity.currency,
    );

    if (
        expectedAmount !== paymentEntity.amount ||
        payment.currency !== paymentEntity.currency
    ) {
        console.error(
            "❌ PAYMENT ERROR: Amount or currency mismatch",
        );

        return res.status(400).json({
            success: false,
            message:
                "Payment amount or currency does not match the order",
        });
    }

    // --------------------------------------------------
    // 9. Update payment status
    // --------------------------------------------------

    if (event.event === "payment.captured") {
        console.info(
            "Updating payment status → PAID",
        );

        await markPaymentPaidByRazorpayOrderId(
            paymentEntity.order_id,
            paymentEntity.id,
        );

        console.info(
            "✅ Payment successfully marked as PAID",
        );
    }

    if (event.event === "payment.failed") {
        console.info(
            "Updating payment status → FAILED",
        );

        await markPaymentFailedByRazorpayOrderId(
            paymentEntity.order_id,
            paymentEntity.id,
        );

        console.info(
            "❌ Payment successfully marked as FAILED",
        );
    }

    console.info("========== WEBHOOK COMPLETE ==========\n");

    return res.status(200).json({
        success: true,
    });
};
