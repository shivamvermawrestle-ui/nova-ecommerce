
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  useLazyGetCurrentUserQuery,
  useLoginMutation,
} from "../../services/productsApi";
import { UseGlob } from "../../Context/GlobalContext";
import StorysetLoginIllustration from "../../Components/Common/StorysetLoginIllustration";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const { dark } = UseGlob();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading: loginLoading, error: loginError }] =
    useLoginMutation();

  const [getCurrentUser, { isLoading: userLoading }] =
    useLazyGetCurrentUserQuery();

  const isLoading = loginLoading || userLoading;
  const error = loginError;

  // Theme colors
  const mainText = dark ? "text-[#EAF0FA]" : "text-[#202C50]";
  const mutedText = dark ? "text-[#AAB8D0]" : "text-[#64718A]";
  const secondaryText = dark ? "text-[#8190AA]" : "text-[#8A96AA]";
  const accentText = dark ? "text-[#7895C5]" : "text-[#344F82]";

  const inputStyle = dark
    ? "border-[#465570] bg-[#202A40] text-[#EAF0FA] placeholder-[#8190AA] focus:border-[#7895C5] focus:ring-1 focus:ring-[#7895C5]"
    : "border-[#D8E1EF] bg-white text-[#202C50] placeholder-[#8A96AA] focus:border-[#344F82] focus:ring-1 focus:ring-[#344F82]";

  const cardStyle = dark
    ? "border-[#35435C] bg-[#202A40]"
    : "border-[#D8E1EF] bg-white";

  const submitButton = dark
    ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
    : "bg-[#202C50] text-white hover:bg-[#344F82]";

  const errorBanner = dark
    ? "border-[#F08089]/30 bg-[#F08089]/10 text-[#F08089]"
    : "border-[#C04452]/30 bg-[#C04452]/10 text-[#C04452]";

  const handleChange = (event) => {
    const { name, value } = event.target;

    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getErrorMessage = () => {
    if (!error) return "";
    if (error.status === "FETCH_ERROR") {
      return "Cannot connect to server. Please check your connection or wait a moment for backend to wake up.";
    }
    if (typeof error.data?.message === "string") {
      return error.data.message;
    }
    if (typeof error.data === "string") {
      return error.data;
    }
    if (typeof error.message === "string") {
      return error.message;
    }
    return "Login failed. Please check your credentials.";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const sanitizedData = {
      email: (loginData.email || "").trim().toLowerCase(),
      password: loginData.password,
    };

    try {
      const loginRes = await login(sanitizedData).unwrap();

      // 1. Immediately store token in localStorage FIRST!
      if (typeof window !== "undefined" && loginRes?.data) {
        localStorage.setItem("nova_token", loginRes.data);
      }

      // 2. Use user from login response or fetch via getCurrentUser
      let user = loginRes?.user;
      if (!user) {
        user = await getCurrentUser().unwrap();
      }

      // 3. Store user in localStorage
      if (typeof window !== "undefined" && user) {
        localStorage.setItem("nova_user", JSON.stringify(user));
      }

      // 4. Redirect based on role
      if (user?.role === "ADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/shop");
      }
    } catch {
      // Handled by loginError
    }
  };

  return (
    <main
      className={`flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-10 transition-colors duration-200 sm:px-6 sm:py-16 ${
        dark
          ? "bg-[#171E30] text-[#EAF0FA]"
          : "bg-[#F7F9FC] text-[#202C50]"
      }`}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Illustration & Brand Welcome */}
          <div className="flex flex-col items-center text-center lg:col-span-6 lg:items-start lg:text-left">
            <h1
              className={`text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl ${mainText}`}
            >
              Welcome back to{" "}
              <span className={accentText}>Nova</span>
              <span className={accentText}>.</span>
            </h1>

            <p
              className={`mt-3 max-w-md text-sm leading-relaxed sm:text-base ${mutedText}`}
            >
              Sign in to manage your orders, access your personal wishlist,
              and unlock exclusive discounts.
            </p>

            {/* Animated Storyset Illustration */}
            <div className="my-3 flex w-full justify-center sm:my-6 lg:my-8 lg:justify-start">
              <StorysetLoginIllustration />
            </div>

            {/* Trust Highlights */}
            <div className="hidden items-center gap-6 text-xs font-semibold sm:flex">
              <div className={`flex items-center gap-1.5 ${mutedText}`}>
                <ShieldCheck size={16} className={accentText} />
                <span>256-bit Encryption</span>
              </div>

              <div className={`flex items-center gap-1.5 ${mutedText}`}>
                <Zap size={16} className={accentText} />
                <span>Instant Checkout</span>
              </div>
            </div>
          </div>

          {/* Right Column: Login Form Card */}
          <div className="mx-auto w-full max-w-md lg:col-span-6">
            <div
              className={`rounded-3xl border p-6 shadow-xl transition-all duration-300 sm:p-10 ${cardStyle}`}
            >
              {/* Form Card Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xl font-black italic tracking-tight">
                    <span className={accentText}>Nova</span>
                    <span className={accentText}>.</span>
                  </div>

                  <span className={`text-[10px] font-semibold italic ${mutedText}`}>
                    Explore{" "}
                    <span className={`${accentText} font-bold`}>
                      Store
                    </span>
                  </span>
                </div>

                <h2
                  className={`mt-4 text-2xl font-bold tracking-tight ${mainText}`}
                >
                  Log In
                </h2>

                <p className={`mt-1 text-xs sm:text-sm ${mutedText}`}>
                  Enter your credentials below to access your account
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className={`block text-xs font-semibold ${mainText}`}
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <Mail size={17} className={secondaryText} />
                    </div>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={loginData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      placeholder="name@example.com"
                      required
                      className={`w-full rounded-xl border py-2.5 pl-10 pr-3.5 text-sm shadow-sm outline-none transition-all ${inputStyle}`}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className={`block text-xs font-semibold ${mainText}`}
                  >
                    Password
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <Lock size={17} className={secondaryText} />
                    </div>

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={loginData.password}
                      onChange={handleChange}
                      autoComplete="current-password"
                      placeholder="••••••••"
                      required
                      className={`w-full rounded-xl border py-2.5 pl-10 pr-10 text-sm shadow-sm outline-none transition-all ${inputStyle}`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      className={`absolute inset-y-0 right-0 flex items-center pr-3.5 transition-colors ${
                        dark
                          ? "text-[#8190AA] hover:text-[#EAF0FA]"
                          : "text-[#8A96AA] hover:text-[#202C50]"
                      }`}
                    >
                      {showPassword ? (
                        <EyeOff size={17} />
                      ) : (
                        <Eye size={17} />
                      )}
                    </button>
                  </div>
                </div>
                {/* Error Banner */}
                {error && (
                  <div
                    role="alert"
                    className={`rounded-xl border p-3 text-xs font-semibold ${errorBanner}`}
                  >
                    {getErrorMessage()}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold shadow-md transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 ${submitButton}`}
                >
                  <span>
                    {isLoading ? "Signing in..." : "Sign In"}
                  </span>

                  {!isLoading && <ArrowRight size={16} />}
                </button>
              </form>

              {/* Sign Up Redirect */}
              <div
                className={`mt-6 border-t pt-5 text-center text-xs ${
                  dark
                    ? "border-[#35435C] text-[#8190AA]"
                    : "border-[#D8E1EF] text-[#64718A]"
                }`}
              >
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className={`font-bold transition-colors hover:underline ${accentText}`}
                >
                  Create an account
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
