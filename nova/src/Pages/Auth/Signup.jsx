import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignupMutation } from "../../services/productsApi";
import { UseGlob } from "../../Context/GlobalContext";
import StorysetSignupIllustration from "../../Components/Common/StorysetSignupIllustration";
import {
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Zap,
} from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const { dark } = UseGlob();

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const [signup, { isLoading, error }] = useSignupMutation();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSignupData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signup(signupData).unwrap();
      navigate("/login", {
        state: { message: "Account created successfully. Please log in." },
      });
    } catch {
      // RTK Query stores error in `error`
    }
  };

  return (
    <main
      className={`min-h-[calc(100vh-140px)] flex items-center justify-center px-4 sm:px-6 py-10 sm:py-16 transition-colors duration-200 ${
        dark ? "bg-[#171E30] text-[#EAF0FA]" : "bg-[#F7F9FC] text-[#202C50]"
      }`}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Animated Storyset Illustration & Welcome Text */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight ${
                dark ? "text-[#EAF0FA]" : "text-[#202C50]"
              }`}
            >
              Create your <span className={dark ? "text-[#7895C5]" : "text-[#202C50]"}>Nova</span>
              <span className="text-[#7895C5]">.</span> account
            </h1>

            <p
              className={`mt-3 max-w-md text-sm sm:text-base leading-relaxed ${
                dark ? "text-[#AAB8D0]" : "text-[#64718A]"
              }`}
            >
              Join thousands of happy shoppers exploring top-rated electronics, fashion, and daily deals with fast door-step delivery.
            </p>

            {/* Animated Storyset Illustration (with Infinite Float & Pulse Animations) */}
            <div className="my-3 sm:my-6 lg:my-8 w-full flex justify-center lg:justify-start">
              <StorysetSignupIllustration />
            </div>

            {/* Trust Highlights */}
            <div className="hidden sm:flex items-center gap-6 text-xs font-semibold">
              <div
                className={`flex items-center gap-1.5 ${
                  dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                }`}
              >
                <ShieldCheck size={16} className={dark ? "text-[#7895C5]" : "text-[#202C50]"} />
                <span>Verified Buyer Protection</span>
              </div>
              <div
                className={`flex items-center gap-1.5 ${
                  dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                }`}
              >
                <Zap size={16} className="text-[#3568A8] dark:text-[#8CB4EC]" />
                <span>Instant Member Perks</span>
              </div>
            </div>
          </div>

          {/* Right Column: Modern Glass / Solid Signup Form Card */}
          <div className="lg:col-span-6 w-full max-w-md mx-auto">
            <div
              className={`rounded-3xl border p-6 sm:p-10 shadow-xl transition-all duration-300 ${
                dark
                  ? "border-[#35435C] bg-[#202A40]"
                  : "border-[#D8E1EF] bg-white"
              }`}
            >
              {/* Form Card Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-xl font-black italic tracking-tight">
                    <span className={dark ? "text-[#7895C5]" : "text-[#202C50]"}>
                      Nova
                    </span>
                    <span className="text-[#7895C5]">.</span>
                  </div>
                  <span
                    className={`text-[10px] font-semibold italic ${
                      dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                    }`}
                  >
                    Explore <span className="text-[#7895C5] font-bold">Store</span>
                  </span>
                </div>

                <h2
                  className={`mt-4 text-2xl font-bold tracking-tight ${
                    dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                  }`}
                >
                  Sign Up
                </h2>
                <p
                  className={`mt-1 text-xs sm:text-sm ${
                    dark ? "text-[#AAB8D0]" : "text-[#64718A]"
                  }`}
                >
                  Create an account to begin shopping right away
                </p>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name Input */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className={`block text-xs font-semibold ${
                      dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                    }`}
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User
                        size={17}
                        className={dark ? "text-[#8190AA]" : "text-[#8A96AA]"}
                      />
                    </div>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={signupData.name}
                      onChange={handleChange}
                      autoComplete="name"
                      placeholder="John Doe"
                      required
                      className={`w-full rounded-xl border pl-10 pr-3.5 py-2.5 text-sm outline-none transition-all shadow-2xs ${
                        dark
                          ? "border-[#465570] bg-[#202A40] text-[#EAF0FA] placeholder-[#8190AA] focus:border-[#9BB2D8] focus:ring-1 focus:ring-[#9BB2D8]"
                          : "border-[#C9D5E7] bg-white text-[#202C50] placeholder-[#8A96AA] focus:border-[#7895C5] focus:ring-1 focus:ring-[#7895C5]"
                      }`}
                    />
                  </div>
                </div>

                {/* Email Address Input */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className={`block text-xs font-semibold ${
                      dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                    }`}
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Mail
                        size={17}
                        className={dark ? "text-[#8190AA]" : "text-[#8A96AA]"}
                      />
                    </div>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={signupData.email}
                      onChange={handleChange}
                      autoComplete="email"
                      placeholder="name@example.com"
                      required
                      className={`w-full rounded-xl border pl-10 pr-3.5 py-2.5 text-sm outline-none transition-all shadow-2xs ${
                        dark
                          ? "border-[#465570] bg-[#202A40] text-[#EAF0FA] placeholder-[#8190AA] focus:border-[#9BB2D8] focus:ring-1 focus:ring-[#9BB2D8]"
                          : "border-[#C9D5E7] bg-white text-[#202C50] placeholder-[#8A96AA] focus:border-[#7895C5] focus:ring-1 focus:ring-[#7895C5]"
                      }`}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="password"
                    className={`block text-xs font-semibold ${
                      dark ? "text-[#EAF0FA]" : "text-[#202C50]"
                    }`}
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock
                        size={17}
                        className={dark ? "text-[#8190AA]" : "text-[#8A96AA]"}
                      />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={signupData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      placeholder="At least 6 characters"
                      required
                      className={`w-full rounded-xl border pl-10 pr-10 py-2.5 text-sm outline-none transition-all shadow-2xs ${
                        dark
                          ? "border-[#465570] bg-[#202A40] text-[#EAF0FA] placeholder-[#8190AA] focus:border-[#9BB2D8] focus:ring-1 focus:ring-[#9BB2D8]"
                          : "border-[#C9D5E7] bg-white text-[#202C50] placeholder-[#8A96AA] focus:border-[#7895C5] focus:ring-1 focus:ring-[#7895C5]"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors ${
                        dark
                          ? "text-[#8190AA] hover:text-[#EAF0FA]"
                          : "text-[#8A96AA] hover:text-[#202C50]"
                      }`}
                    >
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>

                {/* Error Banner */}
                {error && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs font-semibold text-red-500">
                    {error.data?.message || "Signup failed. Please try again."}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold shadow-md transition-all duration-200 active:scale-98 disabled:opacity-60 cursor-pointer ${
                    dark
                      ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
                      : "bg-[#202C50] text-white hover:bg-[#344F82]"
                  }`}
                >
                  <span>{isLoading ? "Creating account..." : "Sign Up"}</span>
                  {!isLoading && <ArrowRight size={16} />}
                </button>
              </form>

              {/* Login Redirect */}
              <div
                className={`mt-6 pt-5 border-t text-center text-xs ${
                  dark ? "border-[#35435C] text-[#8190AA]" : "border-[#D8E1EF] text-[#64718A]"
                }`}
              >
                Already have an account?{" "}
                <Link
                  to="/login"
                  className={`font-bold transition-colors ${
                    dark
                      ? "text-[#7895C5] hover:underline"
                      : "text-[#202C50] hover:underline"
                  }`}
                >
                  Log in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;