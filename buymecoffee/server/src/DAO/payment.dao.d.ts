import { Types } from "mongoose";
interface CreatePaymentData {
    sender?: Types.ObjectId;
    creator: Types.ObjectId;
    supporterName?: string;
    supporterEmail?: string;
    amount: number;
    currency: string;
    razorpayOrderId: string;
}
export declare const createPayment: (data: CreatePaymentData) => Promise<import("mongoose").Document<unknown, {}, import("../models/payment.model.js").IPayment, {}, import("mongoose").DefaultSchemaOptions> & import("../models/payment.model.js").IPayment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const findPaymentByRazorpayOrderId: (razorpayOrderId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../models/payment.model.js").IPayment, {}, import("mongoose").DefaultSchemaOptions> & import("../models/payment.model.js").IPayment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
export declare const updatePaymentByRazorpayOrderId: (razorpayOrderId: string, data: {
    status: "paid" | "failed";
    razorpayPaymentId?: string;
}) => Promise<(import("mongoose").Document<unknown, {}, import("../models/payment.model.js").IPayment, {}, import("mongoose").DefaultSchemaOptions> & import("../models/payment.model.js").IPayment & Required<{
    _id: Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}) | null>;
export {};
//# sourceMappingURL=payment.dao.d.ts.map