import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hook/auth.hook";
import { getAuthFormErrorDetails } from "../features/auth/utils/authFormErrors";

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
      <p className="text-[11px] font-semibold tracking-[0.18em] text-[#537264]">START WITH THE BASICS</p>
      <h2 id="register-heading" className="mt-3 font-serif text-[36px] leading-tight text-[#1b2924]">
        Create your account.
      </h2>
      <p className="mt-2 text-sm leading-6 text-[#69746e]">
        Set up your creator profile to get started.
      </p>

      <form className="mt-6 space-y-4" noValidate onSubmit={handleSubmit(handleRegister)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="register-name" className="mb-1.5 block text-sm font-medium text-[#26352e]">
              Name
            </label>
            <input
              id="register-name"
              type="text"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "register-name-error" : undefined}
              className="w-full rounded-md border border-[#d5dbd5] bg-white px-3.5 py-2.5 text-sm text-[#1b2924] outline-none transition placeholder:text-[#9aa39d] focus:border-[#32634f] focus:ring-2 focus:ring-[#32634f]/15 aria-invalid:border-[#b34b43]"
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
            {errors.name && <p id="register-name-error" className="mt-1 text-xs text-[#a63f38]" role="alert">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="register-username" className="mb-1.5 block text-sm font-medium text-[#26352e]">
              Username
            </label>
            <input
              id="register-username"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              autoCorrect="off"
              aria-invalid={Boolean(errors.username)}
              aria-describedby={errors.username ? "register-username-error" : undefined}
              className="w-full rounded-md border border-[#d5dbd5] bg-white px-3.5 py-2.5 text-sm text-[#1b2924] outline-none transition placeholder:text-[#9aa39d] focus:border-[#32634f] focus:ring-2 focus:ring-[#32634f]/15 aria-invalid:border-[#b34b43]"
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
            {errors.username && <p id="register-username-error" className="mt-1 text-xs text-[#a63f38]" role="alert">{errors.username.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="register-email" className="mb-1.5 block text-sm font-medium text-[#26352e]">
            Email
          </label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "register-email-error" : undefined}
            className="w-full rounded-md border border-[#d5dbd5] bg-white px-3.5 py-2.5 text-sm text-[#1b2924] outline-none transition placeholder:text-[#9aa39d] focus:border-[#32634f] focus:ring-2 focus:ring-[#32634f]/15 aria-invalid:border-[#b34b43]"
            placeholder="you@example.com"
            {...registerField("email", {
              required: "Enter your email address.",
              pattern: { value: emailPattern, message: "Enter a valid email address." },
              onChange: () => setRequestError(null),
            })}
          />
          {errors.email && <p id="register-email-error" className="mt-1 text-xs text-[#a63f38]" role="alert">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="register-password" className="mb-1.5 block text-sm font-medium text-[#26352e]">
            Password
          </label>
          <div className="relative">
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "register-password-error" : undefined}
              className="w-full rounded-md border border-[#d5dbd5] bg-white px-3.5 py-2.5 pr-16 text-sm text-[#1b2924] outline-none transition placeholder:text-[#9aa39d] focus:border-[#32634f] focus:ring-2 focus:ring-[#32634f]/15 aria-invalid:border-[#b34b43]"
              placeholder="At least 8 characters"
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
              className="absolute inset-y-0 right-3 rounded px-1 text-xs font-medium text-[#537264] outline-none hover:text-[#173d32] focus-visible:ring-2 focus-visible:ring-[#32634f]"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && <p id="register-password-error" className="mt-1 text-xs text-[#a63f38]" role="alert">{errors.password.message}</p>}
        </div>

        <div>
          <label htmlFor="register-coffee-price" className="mb-1.5 block text-sm font-medium text-[#26352e]">
            Coffee Price
          </label>
          <p className="mb-2 text-xs text-[#69746e]">
            How much should one coffee cost? This is the default amount supporters will see on your page.
          </p>
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm font-medium text-[#69746e]"
            >
              ₹
            </span>
            <input
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
              className="w-full rounded-md border border-[#d5dbd5] bg-white pl-8 pr-3.5 py-2.5 text-sm text-[#1b2924] outline-none transition placeholder:text-[#9aa39d] focus:border-[#32634f] focus:ring-2 focus:ring-[#32634f]/15 aria-invalid:border-[#b34b43]"
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
            <p id="register-coffee-price-error" className="mt-1 text-xs text-[#a63f38]" role="alert">
              {errors.coffeePrice.message}
            </p>
          ) : (
            <p id="register-coffee-price-help" className="mt-1 text-xs text-[#69746e]">
              Choose between ₹{MIN_COFFEE_PRICE} and ₹{MAX_COFFEE_PRICE}.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="register-bio" className="mb-1.5 block text-sm font-medium text-[#26352e]">
            Bio <span className="font-normal text-[#87918a]">(optional)</span>
          </label>
          <textarea
            id="register-bio"
            rows={2}
            aria-invalid={Boolean(errors.bio)}
            aria-describedby={errors.bio ? "register-bio-error" : undefined}
            className="w-full resize-y rounded-md border border-[#d5dbd5] bg-white px-3.5 py-2.5 text-sm text-[#1b2924] outline-none transition placeholder:text-[#9aa39d] focus:border-[#32634f] focus:ring-2 focus:ring-[#32634f]/15 aria-invalid:border-[#b34b43]"
            placeholder="What do you make?"
            {...registerField("bio", { onChange: () => setRequestError(null) })}
          />
          {errors.bio && <p id="register-bio-error" className="mt-1 text-xs text-[#a63f38]" role="alert">{errors.bio.message}</p>}
        </div>

        {requestError && (
          <p className="rounded-md border border-[#e8c9c5] bg-[#fbf0ee] px-3.5 py-2.5 text-sm text-[#963b35]" role="alert">
            {requestError}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-[#173d32] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#245343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#32634f] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65"
        >
          {isLoading && <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
          {isLoading ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[#69746e]">
        Already have an account?{" "}
        <Link to="/login" className="font-semibold text-[#245343] underline decoration-[#9cb3a5] underline-offset-4 hover:text-[#173d32] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#32634f]">
          Sign in
        </Link>
      </p>
    </section>
  );
};

export default RegisterPage;