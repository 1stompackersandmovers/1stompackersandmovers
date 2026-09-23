import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Lock,
  User,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Mail,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  KeyRound,
} from "lucide-react";
import { useAuth } from "../../../../store/AuthContext";
import { companyConfig } from "../../../../configs/company.config";
import {
  useResendLogin2FAOtpMutation,
  useForgotPasswordRequestOtpMutation,
  useForgotPasswordResetMutation,
} from "../../../../store/apiSlices/authApiSlice";

const Login = () => {
  // Modes: "credentials" | "2fa" | "forgot_request" | "forgot_reset"
  const [mode, setMode] = useState("credentials");

  // Credentials State
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 2FA State
  const [challengeToken, setChallengeToken] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [maskedEmail, setMaskedEmail] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  // Forgot Password State
  const [forgotIdentifier, setForgotIdentifier] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);

  // General State
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, verify2FA } = useAuth();
  const navigate = useNavigate();

  const [resendOtp] = useResendLogin2FAOtpMutation();
  const [requestResetOtp] = useForgotPasswordRequestOtpMutation();
  const [resetPassword] = useForgotPasswordResetMutation();

  // Resend OTP Cooldown Timer
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Step 1: Submit Credentials
  const handleCredentialSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await login(username, password);
      if (res.require2FA) {
        setChallengeToken(res.challengeToken);
        setMaskedEmail(res.emailMasked);
        setOtpCode("");
        setMode("2fa");
        setResendCooldown(60);
      } else {
        navigate("/leads");
      }
    } catch (err) {
      setError(err.data?.error || err.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Submit 2FA OTP Code
  const handle2FASubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await verify2FA(challengeToken, otpCode);
      navigate("/leads");
    } catch (err) {
      setError(err.data?.error || err.message || "Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resend 2FA OTP
  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError("");
    setLoading(true);

    try {
      const res = await resendOtp({ challengeToken }).unwrap();
      setSuccessMessage(res.message || "A fresh OTP code has been sent to your email.");
      setResendCooldown(60);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setError(err.data?.error || err.message || "Failed to resend OTP code.");
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password: Step 1 (Request OTP)
  const handleForgotRequestSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const res = await requestResetOtp({
        identifier: forgotIdentifier,
      }).unwrap();
      setResetToken(res.resetToken);
      setMaskedEmail(res.emailMasked);
      setResetOtp("");
      setMode("forgot_reset");
      setSuccessMessage(`Reset code sent to ${res.emailMasked}`);
      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (err) {
      setError(err.data?.error || err.message || "Failed to request password reset code.");
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password: Step 2 (Reset Password)
  const handleForgotResetSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword({
        resetToken,
        otp: resetOtp,
        newPassword,
      }).unwrap();
      setSuccessMessage(res.message || "Password updated successfully! Please sign in.");
      setPassword(newPassword);
      setMode("credentials");
    } catch (err) {
      setError(err.data?.error || err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <img
              src={companyConfig.logo.primary}
              alt={companyConfig.name}
              className="h-16 w-auto object-contain"
            />
          </div>
          <h2 className="text-lg font-bold text-slate-900 tracking-tight">
            {companyConfig.name}
          </h2>
          <p className="text-xs text-slate-500 font-medium">Logistics & Operations Management OS</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl flex items-start gap-2">
            <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* MODE 1: Standard Username & Password */}
        {mode === "credentials" && (
          <form onSubmit={handleCredentialSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setSuccessMessage("");
                    setForgotIdentifier(username);
                    setMode("forgot_request");
                  }}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
              <span>{loading ? "Signing in..." : "Sign In"}</span>
            </button>
          </form>
        )}

        {/* MODE 2: 2FA Email OTP Verification */}
        {mode === "2fa" && (
          <form onSubmit={handle2FASubmit} className="space-y-4">
            <div className="text-center space-y-1 bg-blue-50/60 border border-blue-100 p-3.5 rounded-xl">
              <div className="inline-flex p-2 bg-blue-100 text-blue-700 rounded-full mb-1">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Two-Factor Authentication</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                A 6-digit verification code has been sent to{" "}
                <span className="font-semibold text-slate-900">{maskedEmail}</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1 text-center">
                Enter 6-Digit Code
              </label>
              <input
                type="text"
                required
                maxLength={6}
                autoFocus
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-center text-xl font-mono tracking-[0.4em] font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || otpCode.length !== 6}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
              <span>{loading ? "Verifying..." : "Verify & Sign In"}</span>
            </button>

            <div className="flex items-center justify-between text-xs pt-1">
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setMode("credentials");
                }}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                type="button"
                disabled={resendCooldown > 0 || loading}
                onClick={handleResendOtp}
                className="text-blue-600 hover:text-blue-700 font-semibold disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
              </button>
            </div>
          </form>
        )}

        {/* MODE 3: Forgot Password - Request OTP */}
        {mode === "forgot_request" && (
          <form onSubmit={handleForgotRequestSubmit} className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span>Reset Administrator Password</span>
              </h3>
              <p className="text-xs text-slate-500">
                Enter your admin username or email address. We'll send a 6-digit verification code to your email.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Username or Registered Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={forgotIdentifier}
                  onChange={(e) => setForgotIdentifier(e.target.value)}
                  placeholder="admin or user@domain.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
              <span>{loading ? "Sending OTP..." : "Send Reset Code"}</span>
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setMode("credentials");
                }}
                className="text-xs text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Sign In</span>
              </button>
            </div>
          </form>
        )}

        {/* MODE 4: Forgot Password - Verify OTP & Set New Password */}
        {mode === "forgot_reset" && (
          <form onSubmit={handleForgotResetSubmit} className="space-y-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">Enter OTP & New Password</h3>
              <p className="text-xs text-slate-500">
                Check code sent to <span className="font-semibold text-slate-800">{maskedEmail}</span>
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                6-Digit Reset OTP
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={resetOtp}
                onChange={(e) => setResetOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full py-2 bg-slate-50 border border-slate-300 rounded-xl text-center text-lg font-mono tracking-widest font-bold focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Password (min 6 characters)
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New password"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm New Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || resetOtp.length !== 6 || !newPassword}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-xs transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer flex items-center justify-center gap-2"
            >
              {loading && <RefreshCw className="w-4 h-4 animate-spin" />}
              <span>{loading ? "Updating Password..." : "Update Password & Sign In"}</span>
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  setError("");
                  setMode("credentials");
                }}
                className="text-xs text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
