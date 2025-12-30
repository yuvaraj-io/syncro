"use client";

import { useState } from "react";
import { sendOTP } from "@/lib/auth-client";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState<any>(null);

  const handleSendOTP = async () => {
    const res = await sendOTP(phone);
    setConfirmation(res);
  };

  const verifyOTP = async () => {
    const result = await confirmation.confirm(otp);
    const token = await result.user.getIdToken();

    await fetch("/api/auth/session", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  };

  return (
    <>
      <input
        placeholder="+91XXXXXXXXXX"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />

      <button onClick={handleSendOTP}>Send OTP</button>

      {confirmation && (
        <>
          <input
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={verifyOTP}>Verify</button>
        </>
      )}

      <div id="recaptcha-container" />
    </>
  );
}
