import mongoose, { Document, Types } from "mongoose";
export interface IPayment extends Document {
    sender?: Types.ObjectId;
    creator: Types.ObjectId;
    supporterName?: string;
    supporterEmail?: string;
    amount: number;
    currency: string;
    razorpayOrderId: string;
    razorpayPaymentId?: string;
    status: "created" | "paid" | "failed";
    createdAt: Date;
    updatedAt: Date;
}
export declare const PaymentModel: mongoose.Model<IPayment, {}, {}, {}, Document<unknown, {}, IPayment, {}, mongoose.DefaultSchemaOptions> & IPayment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}, any, IPayment>;
//# sourceMappingURL=payment.model.d.ts.map