import { createHmac, randomUUID, timingSafeEqual } from "node:crypto";
import razorpay from "../config/razorpay.js";
import { env } from "../config/env.js";

export const MIN_PAYMENT_AMOUNT_PAISE = 100;
export const MAX_PAYMENT_AMOUNT_PAISE = 100000000;

export async function createRazorpayOrder(amount) {
    return razorpay.orders.create({
        amount,
        currency: "INR",
        receipt: `receipt_${randomUUID()}`,
    });
}

export async function verifyRazorpayPayment({ orderId, paymentId, signature }) {
    const order = await razorpay.orders.fetch(orderId);
    if (
        !Number.isSafeInteger(order.amount)
        || order.amount < MIN_PAYMENT_AMOUNT_PAISE
        || order.amount > MAX_PAYMENT_AMOUNT_PAISE
        || order.currency !== "INR"
    ) {
        return false;
    }

    const expectedSignature = createHmac("sha256", env.RAZORPAY_KEY_SECRET)
        .update(`${orderId}|${paymentId}`)
        .digest();
    const receivedSignature = Buffer.from(signature, "hex");

    return receivedSignature.length === expectedSignature.length
        && timingSafeEqual(receivedSignature, expectedSignature);
}