import { useEffect, useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { getAuthFormErrorDetails } from "../../auth/utils/authFormErrors";
import {
  useCreatePaymentOrderMutation,
  useGetPaymentStatusQuery,
  useVerifyPaymentMutation,
} from "../../payment/api/payment.api";
import { useRazorpay } from "../../payment/hooks/useRazorpay";

interface PaymentCardProps {
  creatorName: string;
  creatorUsername: string;
  coffeePrice?: number;
  onPaymentSuccess?: () => void;
}

interface PaymentFormValues {
  name: string;
  email: string;
  message?: string;
  isPrivate?: boolean;
  coffeeQuantity: number;
}

const MIN_COFFEE_QUANTITY = 1;
const MAX_COFFEE_QUANTITY = 5;
const QUANTITY_OPTIONS = [1, 2, 3, 4, 5] as const;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const PaymentCard = ({
  creatorName,
  creatorUsername,
  coffeePrice = 100,
  onPaymentSuccess,
}: PaymentCardProps) => {
  const [requestError, setRequestError] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [lastSubmittedQuantity, setLastSubmittedQuantity] = useState(1);
  const [isSuccessDismissed, setIsSuccessDismissed] = useState(false);

  const [createPaymentOrder, paymentOrderState] = useCreatePaymentOrderMutation();
  const [verifyPayment, verifyPaymentState] = useVerifyPaymentMutation();

  const {
    openCheckout,
    checkoutResponse,
    checkoutError,
    isCheckoutOpen,
    resetCheckout,
  } = useRazorpay();

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormValues>({
    defaultValues: {
      name: "",
      email: "",
      message: "",
      isPrivate: false,
      coffeeQuantity: 1,
    },
  });

  const quantityValue = useWatch({ control, name: "coffeeQuantity" }) ?? 1;
  const totalAmount = coffeePrice * quantityValue;

  // Poll payment status once Razorpay checkout callback has fired
  const {
    data: paymentStatusResponse,
    isFetching: isPollingStatus,
    refetch: refetchPaymentStatus,
  } = useGetPaymentStatusQuery(activeOrderId ?? "", {
    skip: !activeOrderId,
    pollingInterval: 2000,
  });

  // Verify payment immediately when Razorpay handler completes
  useEffect(() => {
    if (checkoutResponse && activeOrderId && !isSuccessDismissed) {
      verifyPayment({
        razorpay_order_id: checkoutResponse.razorpay_order_id,
        razorpay_payment_id: checkoutResponse.razorpay_payment_id,
        razorpay_signature: checkoutResponse.razorpay_signature,
      })
        .unwrap()
        .then(() => {
          void refetchPaymentStatus();
          onPaymentSuccess?.();
        })
        .catch((error) => {
          const details = getAuthFormErrorDetails(error);
          setRequestError(
            details.message || "Payment verification failed. Please try again."
          );
        });
    }
  }, [
    checkoutResponse,
    activeOrderId,
    isSuccessDismissed,
    verifyPayment,
    refetchPaymentStatus,
    onPaymentSuccess,
  ]);

  const paymentStatus = paymentStatusResponse?.data?.status;
  const isPaid =
    !isSuccessDismissed &&
    Boolean(activeOrderId) &&
    (paymentStatus === "paid" ||
      verifyPaymentState.data?.data?.status === "paid");

  const paidAmount =
    paymentStatusResponse?.data?.amount ??
    verifyPaymentState.data?.data?.amount ??
    totalAmount;

  const paidQuantity =
    paymentStatusResponse?.data?.coffeeQuantity ??
    verifyPaymentState.data?.data?.coffeeQuantity ??
    lastSubmittedQuantity;

  const setQuantity = (quantity: number) => {
    const clamped = Math.max(
      MIN_COFFEE_QUANTITY,
      Math.min(MAX_COFFEE_QUANTITY, Math.round(quantity))
    );
    setValue("coffeeQuantity", clamped, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleSupportSubmit: SubmitHandler<PaymentFormValues> = async (
    values
  ) => {
    setRequestError(null);
    setIsSuccessDismissed(false);
    setLastSubmittedQuantity(values.coffeeQuantity);

    try {
      const orderResponse = await createPaymentOrder({
        creatorUsername,
        name: values.name.trim(),
        email: values.email.trim(),
        coffeeQuantity: values.coffeeQuantity,
        message: values.message?.trim() || undefined,
        isPrivate: Boolean(values.isPrivate),
      }).unwrap();

      setActiveOrderId(orderResponse.order.id);

      await openCheckout({
        order: orderResponse.order,
        creatorName,
        supporterName: values.name.trim(),
        supporterEmail: values.email.trim(),
      });
    } catch (error) {
      const details = getAuthFormErrorDetails(error);
      const isNetworkError = /failed to fetch|fetch_error|network error/i.test(
        details.message
      );
      setRequestError(
        isNetworkError
          ? "We couldn't start the support request. Check your connection and try again."
          : details.message
      );

      if (details.fieldErrors.name) {
        setError("name", {
          type: "server",
          message: details.fieldErrors.name,
        });
      }
      if (details.fieldErrors.email) {
        setError("email", {
          type: "server",
          message: details.fieldErrors.email,
        });
      }
      if (details.fieldErrors.coffeeQuantity) {
        setError("coffeeQuantity", {
          type: "server",
          message: details.fieldErrors.coffeeQuantity,
        });
      }
    }
  };

  const handleResetForm = () => {
    setIsSuccessDismissed(true);
    setActiveOrderId(null);
    setRequestError(null);
    resetCheckout();
    verifyPaymentState.reset?.();
    reset({
      name: "",
      email: "",
      message: "",
      isPrivate: false,
      coffeeQuantity: 1,
    });
    onPaymentSuccess?.();
  };

  const handleRetryAfterFailure = () => {
    setIsSuccessDismissed(true);
    setActiveOrderId(null);
    setRequestError(null);
    resetCheckout();
    verifyPaymentState.reset?.();
  };

  // 1. PAID STATE
  if (isPaid) {
    return (
      <div className="bg-surface-container-lowest rounded-[20px] p-6 sm:p-8 shadow-[0_12px_40px_rgba(15,61,46,0.12)] border border-outline-variant/30 animate-scale-in text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#D4E6C3] flex items-center justify-center text-primary shadow-sm">
          <span className="material-symbols-outlined text-[32px] text-[#10B981] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>
        <h2 className="font-headline-md text-headline-md text-primary">Thank you!</h2>
        <p className="mt-1.5 font-body-md text-body-md text-on-surface-variant">
          Your warm support was received and means a lot to {creatorName}.
        </p>

        {/* Receipt card */}
        <div className="mt-5 rounded-2xl border border-[#D4E6C3] bg-surface-container-low p-5 text-center">
          <p className="text-xs font-label-sm tracking-wider uppercase text-on-surface-variant font-semibold">
            YOU BOUGHT
          </p>
          <p className="mt-1 font-headline-md text-headline-md text-primary">
            {paidQuantity} {paidQuantity === 1 ? "coffee" : "coffees"}
          </p>
          <p className="mt-1 text-currency-display font-currency-display text-primary font-bold">
            ₹{paidAmount.toLocaleString("en-IN")}
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetForm}
          className="mt-6 w-full py-4 rounded-2xl bg-secondary-container hover:brightness-105 active:scale-[0.98] text-[#002116] font-label-lg text-label-lg font-bold shadow-[0_4px_16px_rgba(254,166,25,0.4)] transition-all cursor-pointer"
        >
          Done
        </button>
      </div>
    );
  }

  // 2. WAITING FOR CONFIRMATION STATE
  const isWaitingForConfirmation =
    Boolean(checkoutResponse) &&
    Boolean(activeOrderId) &&
    !isPaid &&
    !verifyPaymentState.isError &&
    paymentStatus !== "failed";

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-surface-container-lowest rounded-[20px] p-5 sm:p-7 shadow-[0_12px_40px_rgba(15,61,46,0.12)] border border-outline-variant/30">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 sm:pb-4 gap-2">
          <div>
            <h2 className="font-headline-md text-xl sm:text-headline-md text-primary font-bold">
              Buy {creatorName} a coffee
            </h2>
            <div className="flex items-center gap-1.5 mt-1 text-[#4A2C1A] font-label-md text-xs sm:text-label-md">
              <span className="material-symbols-outlined text-[17px] sm:text-[18px] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                coffee
              </span>
              <span className="font-semibold">₹{coffeePrice}</span>
              <span className="text-on-surface-variant font-normal">per coffee</span>
            </div>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-secondary-fixed/40 flex items-center justify-center text-primary shrink-0">
            <span className="material-symbols-outlined text-[18px] sm:text-[20px] leading-none">local_cafe</span>
          </div>
        </div>

        {isWaitingForConfirmation ? (
          <div className="py-12 text-center animate-fade-in" role="status">
            <span className="mx-auto block w-9 h-9 animate-spin rounded-full border-3 border-primary/20 border-t-primary" />
            <h3 className="mt-5 font-headline-sm text-headline-sm text-primary">
              Confirming your payment…
            </h3>
            <p className="mt-2 text-body-sm text-on-surface-variant max-w-xs mx-auto">
              We received your checkout callback and are confirming bank settlement. Please keep this tab open.
            </p>
            {(isPollingStatus || verifyPaymentState.isLoading) && (
              <p className="mt-3 text-xs font-label-sm text-on-surface-variant animate-pulse">
                Verifying payment…
              </p>
            )}
          </div>
        ) : (
          <>
            {/* Coffee Quantity Multiplier */}
            <div className="mt-1 sm:mt-2 bg-surface-container-low p-3 sm:p-3.5 rounded-2xl border border-outline-variant/30">
              <div className="text-[11px] sm:text-xs font-label-sm text-on-surface-variant uppercase tracking-wider mb-2 font-semibold">
                Select Coffees
              </div>
              {/* Quick preset buttons (responsive grid) */}
              <div className="grid grid-cols-5 gap-1 sm:gap-1.5">
                {QUANTITY_OPTIONS.map((qty) => (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setQuantity(qty)}
                    className={`py-1.5 sm:py-2 px-1 rounded-xl text-center font-label-md text-xs sm:text-label-lg transition-all cursor-pointer whitespace-nowrap min-w-0 ${
                      quantityValue === qty
                        ? "bg-primary text-on-primary shadow-xs font-bold"
                        : "bg-surface-container-lowest text-primary hover:bg-surface-container-high border border-outline-variant/40"
                    }`}
                  >
                    {qty} ☕
                  </button>
                ))}
              </div>

              {/* Stepper count */}
              <div className="flex items-center justify-between mt-3 pt-3 bg-surface-container-lowest/80 rounded-xl px-3 py-2 border border-outline-variant/20">
                <span className="font-body-sm text-body-sm text-on-surface-variant">Fine-tune cups:</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={quantityValue <= MIN_COFFEE_QUANTITY}
                    onClick={() => setQuantity(quantityValue - 1)}
                    className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-surface-container-highest transition-colors active:scale-95 font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Decrease coffee count"
                  >
                    <span className="material-symbols-outlined text-[16px] leading-none">remove</span>
                  </button>
                  <span className="font-label-lg text-label-lg text-primary w-6 text-center font-bold">
                    {quantityValue}
                  </span>
                  <button
                    type="button"
                    disabled={quantityValue >= MAX_COFFEE_QUANTITY}
                    onClick={() => setQuantity(quantityValue + 1)}
                    className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-primary hover:bg-surface-container-highest transition-colors active:scale-95 font-bold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    aria-label="Increase coffee count"
                  >
                    <span className="material-symbols-outlined text-[16px] leading-none">add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Checkout Form */}
            <form
              className="mt-4 space-y-3.5"
              noValidate
              onSubmit={handleSubmit(handleSupportSubmit)}
            >
              <div>
                <label
                  htmlFor="supporter-name"
                  className="block font-label-sm text-label-sm text-on-surface-variant mb-1"
                >
                  Your name or nickname
                </label>
                <input
                  id="supporter-name"
                  type="text"
                  placeholder="e.g. Aarav or Anonymous"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest text-primary font-body-md text-body-md placeholder:text-outline border border-outline-variant/50 focus:border-primary focus:outline-none focus:bg-surface-container-low/30 transition-colors shadow-inner"
                  {...register("name", {
                    required: "Please enter your name or nickname.",
                    validate: (name) =>
                      Boolean(name.trim()) || "Please enter your name or nickname.",
                    onChange: () => setRequestError(null),
                  })}
                />
                {errors.name && (
                  <p className="mt-1 text-xs text-error font-label-sm">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="supporter-email"
                  className="block font-label-sm text-label-sm text-on-surface-variant mb-1"
                >
                  Your email <span className="text-outline text-xs">(for receipt &amp; updates)</span>
                </label>
                <input
                  id="supporter-email"
                  type="email"
                  placeholder="you@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest text-primary font-body-md text-body-md placeholder:text-outline border border-outline-variant/50 focus:border-primary focus:outline-none focus:bg-surface-container-low/30 transition-colors shadow-inner"
                  {...register("email", {
                    required: "Please enter your email address.",
                    pattern: {
                      value: emailPattern,
                      message: "Please enter a valid email address.",
                    },
                    onChange: () => setRequestError(null),
                  })}
                />
                {errors.email && (
                  <p className="mt-1 text-xs text-error font-label-sm">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="supporter-msg"
                  className="block font-label-sm text-label-sm text-on-surface-variant mb-1"
                >
                  Say something nice <span className="text-outline text-xs">(optional)</span>
                </label>
                <textarea
                  id="supporter-msg"
                  rows={2}
                  placeholder="Leave a message for the supporters wall..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-lowest text-primary font-body-md text-body-md placeholder:text-outline border border-outline-variant/50 focus:border-primary focus:outline-none focus:bg-surface-container-low/30 transition-colors shadow-inner resize-none"
                  {...register("message")}
                />
              </div>

              {/* Private message checkbox */}
              <label className="flex items-center gap-2 cursor-pointer pt-0.5 select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded text-primary focus:ring-0 cursor-pointer accent-primary"
                  {...register("isPrivate")}
                />
                <span className="font-label-sm text-label-sm text-on-surface-variant">
                  Make this message private to {creatorName}
                </span>
              </label>

              {/* Error messages */}
              {(checkoutError || paymentStatus === "failed" || verifyPaymentState.isError) && (
                <div className="rounded-xl border border-error-container bg-error-container/30 p-3.5 text-center animate-fade-in">
                  <p className="text-xs font-label-sm text-on-error-container font-medium">
                    {checkoutError ?? requestError ?? "Payment could not be completed. You can try again."}
                  </p>
                  <button
                    type="button"
                    onClick={handleRetryAfterFailure}
                    className="mt-2 px-3 py-1 bg-surface-container-lowest text-primary rounded-lg text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                  >
                    Try again
                  </button>
                </div>
              )}

              {requestError && !checkoutError && (
                <p className="text-xs text-error font-label-sm bg-error-container/30 p-2.5 rounded-xl text-center">
                  {requestError}
                </p>
              )}

              {/* PRIMARY AMBER CTA BUTTON */}
              <button
                type="submit"
                disabled={
                  isSubmitting ||
                  paymentOrderState.isLoading ||
                  isCheckoutOpen ||
                  Boolean(checkoutResponse)
                }
                className="w-full mt-2 py-3.5 sm:py-4 px-3 sm:px-6 rounded-2xl bg-secondary-container hover:brightness-105 active:scale-[0.98] text-[#002116] font-label-lg text-sm sm:text-label-lg tracking-wide shadow-[0_4px_16px_rgba(254,166,25,0.4)] transition-all flex items-center justify-center gap-1.5 sm:gap-2 font-bold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting || paymentOrderState.isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="size-4 animate-spin rounded-full border-2 border-[#002116]/40 border-t-[#002116]" />
                    <span>Opening Payment…</span>
                  </span>
                ) : isCheckoutOpen ? (
                  <span>Checkout open…</span>
                ) : (
                  <span className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap text-center">
                    <span>Support ₹{totalAmount.toLocaleString("en-IN")}</span>
                    <span className="text-xs sm:text-sm font-medium opacity-85 hidden min-[380px]:inline">
                      • UPI &amp; Cards
                    </span>
                    <span className="material-symbols-outlined text-[16px] sm:text-[18px] leading-none shrink-0" aria-hidden="true">
                      arrow_forward
                    </span>
                  </span>
                )}
              </button>
            </form>

            {/* Accepted UPI & Payment Trust Badges */}
            <div className="mt-5 pt-4 bg-surface-container-low -mx-6 sm:-mx-7 px-6 sm:px-7 rounded-b-[20px] border-t border-outline-variant/20">
              <div className="text-center font-label-sm text-label-sm text-outline mb-2">
                Accepted Payment Methods via Razorpay
              </div>
              <div className="flex items-center justify-center gap-2 flex-wrap text-on-surface-variant">
                <span className="px-2 py-1 rounded bg-surface-container-lowest text-xs font-semibold shadow-xs border border-outline-variant/30">
                  GPay
                </span>
                <span className="px-2 py-1 rounded bg-surface-container-lowest text-xs font-semibold shadow-xs border border-outline-variant/30">
                  PhonePe
                </span>
                <span className="px-2 py-1 rounded bg-surface-container-lowest text-xs font-semibold shadow-xs border border-outline-variant/30">
                  Paytm
                </span>
                <span className="px-2 py-1 rounded bg-surface-container-lowest text-xs font-semibold shadow-xs border border-outline-variant/30">
                  UPI QR
                </span>
                <span className="px-2 py-1 rounded bg-surface-container-lowest text-xs font-semibold shadow-xs border border-outline-variant/30">
                  RuPay
                </span>
                <span className="px-2 py-1 rounded bg-surface-container-lowest text-xs font-semibold shadow-xs border border-outline-variant/30">
                  Visa / MC
                </span>
              </div>
              <div className="mt-3.5 flex items-center justify-center gap-1.5 text-center font-label-sm text-label-sm text-on-surface-variant pb-1">
                <span className="material-symbols-outlined text-[15px] text-[#10B981] leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
                  lock
                </span>
                <span>256-bit encrypted • Instant bank settlement</span>
              </div>
              <p className="text-center text-[11px] text-outline mt-1 font-body-sm pb-1">
                {creatorName} receives 100% of your contribution directly.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Creator Guarantee Micro-Card */}
      <div className="p-4 rounded-xl bg-surface-container-lowest/80 backdrop-blur-sm flex items-center gap-3 shadow-xs border border-outline-variant/30">
        <div className="w-8 h-8 rounded-full bg-[#D4E6C3] text-primary flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-[18px] leading-none">verified_user</span>
        </div>
        <div className="font-body-sm text-body-sm text-on-surface-variant">
          Contributions go directly to <strong className="text-primary font-semibold">{creatorName}</strong> to support their independent creative work.
        </div>
      </div>
    </div>
  );
};

export default PaymentCard;
