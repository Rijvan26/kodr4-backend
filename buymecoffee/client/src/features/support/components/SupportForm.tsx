import { useState } from "react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { getAuthFormErrorDetails } from "../../auth/utils/authFormErrors";
import {
  useCreatePaymentOrderMutation,
  useGetPaymentStatusQuery,
} from "../../payment/api/payment.api";
import { useRazorpay } from "../../payment/hooks/useRazorpay";
import Button from "../../../shared/ui/Button";
import Card from "../../../shared/ui/Card";
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

  const [createPaymentOrder, paymentOrderState] =
    useCreatePaymentOrderMutation();

  const {
    openCheckout,
    checkoutResponse,
    checkoutError,
    isCheckoutOpen,
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
  } = useGetPaymentStatusQuery(activeOrderId ?? "", {
    skip: !activeOrderId,
    pollingInterval: 2000,
  });

  const paymentStatus = paymentStatusResponse?.data?.status;
  const paidAmount = paymentStatusResponse?.data?.amount;
  const paidQuantity =
    paymentStatusResponse?.data?.coffeeQuantity ?? lastSubmittedQuantity;

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
    setLastSubmittedQuantity(values.coffeeQuantity);

    try {
      const orderResponse = await createPaymentOrder({
        creatorUsername,
        name: values.name.trim(),
        email: values.email.trim(),
        coffeeQuantity: values.coffeeQuantity,
      }).unwrap();

      await openCheckout({
        order: orderResponse.order,
        creatorName,
        supporterName: values.name.trim(),
        supporterEmail: values.email.trim(),
      });

      // Track order id so we can poll status after checkout completes
      setActiveOrderId(orderResponse.order.id);
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
    setActiveOrderId(null);
    setRequestError(null);
    reset({
      name: "",
      email: "",
      coffeeQuantity: 1,
    });
  };

  const handleRetryAfterFailure = () => {
    setActiveOrderId(null);
    setRequestError(null);
  };

  // 1. PAID STATE: Payment is verified and paid
  if (paymentStatus === "paid") {
    return (
      <Card className="p-panel sm:p-panel-wide" aria-labelledby="thank-you-heading">
        <div className="py-6 text-center">
          <div
            className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-[#173d32]/10 text-3xl"
            aria-hidden="true"
          >
            ☕
          </div>
          <h2
            id="thank-you-heading"
            className="font-serif text-heading text-foreground"
          >
            Thank you!
          </h2>
          <p className="mt-2 text-body-relaxed text-muted">
            Your support means a lot to {creatorName}.
          </p>

          <div className="mt-6 rounded-card border border-border-subtle bg-surface-muted p-5 text-center">
            <p className="text-caption tracking-eyebrow text-primary-muted-foreground">
              YOU BOUGHT
            </p>
            <p className="mt-1 font-serif text-2xl font-bold text-foreground">
              {paidQuantity} {paidQuantity === 1 ? "coffee" : "coffees"}
            </p>
            <p className="mt-1 text-label text-muted">
              ₹{paidAmount ?? totalAmount}
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
      </Card>
    );
  }

  // 2. WAITING FOR WEBHOOK CONFIRMATION STATE
  // After Razorpay Checkout callback finishes, we await webhook confirmation
  const isWaitingForConfirmation =
    Boolean(checkoutResponse) && activeOrderId && paymentStatus !== "failed";

  return (
    <Card className="p-panel sm:p-panel-wide">
      <header>
        <p className="text-caption tracking-eyebrow text-primary-muted-foreground">
          SUPPORT A CREATOR
        </p>
        <h2 className="mt-2 text-section-heading text-foreground">
          Support {creatorName}
        </h2>
        <p className="mt-2 text-body-relaxed text-muted">
          ₹{coffeePrice} per coffee. Choose how many coffees you want to send.
        </p>
      </header>

      {isWaitingForConfirmation ? (
        <div className="py-8 text-center" role="status" aria-live="polite">
          <span
            aria-hidden="true"
            className="mx-auto block size-8 animate-spin rounded-full border-2 border-primary/20 border-t-primary"
          />
          <h3 className="mt-4 font-serif text-section-heading text-foreground">
            Confirming your payment…
          </h3>
          <p className="mt-2 text-body-small text-muted">
            We received your checkout and are confirming the payment with the
            server. Please keep this page open.
          </p>
          {isPollingStatus && (
            <p className="mt-2 text-meta text-muted">
              Checking status…
            </p>
          )}
        </div>
      ) : (
        <form
          className="mt-6 space-y-form-gap"
          noValidate
          onSubmit={handleSubmit(handleSupportSubmit)}
        >
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
                className="mt-1 text-body-small text-danger"
                role="alert"
              >
                {errors.name.message}
              </p>
            )}
          </div>

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
                className="mt-1 text-body-small text-danger"
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <fieldset>
            <div className="flex items-center justify-between">
              <legend className="text-label text-surface-foreground">
                ☕ Buy me a coffee
              </legend>
              <span className="text-body-small text-muted">
                ₹{coffeePrice} per coffee
              </span>
            </div>

            {/* Quick coffee quantity selection pills */}
            <div
              className="mt-3 grid grid-cols-5 gap-2"
              role="group"
              aria-label="Select coffee quantity"
            >
              {QUANTITY_OPTIONS.map((qty) => (
                <Button
                  key={qty}
                  type="button"
                  variant={quantityValue === qty ? "primary" : "secondary"}
                  density="compact"
                  aria-pressed={quantityValue === qty}
                  onClick={() => setQuantity(qty)}
                >
                  {qty} ☕
                </Button>
              ))}
            </div>

            {/* Quantity stepper [-] count [+] */}
            <div className="mt-3 flex items-center justify-between rounded-md border border-border bg-background p-2">
              <Button
                type="button"
                variant="secondary"
                density="compact"
                disabled={quantityValue <= MIN_COFFEE_QUANTITY}
                onClick={() => setQuantity(quantityValue - 1)}
                aria-label="Decrease coffee quantity"
                className="size-9 p-0 text-lg font-bold"
              >
                −
              </Button>
              <div className="text-center">
                <span className="font-serif text-xl font-bold text-foreground">
                  {quantityValue}
                </span>
                <span className="ml-1 text-sm text-muted">
                  {quantityValue === 1 ? "coffee" : "coffees"}
                </span>
              </div>
              <Button
                type="button"
                variant="secondary"
                density="compact"
                disabled={quantityValue >= MAX_COFFEE_QUANTITY}
                onClick={() => setQuantity(quantityValue + 1)}
                aria-label="Increase coffee quantity"
                className="size-9 p-0 text-lg font-bold"
              >
                +
              </Button>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-card bg-surface-muted px-4 py-3">
              <span className="text-sm font-medium text-muted">Total</span>
              <span className="font-serif text-lg font-bold text-foreground">
                ₹{totalAmount}
              </span>
            </div>
          </fieldset>

          {/* FAILED STATE */}
          {(checkoutError || paymentStatus === "failed") && (
            <div
              className="rounded-card border border-danger-border bg-danger-surface p-4 text-center"
              role="alert"
            >
              <p className="text-body-small font-medium text-danger-foreground">
                {checkoutError ??
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
              className="rounded-card border border-danger-border bg-danger-surface px-control-x py-control-y text-body text-danger-foreground"
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
            {isSubmitting || paymentOrderState.isLoading
              ? "Creating payment..."
              : isCheckoutOpen
                ? "Checkout is open..."
                : checkoutResponse
                  ? "Confirming payment..."
                  : `Support ₹${totalAmount}`}
          </Button>
        </form>
      )}
    </Card>
  );
};

export default SupportForm;