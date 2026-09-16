import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";

const Register = () => {
  const { register: registerUserAccount } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const success = await registerUserAccount(data);

    if (success) {
      console.log("hello reg");
      return;
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
            Create an account
          </h1>

          <p className="mt-3 text-sm text-[#756e67]">
            Join us and discover your next look.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#e5dfd7] p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-xs font-medium tracking-wide text-[#3f3a35]"
              >
                NAME
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
                className={`w-full border bg-[#faf9f7] px-4 py-3 text-sm text-[#1c1a18] outline-none transition placeholder:text-[#aaa29a]
                  ${
                    errors.name
                      ? "border-red-400 focus:ring-1 focus:ring-red-400"
                      : "border-[#ddd6ce] focus:border-[#1c1a18]"
                  }`}
              />

              {errors.name && (
                <p className="mt-1.5 text-xs text-red-500">
                  {errors.name.message}
                </p>
              )}
            </div>

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
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                className={`w-full border bg-[#faf9f7] px-4 py-3 text-sm text-[#1c1a18] outline-none transition placeholder:text-[#aaa29a]
                  ${
                    errors.email
                      ? "border-red-400 focus:ring-1 focus:ring-red-400"
                      : "border-[#ddd6ce] focus:border-[#1c1a18]"
                  }`}
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
                placeholder="Create a password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`w-full border bg-[#faf9f7] px-4 py-3 text-sm text-[#1c1a18] outline-none transition placeholder:text-[#aaa29a]
                  ${
                    errors.password
                      ? "border-red-400 focus:ring-1 focus:ring-red-400"
                      : "border-[#ddd6ce] focus:border-[#1c1a18]"
                  }`}
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
              className="w-full bg-[#1c1a18] py-3.5 text-sm font-medium tracking-wide text-white transition hover:bg-[#302c28] active:scale-[0.99]"
            >
              CREATE ACCOUNT
            </button>
          </form>

          {/* Login */}
          <p className="mt-7 text-center text-sm text-[#756e67]">
            Already have an account?{" "}
            <a
              href="/login"
              className="font-medium text-[#1c1a18] underline underline-offset-4 hover:text-[#756e67]"
            >
              Login
            </a>
          </p>
        </div>

        <p className="mt-6 text-center text-[11px] tracking-wide text-[#9b938b]">
          PREMIUM MENSWEAR • EVERYDAY ESSENTIALS
        </p>
      </div>
    </div>
  );
};

export default Register;