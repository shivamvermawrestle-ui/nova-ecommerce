import { useState } from "react";
import { Link } from "react-router-dom";
import { UseGlob } from "../../Context/GlobalContext";
import { useSendResetEmailMutation } from "../../services/productsApi";
import {
  Mail,
  KeyRound,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
} from "lucide-react";

const ForgotPassword = () => {
  const { dark } = UseGlob();
  const [email, setEmail] = useState("");
  const [sendEmail, { isLoading }] = useSendResetEmailMutation();
  const [message, setMessage] = useState("");
  const [resetLink, setResetLink] = useState("");
  const [error, setError] = useState("");

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
    setMessage("");
    setError("");
    setResetLink("");
    try {
      const res = await sendEmail({
        email: email.trim().toLowerCase(),
      }).unwrap();
      setMessage(
        res?.message ||
          "Password reset link generated! Please check below or your email inbox."
      );
      if (res?.resetLink) {
        setResetLink(res.resetLink);
      }
    } catch (err) {
      setError(
        err?.data?.message ||
          "Failed to send reset link. Please check your email address and try again."
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
              <KeyRound size={28} />
            </div>

            <h1
              className={`text-2xl font-extrabold tracking-tight sm:text-3xl ${mainText}`}
            >
              Forgot Password?
            </h1>
            <p className={`mt-2 text-xs sm:text-sm ${mutedText}`}>
              Enter your registered email address and we&apos;ll send you a
              secure link to reset your password.
            </p>
          </div>

          {/* Success Banner */}
          {message && (
            <div
              className={`mb-5 flex flex-col gap-2.5 rounded-xl border p-3.5 text-xs font-medium leading-relaxed ${successBanner}`}
            >
              <div className="flex items-start gap-2.5">
                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                <span>{message}</span>
              </div>

              {resetLink && (
                <div className="mt-1 flex flex-col gap-2 border-t border-emerald-500/20 pt-2.5">
                  <span className="text-[11px] font-semibold opacity-90">
                    Direct access to reset your password:
                  </span>
                  <a
                    href={resetLink}
                    className={`inline-flex items-center justify-center gap-1.5 rounded-lg py-2 px-3 text-xs font-bold shadow-sm transition-all duration-200 active:scale-[0.98] ${
                      dark
                        ? "bg-[#7895C5] text-[#171E30] hover:bg-[#9BB2D8]"
                        : "bg-[#202C50] text-white hover:bg-[#344F82]"
                    }`}
                  >
                    <span>Proceed to Reset Password</span>
                    <ArrowRight size={14} />
                  </a>
                </div>
              )}
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
            <div>
              <label
                htmlFor="forgot-email"
                className={`mb-1.5 block text-xs font-semibold ${mutedText}`}
              >
                Email Address
              </label>
              <div className="relative">
                <span
                  className={`pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 ${
                    dark ? "text-[#8190AA]" : "text-[#8A96AA]"
                  }`}
                >
                  <Mail size={16} />
                </span>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  autoFocus
                  className={`w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm transition-all focus:outline-none ${inputStyle}`}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold shadow-md transition-all active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${submitButton}`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Sending Reset Link...</span>
                </>
              ) : (
                <>
                  <span>Send Reset Link</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <div
            className={`mt-6 flex items-center justify-center gap-1.5 border-t pt-4 text-center text-[11px] ${
              dark
                ? "border-[#35435C] text-[#8190AA]"
                : "border-[#D8E1EF] text-[#8A96AA]"
            }`}
          >
            <ShieldCheck size={14} />
            <span>Encrypted &amp; secure password recovery</span>
          </div>

          {/* Back to Login */}
          <div className="mt-4 text-center">
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

export default ForgotPassword;
