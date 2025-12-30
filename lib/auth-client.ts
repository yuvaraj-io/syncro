"use client";

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/lib/firebase";

let recaptchaVerifier: RecaptchaVerifier | null = null;

export const sendOTP = async (phone: string) => {
  if (typeof window === "undefined") return;

  const fullPhone = phone.startsWith("+") ? phone : `+91${phone}`;

  if (!recaptchaVerifier) {
    recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      {
        size: "normal", // keep visible for now
      }
    );
  }

  return signInWithPhoneNumber(auth, fullPhone, recaptchaVerifier);
};
