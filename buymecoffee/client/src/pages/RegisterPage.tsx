import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hook/auth.hook";
import { getAuthFormErrorDetails } from "../features/auth/utils/authFormErrors";
import Input from "../shared/ui/Input";
import Textarea from "../shared/ui/Textarea";
import Button from "../shared/ui/Button";

interface RegisterFormValues {
  name: string;
  username: string;
  email: string;
  password: string;
  coffeePrice: number;
  bio: string;
}

const MIN_COFFEE_PRICE = 20;
const MAX_COFFEE_PRICE = 500;
const DEFAULT_COFFEE_PRICE = 100;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9_]+$/;

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, registerState } = useAuth();
  const isLoading = registerState.isLoading;
  const [requestError, setRequestError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register: registerField,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    mode: "onBlur",
    reValidateMode: "onChange",
    defaultValues: {
      coffeePrice: DEFAULT_COFFEE_PRICE,
    },
  });

  const handleRegister: SubmitHandler<RegisterFormValues> = async (values) => {
    setRequestError(null);
    try {
      await register({
        name: values.name.trim(),
        username: values.username.trim(),
        email: values.email.trim(),
        password: values.password,
        bio: values.bio.trim(),
        coffeePrice: Number(values.coffeePrice),
      });
      navigate("/dashboard");
    } catch (error) {
      const details = getAuthFormErrorDetails(error);
      setRequestError(details.message);
      if (details.fieldErrors.name) {
        setError("name", { type: "server", message: details.fieldErrors.name });
      }
      if (details.fieldErrors.username) {
        setError("username", { type: "server", message: details.fieldErrors.username });
      }
      if (details.fieldErrors.email) {
        setError("email", { type: "server", message: details.fieldErrors.email });
      }
      if (details.fieldErrors.password) {
        setError("password", { type: "server", message: details.fieldErrors.password });
      }
      if (details.fieldErrors.coffeePrice) {
        setError("coffeePrice", { type: "server", message: details.fieldErrors.coffeePrice });
      }
      if (details.fieldErrors.bio) {
        setError("bio", { type: "server", message: details.fieldErrors.bio });
      }
    }
  };

  return (
    <section aria-labelledby="register-heading">
      <p className="text-caption tracking-kicker text-primary font-semibold">
        SUPPORTME.COM CREATOR REGISTRATION
      </p>
      <h2 id="register-heading" className="mt-3 font-display text-heading text-foreground">
        Create your creator page.
      </h2>
      <p className="mt-2 text-body-relaxed text-muted">
        Your page will be live at <code className="font-mono text-primary font-semibold">supportme.com/@your_handle</code>
      </p>

      <form className="mt-6 space-y-5" noValidate onSubmit={handleSubmit(handleRegister)}>
        {/* Name & Username row */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="register-name" className="mb-field-label block text-label text-surface-foreground">
              Name
            </label>
            <Input
              id="register-name"
              type="text"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "register-name-error" : undefined}
              placeholder="Your name"
              {...registerField("name", {
                required: "Enter your name.",
                validate: (value) => {
                  const length = value.trim().length;
                  return (length >= 2 && length <= 50) || "Name must be 2–50 characters.";
                },
                onChange: () => setRequestError(null),
              })}
            />
            {errors.name && (
              <p id="register-name-error" className="mt-1.5 text-body-small text-danger" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="register-username" className="mb-field-label block text-label text-surface-foreground">
              Username
            </label>
            <Input
              id="register-username"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              aria-invalid={Boolean(errors.username)}
              aria-describedby={errors.username ? "register-username-error" : undefined}
              placeholder="your_handle"
              {...registerField("username", {
                required: "Choose a username.",
                validate: (value) => {
                  const username = value.trim();
                  if (username.length < 3 || username.length > 30) {
                    return "Username must be 3–30 characters.";
                  }
                  return usernamePattern.test(username) || "Use letters, numbers, and underscores only.";
                },
                onChange: () => setRequestError(null),
              })}
            />
            {errors.username && (
              <p id="register-username-error" className="mt-1.5 text-body-small text-danger" role="alert">
                {errors.username.message}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="register-email" className="mb-field-label block text-label text-surface-foreground">
            Email
          </label>
          <Input
            id="register-email"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "register-email-error" : undefined}
            placeholder="you@example.com"
            {...registerField("email", {
              required: "Enter your email address.",
              pattern: { value: emailPattern, message: "Enter a valid email address." },
              onChange: () => setRequestError(null),
            })}
          />
          {errors.email && (
            <p id="register-email-error" className="mt-1.5 text-body-small text-danger" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="register-password" className="mb-field-label block text-label text-surface-foreground">
            Password
          </label>
          <div className="relative">
            <Input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "register-password-error" : undefined}
              placeholder="At least 8 characters"
              className="pr-16"
              {...registerField("password", {
                required: "Create a password.",
                validate: (password) => {
                  const isValid = password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);
                  return isValid || "Use at least 8 characters, including a letter and a number.";
                },
                onChange: () => setRequestError(null),
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className="absolute inset-y-0 right-3 rounded px-1 text-body-small font-medium text-muted outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-focus"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <p id="register-password-error" className="mt-1.5 text-body-small text-danger" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Coffee Price */}
        <div>
          <label htmlFor="register-coffee-price" className="mb-field-label block text-label text-surface-foreground">
            Coffee Price
          </label>
          <p className="mb-2 text-body-small text-muted">
            How much should one coffee cost? This is the default amount supporters will see on your page.
          </p>
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-body font-medium text-muted"
            >
              ₹
            </span>
            <Input
              id="register-coffee-price"
              type="number"
              inputMode="numeric"
              min={MIN_COFFEE_PRICE}
              max={MAX_COFFEE_PRICE}
              step={1}
              aria-invalid={Boolean(errors.coffeePrice)}
              aria-describedby={
                errors.coffeePrice
                  ? "register-coffee-price-error"
                  : "register-coffee-price-help"
              }
              className="pl-8"
              placeholder="100"
              {...registerField("coffeePrice", {
                required: "Enter a coffee price.",
                valueAsNumber: true,
                validate: (value) => {
                  if (value === undefined || value === null || Number.isNaN(value)) {
                    return "Enter a coffee price.";
                  }
                  if (!Number.isInteger(value)) {
                    return "Enter a whole number of rupees.";
                  }
                  if (value < MIN_COFFEE_PRICE) {
                    return `Coffee price must be at least ₹${MIN_COFFEE_PRICE}.`;
                  }
                  if (value > MAX_COFFEE_PRICE) {
                    return `Coffee price cannot be more than ₹${MAX_COFFEE_PRICE}.`;
                  }
                  return true;
                },
                onChange: () => setRequestError(null),
              })}
            />
          </div>
          {errors.coffeePrice ? (
            <p id="register-coffee-price-error" className="mt-1.5 text-body-small text-danger" role="alert">
              {errors.coffeePrice.message}
            </p>
          ) : (
            <p id="register-coffee-price-help" className="mt-1.5 text-body-small text-muted">
              Choose between ₹{MIN_COFFEE_PRICE} and ₹{MAX_COFFEE_PRICE}.
            </p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="register-bio" className="mb-field-label block text-label text-surface-foreground">
            Bio <span className="font-normal text-muted">(optional)</span>
          </label>
          <Textarea
            id="register-bio"
            rows={2}
            aria-invalid={Boolean(errors.bio)}
            aria-describedby={errors.bio ? "register-bio-error" : undefined}
            placeholder="What do you make?"
            {...registerField("bio", { onChange: () => setRequestError(null) })}
          />
          {errors.bio && (
            <p id="register-bio-error" className="mt-1.5 text-body-small text-danger" role="alert">
              {errors.bio.message}
            </p>
          )}
        </div>

        {/* Error banner */}
        {requestError && (
          <div className="rounded-card border border-danger-border bg-danger-surface px-4 py-3 animate-fade-in" role="alert">
            <p className="text-body-small text-danger-foreground">{requestError}</p>
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading && (
            <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground" />
          )}
          {isLoading ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-body-small text-muted">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary-hover hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
        >
          Sign in
        </Link>
      </p>
    </section>
  );
};

export default RegisterPage;