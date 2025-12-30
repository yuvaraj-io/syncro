"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendOTP } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async () => {
    try {
      setError("");
      setLoading(true);

      const res = await sendOTP(phone);
      setConfirmation(res);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setError("");
      setLoading(true);

      const result = await confirmation.confirm(otp);
      const token = await result.user.getIdToken();

      await fetch("/api/auth/session", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // store it in cookie //

      // ✅ Next.js navigation
      router.replace("/");
    } catch (err) {
      console.error(err);
      setError("Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-semibold text-center mb-6">
          Login
        </h1>

        {/* Phone input */}
        {!confirmation && (
          <>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="7201234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4"
            />

            <div id="recaptcha-container" className="mt-4" ></div>
            <button
              onClick={handleSendOTP}
              disabled={loading || phone.length < 10}
              className="w-full bg-black text-white py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {/* OTP input */}
        {confirmation && (
          <>
            <label className="block text-sm font-medium mb-1 mt-4">
              Enter OTP
            </label>
            <input
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 mb-4"
            />
            <div id="recaptcha-container" className="mt-4" ></div>
            <button
              onClick={handleVerifyOTP}
              disabled={loading || otp.length < 6}
              className="w-full bg-black text-white py-2 rounded-lg disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {error && (
          <p className="text-red-500 text-sm mt-4 text-center">
            {error}
          </p>
        )}
       
      </div>
    </main>
  );
}
