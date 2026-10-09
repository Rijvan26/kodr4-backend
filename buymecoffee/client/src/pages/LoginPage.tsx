import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hook/auth.hook";
import { getAuthFormErrorDetails } from "../features/auth/utils/authFormErrors";

interface LoginFormValues {
  email: string;
  password: string;
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loginState } = useAuth();
  const isLoading = loginState.isLoading;
  const [requestError, setRequestError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormValues>({
    mode: "onBlur",
    reValidateMode: "onChange",
  });

  const handleLogin: SubmitHandler<LoginFormValues> = async ({ email, password }) => {
    setRequestError(null);
    try {
      await login({ email: email.trim(), password });
      navigate("/dashboard");
    } catch (error) {
      const details = getAuthFormErrorDetails(error);
      setRequestError(details.message);
      if (details.fieldErrors.email) {
        setError("email", { type: "server", message: details.fieldErrors.email });
      }
      if (details.fieldErrors.password) {
        setError("password", { type: "server", message: details.fieldErrors.password });
      }
    }
  };

  return (
    <section aria-labelledby="login-heading">
      <p className="text-[11px] font-semibold tracking-[0.18em] text-[#537264]">YOUR CREATOR ACCOUNT</p>
      <h2 id="login-heading" className="mt-4 font-serif text-[38px] leading-tight text-[#1b2924]">
        Welcome back.
      </h2>
      <p className="mt-3 text-sm leading-6 text-[#69746e]">
        Sign in to continue to your space.
      </p>

      <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit(handleLogin)}>
        <div>
          <label htmlFor="login-email" className="mb-2 block text-sm font-medium text-[#26352e]">
            Email
          </label>
          <input
            id="login-email"
            type="email"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            className="w-full rounded-md border border-[#d5dbd5] bg-white px-3.5 py-3 text-sm text-[#1b2924] outline-none transition placeholder:text-[#9aa39d] focus:border-[#32634f] focus:ring-2 focus:ring-[#32634f]/15 aria-invalid:border-[#b34b43]"
            placeholder="you@example.com"
            {...register("email", {
              required: "Enter your email address.",
              pattern: { value: emailPattern, message: "Enter a valid email address." },
              onChange: () => setRequestError(null),
            })}
          />
          {errors.email && (
            <p id="login-email-error" className="mt-1.5 text-xs text-[#a63f38]" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="login-password" className="mb-2 block text-sm font-medium text-[#26352e]">
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "login-password-error" : undefined}
              className="w-full rounded-md border border-[#d5dbd5] bg-white px-3.5 py-3 pr-16 text-sm text-[#1b2924] outline-none transition placeholder:text-[#9aa39d] focus:border-[#32634f] focus:ring-2 focus:ring-[#32634f]/15 aria-invalid:border-[#b34b43]"
              placeholder="Your password"
              {...register("password", {
                required: "Enter your password.",
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
          {errors.password && (
            <p id="login-password-error" className="mt-1.5 text-xs text-[#a63f38]" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        {requestError && (
          <p className="rounded-md border border-[#e8c9c5] bg-[#fbf0ee] px-3.5 py-3 text-sm text-[#963b35]" role="alert">
            {requestError}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-[#173d32] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#245343] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#32634f] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-65"
        >
          {isLoading && <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />}
          {isLoading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-[#69746e]">
        New here?{" "}
        <Link to="/register" className="font-semibold text-[#245343] underline decoration-[#9cb3a5] underline-offset-4 hover:text-[#173d32] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#32634f]">
          Create an account
        </Link>
      </p>
    </section>
  );
};

export default LoginPage;