import mongoose, { Document, Types } from "mongoose";
const paymentSchema = new mongoose.Schema({
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
}, {
    timestamps: true,
});
export const PaymentModel = mongoose.model("Payment", paymentSchema);
//# sourceMappingURL=payment.model.js.map