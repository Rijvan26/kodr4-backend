import { useEffect, useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { getAuthFormErrorDetails } from "../../auth/utils/authFormErrors";
import {
  useCreatePaymentOrderMutation,
  useGetPaymentStatusQuery,
  useVerifyPaymentMutation,
} from "../../payment/api/payment.api";
import { useRazorpay } from "../../payment/hooks/useRazorpay";
import Button from "../../../shared/ui/Button";
import Input from "../../../shared/ui/Input";

interface SupportFormProps {
  creatorName: string;
  creatorUsername: string;
  coffeePrice?: number;
}

interface SupportFormValues {
  name: string;
  email: string;
  coffeeQuantity: number;
}

const MIN_COFFEE_QUANTITY = 1;
const MAX_COFFEE_QUANTITY = 5;
const QUANTITY_OPTIONS = [1, 2, 3, 4, 5] as const;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SupportForm = ({
  creatorName,
  creatorUsername,
  coffeePrice = 100,
}: SupportFormProps) => {
  const [requestError, setRequestError] = useState<string | null>(null);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [lastSubmittedQuantity, setLastSubmittedQuantity] = useState(1);
  const [isSuccessDismissed, setIsSuccessDismissed] = useState(false);

  const [createPaymentOrder, paymentOrderState] =
    useCreatePaymentOrderMutation();
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
  } = useForm<SupportFormValues>({
    defaultValues: {
      name: "",
      email: "",
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
        })
        .catch((error) => {
          const details = getAuthFormErrorDetails(error);
          setRequestError(
            details.message || "Payment verification failed. Please try again.",
          );
        });
    }
  }, [
    checkoutResponse,
    activeOrderId,
    isSuccessDismissed,
    verifyPayment,
    refetchPaymentStatus,
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
      Math.min(MAX_COFFEE_QUANTITY, Math.round(quantity)),
    );
    setValue("coffeeQuantity", clamped, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleSupportSubmit: SubmitHandler<SupportFormValues> = async (
    values,
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
      }).unwrap();

      // Track order id so we can verify and poll status
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
        details.message,
      );
      setRequestError(
        isNetworkError
          ? "We couldn't start the support request. Check your connection and try again."
          : details.message,
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
      coffeeQuantity: 1,
    });
  };

  const handleRetryAfterFailure = () => {
    setIsSuccessDismissed(true);
    setActiveOrderId(null);
    setRequestError(null);
    resetCheckout();
    verifyPaymentState.reset?.();
  };

  // 1. PAID STATE: Payment is verified and paid
  if (isPaid) {
    return (
      <div
        className="rounded-card-lg border border-border bg-surface p-6 sm:p-8 animate-scale-in"
        aria-labelledby="thank-you-heading"
      >
        <div className="py-4 text-center">
          {/* Success icon */}
          <div
            className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-emerald-100 text-3xl"
            aria-hidden="true"
          >
            ☕
          </div>
          <h2
            id="thank-you-heading"
            className="font-display text-heading text-foreground"
          >
            Thank you!
          </h2>
          <p className="mt-2 text-body-relaxed text-muted">
            Your support means a lot to {creatorName}.
          </p>

          {/* Receipt card */}
          <div className="mt-6 rounded-card border border-emerald-200 bg-emerald-50/60 p-5 text-center">
            <p className="text-caption tracking-kicker text-emerald-800 font-semibold">
              YOU BOUGHT
            </p>
            <p className="mt-2 font-display text-heading text-foreground">
              {paidQuantity} {paidQuantity === 1 ? "coffee" : "coffees"}
            </p>
            <p className="mt-1 text-label text-muted">
              ₹{paidAmount}
            </p>
          </div>

          <Button
            type="button"
            variant="primary"
            className="mt-6 w-full"
            onClick={handleResetForm}
          >
            Done
          </Button>
        </div>
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
    <div className="rounded-card-lg border border-border bg-surface p-6 sm:p-8 shadow-xs">
      <header>
        <h2 className="font-display text-heading-small text-foreground">
          Buy a coffee
        </h2>
        <p className="mt-1.5 text-body-small text-muted">
          ₹{coffeePrice} per coffee · Choose how many to send
        </p>
      </header>

      {isWaitingForConfirmation ? (
        <div className="py-10 text-center animate-fade-in" role="status" aria-live="polite">
          <span
            aria-hidden="true"
            className="mx-auto block size-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary"
          />
          <h3 className="mt-5 font-display text-heading-small text-foreground">
            Confirming your payment…
          </h3>
          <p className="mt-2 text-body-small text-muted">
            We received your checkout and are confirming the payment with the
            server. Please keep this page open.
          </p>
          {(isPollingStatus || verifyPaymentState.isLoading) && (
            <p className="mt-3 text-meta text-muted animate-pulse-soft">
              Verifying payment…
            </p>
          )}
        </div>
      ) : (
        <form
          className="mt-6 space-y-5"
          noValidate
          onSubmit={handleSubmit(handleSupportSubmit)}
        >
          {/* Name */}
          <div>
            <label
              htmlFor="supporter-name"
              className="mb-field-label block text-label text-surface-foreground"
            >
              Your name
            </label>
            <Input
              id="supporter-name"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "supporter-name-error" : undefined}
              placeholder="Name"
              {...register("name", {
                required: "Enter your name.",
                validate: (name) =>
                  Boolean(name.trim()) || "Enter your name.",
                onChange: () => setRequestError(null),
              })}
            />
            {errors.name && (
              <p
                id="supporter-name-error"
                className="mt-1.5 text-body-small text-danger"
                role="alert"
              >
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="supporter-email"
              className="mb-field-label block text-label text-surface-foreground"
            >
              Your email
            </label>
            <Input
              id="supporter-email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? "supporter-email-error" : undefined
              }
              placeholder="you@example.com"
              {...register("email", {
                required: "Enter your email address.",
                pattern: {
                  value: emailPattern,
                  message: "Enter a valid email address.",
                },
                onChange: () => setRequestError(null),
              })}
            />
            {errors.email && (
              <p
                id="supporter-email-error"
                className="mt-1.5 text-body-small text-danger"
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Quantity selector */}
          <fieldset>
            <div className="flex items-center justify-between">
              <legend className="text-label text-surface-foreground">
                ☕ How many coffees?
              </legend>
            </div>

            {/* Quick-pick pills */}
            <div
              className="mt-3 grid grid-cols-5 gap-2"
              role="group"
              aria-label="Select coffee quantity"
            >
              {QUANTITY_OPTIONS.map((qty) => (
                <button
                  key={qty}
                  type="button"
                  aria-pressed={quantityValue === qty}
                  onClick={() => setQuantity(qty)}
                  className={`flex h-11 items-center justify-center rounded-control text-button transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus ${
                    quantityValue === qty
                      ? "bg-primary text-primary-foreground shadow-sm font-semibold"
                      : "border border-border bg-surface text-surface-foreground hover:bg-surface-alt hover:border-primary/30"
                  }`}
                >
                  {qty}
                </button>
              ))}
            </div>

            {/* Stepper */}
            <div className="mt-3 flex items-center justify-between rounded-card border border-border bg-surface-alt px-3 py-2.5">
              <button
                type="button"
                disabled={quantityValue <= MIN_COFFEE_QUANTITY}
                onClick={() => setQuantity(quantityValue - 1)}
                aria-label="Decrease coffee quantity"
                className="flex size-9 items-center justify-center rounded-control border border-border bg-surface text-lg font-bold text-foreground transition-all duration-200 hover:bg-background active:scale-95 disabled:opacity-40 disabled:active:scale-100"
              >
                −
              </button>
              <div className="text-center">
                <span className="font-display text-xl text-foreground">
                  {quantityValue}
                </span>
                <span className="ml-1.5 text-body-small text-muted">
                  {quantityValue === 1 ? "coffee" : "coffees"}
                </span>
              </div>
              <button
                type="button"
                disabled={quantityValue >= MAX_COFFEE_QUANTITY}
                onClick={() => setQuantity(quantityValue + 1)}
                aria-label="Increase coffee quantity"
                className="flex size-9 items-center justify-center rounded-control border border-border bg-surface text-lg font-bold text-foreground transition-all duration-200 hover:bg-background active:scale-95 disabled:opacity-40 disabled:active:scale-100"
              >
                +
              </button>
            </div>

            {/* Total */}
            <div className="mt-3 flex items-center justify-between rounded-card bg-primary-muted px-4 py-3">
              <span className="text-body-small font-medium text-primary-muted-foreground">
                Total
              </span>
              <span className="font-display text-heading-small text-foreground">
                ₹{totalAmount}
              </span>
            </div>
          </fieldset>

          {/* FAILED STATE */}
          {(checkoutError || paymentStatus === "failed" || verifyPaymentState.isError) && (
            <div
              className="rounded-card border border-danger-border bg-danger-surface p-4 text-center animate-fade-in"
              role="alert"
            >
              <p className="text-body-small font-medium text-danger-foreground">
                {checkoutError ??
                  requestError ??
                  "Payment couldn't be completed. You can try again."}
              </p>
              <Button
                type="button"
                variant="secondary"
                density="compact"
                className="mt-3"
                onClick={handleRetryAfterFailure}
              >
                Try again
              </Button>
            </div>
          )}

          {requestError && (
            <p
              className="rounded-card border border-danger-border bg-danger-surface px-control-x py-control-y text-body-small text-danger-foreground animate-fade-in"
              role="alert"
            >
              {requestError}
            </p>
          )}

          <Button
            type="submit"
            disabled={
              isSubmitting ||
              paymentOrderState.isLoading ||
              isCheckoutOpen ||
              Boolean(checkoutResponse)
            }
            className="w-full"
          >
            {isSubmitting || paymentOrderState.isLoading ? (
              <>
                <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                Creating payment…
              </>
            ) : isCheckoutOpen ? (
              "Checkout is open…"
            ) : checkoutResponse ? (
              <>
                <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
                Confirming payment…
              </>
            ) : (
              `Support with ₹${totalAmount}`
            )}
          </Button>

          <p className="text-center text-meta text-muted">
            Secure payment via Razorpay · Instant &amp; encrypted
          </p>
        </form>
      )}
    </div>
  );
};

export default SupportForm;
