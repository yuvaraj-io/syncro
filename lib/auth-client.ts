"use client";

import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

export const sendOTP = async (phone: string) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(
      auth,
      "recaptcha-container",
      { size: "invisible" }
    );
  }

  const confirmation = await signInWithPhoneNumber(
    auth,
    phone,
    window.recaptchaVerifier
  );

  return confirmation;
};
