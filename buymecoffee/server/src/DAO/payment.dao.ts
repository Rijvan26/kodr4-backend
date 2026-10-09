import { Types } from "mongoose";
import { PaymentModel } from "../models/payment.model.js";

interface CreatePaymentData {
    sender?: Types.ObjectId;
    creator: Types.ObjectId;
    supporterName?: string;
    supporterEmail?: string;
    coffeeQuantity?: number;
    amount: number;
    currency: string;
    razorpayOrderId: string;
}

interface CreatorPaymentDashboardResult {
    summary: {
        totalAmount: number;
        successfulPayments: number;
    }[];
    supporters: {
        totalSupporters: number;
    }[];
    recentPayments: {
        supporterName: string;
        amount: number;
        currency: string;
        date: Date;
        status: "paid";
    }[];
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

export const markPaymentPaidByRazorpayOrderId = async (
    razorpayOrderId: string,
    razorpayPaymentId: string,
) => {
    return updatePaymentByRazorpayOrderId(razorpayOrderId, {
        status: "paid",
        razorpayPaymentId,
    });
};

export const markPaymentFailedByRazorpayOrderId = async (
    razorpayOrderId: string,
    razorpayPaymentId: string,
) => {
    return updatePaymentByRazorpayOrderId(razorpayOrderId, {
        status: "failed",
        razorpayPaymentId,
    });
};

export const getCreatorPaymentDashboard = async (creatorId: string) => {
    const [dashboard] = await PaymentModel.aggregate<CreatorPaymentDashboardResult>([
        {
            $match: {
                creator: new Types.ObjectId(creatorId),
                status: "paid",
            },
        },
        {
            $facet: {
                summary: [
                    {
                        $group: {
                            _id: null,
                            totalAmount: { $sum: "$amount" },
                            successfulPayments: { $sum: 1 },
                        },
                    },
                    {
                        $project: {
                            _id: 0,
                            totalAmount: 1,
                            successfulPayments: 1,
                        },
                    },
                ],
                supporters: [
                    {
                        $group: {
                            _id: {
                                $ifNull: [
                                    "$sender",
                                    {
                                        $ifNull: [
                                            "$supporterEmail",
                                            { $ifNull: ["$supporterName", "$_id"] },
                                        ],
                                    },
                                ],
                            },
                        },
                    },
                    { $count: "totalSupporters" },
                ],
                recentPayments: [
                    { $sort: { createdAt: -1 } },
                    { $limit: 10 },
                    {
                        $project: {
                            _id: 0,
                            supporterName: {
                                $ifNull: ["$supporterName", "Anonymous supporter"],
                            },
                            amount: 1,
                            currency: 1,
                            date: "$createdAt",
                            status: 1,
                        },
                    },
                ],
            },
        },
    ]);

    return {
        totalAmount: dashboard?.summary[0]?.totalAmount ?? 0,
        totalSupporters: dashboard?.supporters[0]?.totalSupporters ?? 0,
        successfulPayments: dashboard?.summary[0]?.successfulPayments ?? 0,
        recentPayments: dashboard?.recentPayments ?? [],
    };
};