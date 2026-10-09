import { Types } from "mongoose";
import { PaymentModel } from "../models/payment.model.js";
export const createPayment = async (data) => {
    return await PaymentModel.create(data);
};
export const findPaymentByRazorpayOrderId = async (razorpayOrderId) => {
    return await PaymentModel.findOne({
        razorpayOrderId,
    });
};
export const updatePaymentByRazorpayOrderId = async (razorpayOrderId, data) => {
    return await PaymentModel.findOneAndUpdate({ razorpayOrderId,
        status: { $ne: "paid" },
    }, { $set: data }, { new: true });
};
//# sourceMappingURL=payment.dao.js.map