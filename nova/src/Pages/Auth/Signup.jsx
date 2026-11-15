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
    confirmPassword: "",
    profilePic: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSignupData((prev) => ({
        ...prev,
        profilePic: reader.result,
      }));
    };
  };
  const [signup, { isLoading, error }] = useSignupMutation();

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

    setSignupData((prev) => ({
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
    return "Signup failed. Please try again.";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setPasswordError("");
    if (signupData.password !== signupData.confirmPassword) {
      setPasswordError("Passwords do not match!");
      return;
    }
    const sanitizedData = {
      name: (signupData.name || "").trim(),
      email: (signupData.email || "").trim().toLowerCase(),
      password: signupData.password,
      profilePic: signupData.profilePic,
    };

    try {
      await signup(sanitizedData).unwrap();

      navigate("/login", {
        state: {
          message: "Account created successfully! Please log in.",
        },
      });
    } catch {
      // RTK Query stores the error in the error state.
    }
  };

  return (
    <main
      className={`flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-10 transition-colors duration-200 sm:px-6 sm:py-16 ${
        dark ? "bg-[#171E30] text-[#EAF0FA]" : "bg-[#F7F9FC] text-[#202C50]"
      }`}
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Illustration & Welcome Text */}
          <div className="flex flex-col items-center text-center lg:col-span-6 lg:items-start lg:text-left">
            <h1
              className={`text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl ${mainText}`}
            >
              Create your <span className={accentText}>Nova</span>
              <span className={accentText}>.</span> account
            </h1>

            <p
              className={`mt-3 max-w-md text-sm leading-relaxed sm:text-base ${mutedText}`}
            >
              Join thousands of happy shoppers exploring top-rated electronics,
              fashion, and daily deals with fast door-step delivery.
            </p>

            {/* Animated Storyset Illustration */}
            <div className="my-3 flex w-full justify-center sm:my-6 lg:my-8 lg:justify-start">
              <StorysetSignupIllustration />
            </div>

            {/* Trust Highlights */}
            <div className="hidden items-center gap-6 text-xs font-semibold sm:flex">
              <div className={`flex items-center gap-1.5 ${mutedText}`}>
                <ShieldCheck size={16} className={accentText} />
                <span>Verified Buyer Protection</span>
              </div>

              <div className={`flex items-center gap-1.5 ${mutedText}`}>
                <Zap size={16} className={accentText} />
                <span>Instant Member Perks</span>
              </div>
            </div>
          </div>

          {/* Right Column: Signup Form Card */}
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

                  <span
                    className={`text-[10px] font-semibold italic ${mutedText}`}
                  >
                    Explore{" "}
                    <span className={`${accentText} font-bold`}>Store</span>
                  </span>
                </div>

                <h2
                  className={`mt-4 text-2xl font-bold tracking-tight ${mainText}`}
                >
                  Sign Up
                </h2>

                <p className={`mt-1 text-xs sm:text-sm ${mutedText}`}>
                  Create an account to begin shopping right away
                </p>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Profile picture  */}
                <div className="flex flex-col items-center gap-2 ">
                  <div className="h-20 w-20 border-2 border-dashed border-gray-300 rounded-full overflow-hidden flex items-center justify-center bg-gray-50 relative">

       {signupData.profilePic ? (
                    <img
                      src={signupData.profilePic}
                      alt="preview"
                      className="h-full w-full
     object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-500 font-medium">
                      Add Photo
                    </span>
                  )}
                  </div>
           
             
                  <input type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="text-xs text-gray-600 file:mr-2 file:py-1 file:px-3 file:rounded-md file:bg-gray-200 cursor-pointer"
                
                  />
                </div>


                {/* Full Name Input */}
                <div className="space-y-1.5">
                  <label
                    htmlFor="name"
                    className={`block text-xs font-semibold ${mainText}`}
                  >
                    Full Name
                  </label>

                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                      <User size={17} className={secondaryText} />
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
                      className={`w-full rounded-xl border py-2.5 pl-10 pr-3.5 text-sm shadow-sm outline-none transition-all ${inputStyle}`}
                    />
                  </div>
                </div>

                {/* Email Address Input */}
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
                      value={signupData.email}
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
                      value={signupData.password}
                      onChange={handleChange}
                      autoComplete="new-password"
                      placeholder="At least 6 characters"
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
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
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
                  <span>{isLoading ? "Creating account..." : "Sign Up"}</span>

                  {!isLoading && <ArrowRight size={16} />}
                </button>
              </form>

              {/* Login Redirect */}
              <div
                className={`mt-6 border-t pt-5 text-center text-xs ${
                  dark
                    ? "border-[#35435C] text-[#8190AA]"
                    : "border-[#D8E1EF] text-[#64718A]"
                }`}
              >
                Already have an account?{" "}
                <Link
                  to="/login"
                  className={`font-bold transition-colors hover:underline ${accentText}`}
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
