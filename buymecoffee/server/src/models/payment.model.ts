import mongoose, { Document, Types } from "mongoose";

export interface IPayment extends Document {
    sender: Types.ObjectId;
    creator: Types.ObjectId;

    amount: number;
    currency: string;

    razorpayOrderId: string;
    razorpayPaymentId?: string;

    status: "created" | "paid" | "failed";

    createdAt: Date;
    updatedAt: Date;
}

const paymentSchema = new mongoose.Schema<IPayment>(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        amount: {
            type: Number,
            required: true,
            min: 1,
        },

        currency: {
            type: String,
            default: "INR",
            required: true,
        },

        razorpayOrderId: {
            type: String,
            required: true,
            unique: true,
        },

        razorpayPaymentId: {
            type: String,
        },

        status: {
            type: String,
            enum: ["created", "paid", "failed"],
            default: "created",
        },
    },
    {
        timestamps: true,
    }
);

export const PaymentModel = mongoose.model<IPayment>(
    "Payment",
    paymentSchema
);