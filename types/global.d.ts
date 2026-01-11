import { RecaptchaVerifier, ConfirmationResult } from "firebase/auth";

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
     dataLayer: Record<string, any>[];
  }
}

export {};