import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { UseGlob } from "../../Context/GlobalContext";
import { useChangePasswordMutation } from "../../services/productsApi";
import {
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
} from "lucide-react";

const ResetPassword = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const { dark } = UseGlob();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  // Theme colors consistent with Login & Signup
  const mainText = dark ? "text-[#EAF0FA]" : "text-[#202C50]";
  const mutedText = dark ? "text-[#AAB8D0]" : "text-[#64718A]";
  const accentText = dark ? "text-[#7895C5]" : "text-[#344F82]";

  const inputStyle = dark
    ? "border-[#465570] bg-[#171E30] text-[#EAF0FA] placeholder-[#8190AA] focus:border-[#7895C5] focus:ring-1 focus:ring-[#7895C5]"
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

  const successBanner = dark
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
    : "border-emerald-200 bg-emerald-50 text-emerald-700";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      await changePassword({ id, token, password }).unwrap();
      setSuccess(true);
      setTimeout(() => {
        navigate("/login", {
          state: {
            message:
              "Password reset successfully! Please log in with your new password.",
          },
        });
      }, 1500);
    } catch (err) {
      setError(
        err?.data?.message ||
          "This reset link is invalid or has expired. Please request a new link."
      );
    }
  };

  return (
    <main
      className={`flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-10 transition-colors duration-200 sm:px-6 sm:py-16 ${
        dark ? "bg-[#171E30] text-[#EAF0FA]" : "bg-[#F7F9FC] text-[#202C50]"
      }`}
    >
      <div className="w-full max-w-md">
        <div
          className={`rounded-2xl border p-6 shadow-xl transition-all sm:p-8 ${cardStyle}`}
        >
          {/* Header Icon */}
          <div className="mb-6 flex flex-col items-center text-center">
            <div
              className={`mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border shadow-sm ${
                dark
                  ? "border-[#35435C] bg-[#171E30] text-[#7895C5]"
                  : "border-[#D8E1EF] bg-[#F7F9FC] text-[#344F82]"
              }`}
            >
              <ShieldCheck size={28} />
            </div>

            <h1
              className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${mainText}`}
            >
              Reset Password
            </h1>
            <p className={`mt-2 text-xs sm:text-sm ${mutedText}`}>
              Create a strong new password for your Nova account.
            </p>
          </div>

          {/* Success Banner */}
          {success && (
            <div
              className={`mb-5 flex items-start gap-2.5 rounded-xl border p-3.5 text-xs font-medium leading-relaxed ${successBanner}`}
            >
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              <span>
                Password updated successfully! Redirecting you to login...
              </span>
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div
              className={`mb-5 flex items-start gap-2.5 rounded-xl border p-3.5 text-xs font-medium leading-relaxed ${errorBanner}`}
            >
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div>
              <label
                htmlFor="new-password"
                className={`mb-1.5 block text-xs font-semibold ${mutedText}`}
              >
                New Password
              </label>
              <div className="relative">
                <span
                  className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 ${
                    dark ? "text-[#8190AA]" : "text-[#8A96AA]"
                  }`}
                >
                  <Lock size={16} />
                </span>
                <input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  autoFocus
                  className={`w-full rounded-xl border py-2.5 pl-10 pr-10 text-sm transition-all focus:outline-none ${inputStyle}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className={`absolute inset-y-0 right-0 flex items-center pr-3.5 transition-colors ${
                    dark
                      ? "text-[#8190AA] hover:text-[#EAF0FA]"
                      : "text-[#8A96AA] hover:text-[#202C50]"
                  }`}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label
                htmlFor="confirm-password"
                className={`mb-1.5 block text-xs font-semibold ${mutedText}`}
              >
                Confirm New Password
              </label>
              <div className="relative">
                <span
                  className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 ${
                    dark ? "text-[#8190AA]" : "text-[#8A96AA]"
                  }`}
                >
                  <Lock size={16} />
                </span>
                <input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  required
                  className={`w-full rounded-xl border py-2.5 pl-10 pr-10 text-sm transition-all focus:outline-none ${inputStyle}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                  className={`absolute inset-y-0 right-0 flex items-center pr-3.5 transition-colors ${
                    dark
                      ? "text-[#8190AA] hover:text-[#EAF0FA]"
                      : "text-[#8A96AA] hover:text-[#202C50]"
                  }`}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold shadow-md transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${submitButton}`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Updating Password...</span>
                </>
              ) : (
                <>
                  <span>Update Password</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Links back */}
          <div className="mt-6 flex flex-col items-center gap-2 border-t pt-4 text-center">
            <Link
              to="/forgot-password"
              className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${mutedText} hover:underline`}
            >
              <span>Need a new reset link?</span>
            </Link>

            <Link
              to="/login"
              className={`inline-flex items-center gap-1.5 text-xs font-semibold transition-colors ${accentText} hover:underline`}
            >
              <ArrowLeft size={14} />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ResetPassword;
