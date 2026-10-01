import  type { Request, Response } from "express";
import {Types} from "mongoose"
import { razorpay } from "../config/razorpay.js";
import { createPayment } from "../DAO/payment.dao.js";
import { appError } from "../utils/appError.js";
import crypto from "crypto";
import { configEnv } from "../config/env.js";

export const createOrder = async (
    req: Request,
    res: Response
) => {
    const { creatorId, amount } = req.body;

if (!creatorId || !Types.ObjectId.isValid(creatorId)) {
    throw new appError("Valid creatorId is required", 400);
}

if (!amount || amount <= 0) {
    throw new appError("Amount must be greater than 0", 400);
}

const senderId = req.user!._id;

const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
});

const payment = await createPayment({
    sender: senderId,
    creator: new Types.ObjectId(creatorId),
    amount,
    currency: "INR",
    razorpayOrderId: order.id,
});
    return res.status(201).json({
        success: true,
        order,
        payment,
    });
};

export const verifyPayment = async (
    req: Request,
    res: Response
) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
    } = req.body;

    if (
        !razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature
    ) {
        return res.status(400).json({
            success: false,
            message: "Payment verification data is missing",
        });
    }

    const body =
        razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac(
            "sha256",
            configEnv.RAZORPAY_KEY_SECRET
        )
        .update(body)
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({
            success: false,
            message: "Invalid payment signature",
        });
    }

    return res.status(200).json({
        success: true,
        message: "Payment signature verified",
    });
};