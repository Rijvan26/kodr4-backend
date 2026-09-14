import { useForm } from "react-hook-form";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);

    // Later:
    // const result = await dispatch(loginUser(data));
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">
            Welcome back
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Login to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-200"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
            />

            {errors.email && (
              <p className="mt-1 text-sm text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-200"
            >
              Password
            </label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              className="w-full rounded-lg border border-gray-700 bg-gray-950 px-4 py-3 text-white outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              {...register("password", {
                required: "Password is required",
              })}
            />

            {errors.password && (
              <p className="mt-1 text-sm text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Register */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <a
            href="/register"
            className="font-medium text-indigo-400 hover:text-indigo-300"
          >
            Create account
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;