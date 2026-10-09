import { Types } from "mongoose";
import { razorpay } from "../config/razorpay.js";
import { createPayment } from "../DAO/payment.dao.js";
import { appError } from "../utils/appError.js";
import crypto from "crypto";
import { configEnv } from "../config/env.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { findPublicCreatorByUsername } from "../DAO/creator.dao.js";
export const createOrder = async (req, res) => {
    const { creatorId, amount } = req.body;
    if (!creatorId || !Types.ObjectId.isValid(creatorId)) {
        throw new appError("Valid creatorId is required", 400);
    }
    if (!amount || amount <= 0) {
        throw new appError("Amount must be greater than 0", 400);
    }
    const senderId = req.user._id;
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
export const verifyPayment = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, } = req.body;
    if (!razorpay_order_id ||
        !razorpay_payment_id ||
        !razorpay_signature) {
        return res.status(400).json({
            success: false,
            message: "Payment verification data is missing",
        });
    }
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", configEnv.RAZORPAY_KEY_SECRET)
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
export const createSupportOrder = asyncHandler(async (req, res) => {
    const { creatorUsername, name, email, amount, } = req.body;
    const creator = await findPublicCreatorByUsername(creatorUsername);
    if (!creator) {
        throw new appError("Creator not found", 404);
    }
    const order = await razorpay.orders.create({
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
    });
    const payment = await createPayment({
        creator: creator._id,
        supporterName: name,
        supporterEmail: email,
        amount,
        currency: "INR",
        razorpayOrderId: order.id,
    });
    return res.status(201).json({
        success: true,
        order,
        payment,
    });
});
//# sourceMappingURL=payment.controller.js.map