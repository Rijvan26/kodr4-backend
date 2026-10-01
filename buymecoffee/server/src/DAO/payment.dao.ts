import { Types } from "mongoose";
import { PaymentModel } from "../models/payment.model.js";

interface CreatePaymentData {
    sender: Types.ObjectId;
    creator: Types.ObjectId;
    amount: number;
    currency: string;
    razorpayOrderId: string;
}

export const createPayment = async (
    data: CreatePaymentData
) => {
    return await PaymentModel.create(data);
};

export const findPaymentByRazorpayOrderId = async (
    razorpayOrderId: string
) => {
    return await PaymentModel.findOne({
        razorpayOrderId,
    });
};


export const updatePaymentByRazorpayOrderId = async (
    razorpayOrderId: string,
    data: {
        status: "paid" | "failed";
        razorpayPaymentId?: string;
    }
) => {
    return await PaymentModel.findOneAndUpdate(
        { razorpayOrderId,
            status:{$ne:"paid"},
         },
        { $set: data },
        { new: true }
    );
};