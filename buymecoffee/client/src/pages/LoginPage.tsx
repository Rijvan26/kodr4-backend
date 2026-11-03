import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/hook/auth.hook";
import { getAuthFormErrorDetails } from "../features/auth/utils/authFormErrors";
import Input from "../shared/ui/Input";
import Button from "../shared/ui/Button";

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
      <p className="text-caption tracking-kicker text-primary font-semibold">
        SUPPORTME.COM CREATOR LOGIN
      </p>
      <h2 id="login-heading" className="mt-3 font-display text-heading text-foreground">
        Welcome back.
      </h2>
      <p className="mt-2 text-body-relaxed text-muted">
        Sign in to manage your page and track your supporters.
      </p>

      <form className="mt-7 space-y-5" noValidate onSubmit={handleSubmit(handleLogin)}>
        {/* Email */}
        <div>
          <label htmlFor="login-email" className="mb-field-label block text-label text-surface-foreground">
            Email address
          </label>
          <Input
            id="login-email"
            type="email"
            autoComplete="username"
            autoCapitalize="none"
            autoCorrect="off"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "login-email-error" : undefined}
            placeholder="you@example.com"
            {...register("email", {
              required: "Enter your email address.",
              pattern: { value: emailPattern, message: "Enter a valid email address." },
              onChange: () => setRequestError(null),
            })}
          />
          {errors.email && (
            <p id="login-email-error" className="mt-1.5 text-body-small text-danger" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password */}
        <div>
          <label htmlFor="login-password" className="mb-field-label block text-label text-surface-foreground">
            Password
          </label>
          <div className="relative">
            <Input
              id="login-password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "login-password-error" : undefined}
              placeholder="Your password"
              className="pr-12"
              {...register("password", {
                required: "Enter your password.",
                onChange: () => setRequestError(null),
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-body-small text-muted transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-small px-1"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          {errors.password && (
            <p id="login-password-error" className="mt-1.5 text-body-small text-danger" role="alert">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Request Error Banner */}
        {requestError && (
          <div className="rounded-card border border-danger-border bg-danger-surface px-4 py-3 text-body-small text-danger-foreground animate-fade-in" role="alert">
            {requestError}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full shadow-sm"
        >
          {isLoading && (
            <span aria-hidden="true" className="size-4 animate-spin rounded-full border-2 border-primary-foreground/40 border-t-primary-foreground mr-2" />
          )}
          {isLoading ? "Signing in…" : "Sign in to your dashboard"}
        </Button>
      </form>

      <p className="mt-7 text-center text-body-small text-muted">
        New to supportme.com?{" "}
        <Link
          to="/register"
          className="font-semibold text-primary underline decoration-primary/30 underline-offset-4 transition-colors hover:text-primary-hover hover:decoration-primary"
        >
          Create your page
        </Link>
      </p>
    </section>
  );
};

export default LoginPage;