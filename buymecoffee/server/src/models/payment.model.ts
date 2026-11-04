import mongoose, { Document, Types } from "mongoose";

export interface IPayment extends Document {
    sender?: Types.ObjectId | undefined;
    creator: Types.ObjectId;
    supporterName?: string | undefined;
    supporterEmail?: string | undefined;
    coffeeQuantity?: number | undefined;
    message?: string | undefined;
    isPrivate?: boolean | undefined;

    amount: number;
    currency: string;

    razorpayOrderId: string;
    razorpayPaymentId?: string | undefined;

    status: "created" | "paid" | "failed";

    createdAt: Date;
    updatedAt: Date;
}

const paymentSchema = new mongoose.Schema<IPayment>(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        supporterName: {
            type: String,
            trim: true,
        },
        supporterEmail: {
            type: String,
            trim: true,
            lowercase: true,
        },
        message: {
            type: String,
            trim: true,
        },
        isPrivate: {
            type: Boolean,
            default: false,
        },

        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        coffeeQuantity: {
            type: Number,
            min: 1,
            max: 5,
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
