import { useForm } from "react-hook-form";

interface IAuthFormInput {
  email: string;
  password: string;
}

export default function AuthForm({ type }: { type: "signup" | "signin" }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAuthFormInput>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: IAuthFormInput) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-[#F7F4ED] relative overflow-hidden flex items-center justify-center px-6 py-10">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-yellow-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-20 w-80 h-80 bg-green-300/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-black/5 rounded-full" />
      </div>
      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_80px_rgba\(0,0,0,0.08\)] border border-white/40 p-8 md:p-10">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-black text-white text-3xl font-serif shadow-lg mb-6">
            S
          </div>

          <h1 className="text-5xl font-serif tracking-tight text-[#242424]">
            Stories
          </h1>

          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold tracking-wide uppercase">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Join 2M+ readers
          </div>

          <h2 className="mt-6 text-3xl font-bold text-[#242424]">
            {type === "signup" ? "Create your account" : "Welcome back"}
          </h2>

          <p className="mt-3 text-sm text-black/60 leading-relaxed">
            {type === "signup"
              ? "Join Stories to discover stories, follow writers, and publish your own content."
              : "Sign in to continue reading and writing on Stories."}
          </p>
        </div>

        <div className="mt-8 space-y-4">
          <button className="w-full border border-black/10 bg-white rounded-2xl py-3 px-4 flex items-center justify-center gap-3 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <span className="text-lg font-semibold">G</span>
            Continue with Google
          </button>

          <button className="w-full border border-black/10 bg-white rounded-2xl py-3 px-4 flex items-center justify-center gap-3 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200">
            <span className="text-lg font-bold">f</span>
            Continue with Facebook
          </button>
        </div>

        <div className="my-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-black/10" />
          <span className="text-sm text-black/40">or</span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-[#242424]">
              Email
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              })}
              className="w-full bg-[#FAFAFA] border border-black/10 rounded-2xl px-4 py-3 outline-none transition focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black/20"
            />

            {errors.email && (
              <p className="mt-2 text-sm text-red-500">
                {errors.email.message as string}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#242424]">
              Password
            </label>

            <input
              type="password"
              placeholder="••••••••"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 5,
                  message: "Password must be at least 5 characters",
                },
                maxLength: {
                  value: 20,
                  message: "Password cannot exceed 20 characters",
                },
              })}
              className="w-full bg-[#FAFAFA] border border-black/10 rounded-2xl px-4 py-3 outline-none transition focus:bg-white focus:ring-4 focus:ring-black/5 focus:border-black/20"
            />

            {errors.password && (
              <p className="mt-2 text-sm text-red-500">
                {errors.password.message as string}
              </p>
            )}
          </div>

          {type === "signin" && (
            <div className="flex justify-end">
              <a
                href="#"
                className="text-sm text-black/60 hover:text-black transition"
              >
                Forgot password?
              </a>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full bg-black text-white rounded-2xl py-3 text-lg font-medium hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
            >
              {type === "signup" ? "Sign Up" : "Sign In"}
            </button>
          </div>
        </form>

        <p className="mt-6 text-center text-sm text-black/60">
          {type === "signup"
            ? "Already have an account? "
            : "Don't have an account? "}

          <a
            href={type === "signup" ? "/sign-in" : "/sign-up"}
            className="text-black font-semibold hover:underline"
          >
            {type === "signup" ? "Sign in" : "Create one"}
          </a>
        </p>

        <p className="mt-8 text-xs text-center leading-relaxed text-black/40">
          By continuing, you agree to our Terms of Service and acknowledge that
          our Privacy Policy applies to you.
        </p>
      </div>
    </div>
  );
}
