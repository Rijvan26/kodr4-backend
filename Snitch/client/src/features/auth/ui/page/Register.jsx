import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";

const Register = () => {
    const {register:registerUserAccount} = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const success = await registerUserAccount(data)

    if(success) {
      console.log("hello reg")
        return 
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">
            Create an account
          </h1>

          <p className="mt-2 text-sm text-zinc-400">
            Create your account to get started
          </p>
        </div>

        {/* Card */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-zinc-200 mb-2"
              >
                Name
              </label>

              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters",
                  },
                })}
                className={`w-full rounded-lg bg-zinc-950 border px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 transition
                  ${
                    errors.name
                      ? "border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-zinc-800 focus:border-white"
                  }`}
              />

              {errors.name && (
                <p className="mt-1.5 text-xs text-red-400">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-zinc-200 mb-2"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                className={`w-full rounded-lg bg-zinc-950 border px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 transition
                  ${
                    errors.email
                      ? "border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-zinc-800 focus:border-white"
                  }`}
              />

              {errors.email && (
                <p className="mt-1.5 text-xs text-red-400">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-zinc-200 mb-2"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full rounded-lg bg-zinc-950 border px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 transition
                  ${
                    errors.password
                      ? "border-red-500 focus:ring-1 focus:ring-red-500"
                      : "border-zinc-800 focus:border-white"
                  }`}
              />

              {errors.password && (
                <p className="mt-1.5 text-xs text-red-400">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-white py-3 text-sm font-semibold text-black transition hover:bg-zinc-200 active:scale-[0.98]"
            >
              Create account
            </button>
          </form>

          {/* Login */}
          <p className="text-center text-sm text-zinc-500 mt-6">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-white hover:underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;