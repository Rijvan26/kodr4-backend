import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const { login: loginUserAccount } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    const success = await loginUserAccount(data);

    if (success) {
      console.log("done login");
      navigate("/home");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f1eb] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <p className="text-xs tracking-[0.3em] text-[#8a8178] uppercase">
            Snitch
          </p>

          <h1 className="mt-4 text-3xl sm:text-4xl font-serif font-medium text-[#1c1a18]">
            Welcome back
          </h1>

          <p className="mt-3 text-sm text-[#756e67]">
            Sign in to continue shopping.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#e5dfd7] p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-medium tracking-wide text-[#3f3a35]"
              >
                EMAIL
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className={`w-full border bg-[#faf9f7] px-4 py-3 text-sm text-[#1c1a18] outline-none transition placeholder:text-[#aaa29a]
                  ${
                    errors.email
                      ? "border-red-400 focus:ring-1 focus:ring-red-400"
                      : "border-[#ddd6ce] focus:border-[#1c1a18]"
                  }`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
              />

              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-medium tracking-wide text-[#3f3a35]"
              >
                PASSWORD
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className={`w-full border bg-[#faf9f7] px-4 py-3 text-sm text-[#1c1a18] outline-none transition placeholder:text-[#aaa29a]
                  ${
                    errors.password
                      ? "border-red-400 focus:ring-1 focus:ring-red-400"
                      : "border-[#ddd6ce] focus:border-[#1c1a18]"
                  }`}
                {...register("password", {
                  required: "Password is required",
                })}
              />

              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1c1a18] px-4 py-3.5 text-sm font-medium tracking-wide text-white transition hover:bg-[#302c28] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "LOGGING IN..." : "LOGIN"}
            </button>
          </form>

          {/* Register */}
          <p className="mt-7 text-center text-sm text-[#756e67]">
            Don't have an account?{" "}
            <a
              href="/register"
              className="font-medium text-[#1c1a18] underline underline-offset-4 hover:text-[#756e67]"
            >
              Create account
            </a>
          </p>
        </div>

        <p className="mt-6 text-center text-[11px] tracking-wide text-[#9b938b]">
          PREMIUM MENSWEAR • EVERYDAY ESSENTIALS
        </p>
      </div>
    </div>
  );
}

export default Login;