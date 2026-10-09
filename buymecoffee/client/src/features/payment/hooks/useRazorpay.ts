import { useState } from "react";
import type { RazorpayOrderResponse } from "../types/payment.types";
import type {
  RazorpayCheckoutResponse,
  RazorpayPaymentFailure,
} from "../types/razorpay-checkout.types";

const RAZORPAY_CHECKOUT_SCRIPT =
  "https://checkout.razorpay.com/v1/checkout.js";

interface OpenCheckoutOptions {
  order: RazorpayOrderResponse;
  creatorName: string;
  supporterName: string;
  supporterEmail: string;
}

let checkoutScriptPromise: Promise<void> | null = null;

function loadRazorpayCheckout(): Promise<void> {
  if (window.Razorpay) {
    return Promise.resolve();
  }

  if (!checkoutScriptPromise) {
    checkoutScriptPromise = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = RAZORPAY_CHECKOUT_SCRIPT;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => {
        checkoutScriptPromise = null;
        reject(new Error("Razorpay Checkout could not be loaded."));
      };
      document.body.appendChild(script);
    });
  }

  return checkoutScriptPromise;
}

export const useRazorpay = () => {
  const [checkoutResponse, setCheckoutResponse] =
    useState<RazorpayCheckoutResponse | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const openCheckout = async ({
    order,
    creatorName,
    supporterName,
    supporterEmail,
  }: OpenCheckoutOptions): Promise<void> => {
    const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID?.trim();
    if (!keyId) {
      throw new Error("Razorpay Checkout is not configured.");
    }

    await loadRazorpayCheckout();

    const Razorpay = window.Razorpay;
    if (!Razorpay) {
      throw new Error("Razorpay Checkout could not be loaded.");
    }

    setCheckoutResponse(null);
    setCheckoutError(null);

    const checkout = new Razorpay({
      key: keyId,
      amount: order.amount,
      currency: order.currency,
      name: creatorName,
      description: `Support ${creatorName}`,
      order_id: order.id,
      prefill: {
        name: supporterName,
        email: supporterEmail,
      },
      handler: (response) => {
        setCheckoutResponse(response);
        setIsCheckoutOpen(false);
      },
      modal: {
        ondismiss: () => setIsCheckoutOpen(false),
      },
    });

    checkout.on("payment.failed", (response: RazorpayPaymentFailure) => {
      setCheckoutError(
        response.error?.description ??
          "Payment could not be completed. You can try again.",
      );
      setIsCheckoutOpen(false);
    });

    setIsCheckoutOpen(true);
    checkout.open();
  };

  return {
    openCheckout,
    checkoutResponse,
    checkoutError,
    isCheckoutOpen,
  };
};