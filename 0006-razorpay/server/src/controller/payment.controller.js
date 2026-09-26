import {
  createRazorpayOrder,
  MAX_PAYMENT_AMOUNT_PAISE,
  MIN_PAYMENT_AMOUNT_PAISE,
  verifyRazorpayPayment,
} from "../services/payment.service.js";
import { AppError } from "../utils/AppError.js";
import { sendSuccess } from "../utils/apiResponse.js";

export async function createPaymentOrder(req, res) {
  const { amount } = req.body ?? {};
  if (
    !Number.isSafeInteger(amount) ||
    amount < MIN_PAYMENT_AMOUNT_PAISE ||
    amount > MAX_PAYMENT_AMOUNT_PAISE
  ) {
    throw new AppError(
      400,
      "Amount must be an integer from 100 to 100000000 paise",
    );
  }

  const order = await createRazorpayOrder(amount);
  return sendSuccess(res, 201, "Payment order created", {
    order,
    key: process.env.RAZORPAY_KEY_ID,
  });
}

export async function verifyPayment(req, res) {
  const {
    razorpay_order_id: orderId,
    razorpay_payment_id: paymentId,
    razorpay_signature: signature,
  } = req.body;
  if (
    ![orderId, paymentId, signature].every(
      (value) => typeof value === "string" && value.length > 0,
    )
  ) {
    throw new AppError(400, "Razorpay payment details are required");
  }

  const verified = await verifyRazorpayPayment({
    orderId,
    paymentId,
    signature,
  });
  if (!verified) {
    throw new AppError(400, "Payment signature could not be verified");
  }

  return sendSuccess(res, 200, "Payment verified", {
    orderId,
    paymentId,
    status: "verified",
  });
}
