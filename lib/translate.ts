// lib/translate.ts
type Lang = "en" | "bn";

const messages: Record<string, Record<Lang, string>> = {
  MISSING_FIELDS: {
    en: "Please fill in all required fields",
    bn: "সব ফিল্ড পূরণ করুন",
  },
  PASSWORDS_MISMATCH: {
    en: "Passwords do not match",
    bn: "পাসওয়ার্ড মিলছে না",
  },
  WEAK_PASSWORD: {
    en: "Password must be at least 6 characters",
    bn: "পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে",
  },
  INVALID_MOBILE: {
    en: "Please enter a valid mobile number",
    bn: "সঠিক মোবাইল নম্বর দিন",
  },
  EMAIL_EXISTS: {
    en: "An account with this email already exists",
    bn: "এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট আছে",
  },
  INVALID_CREDENTIALS: {
    en: "Invalid email or password",
    bn: "ভুল ইমেইল বা পাসওয়ার্ড",
  },
  NO_PASSWORD_SET: {
    en: "No password set for this account. Please reset your password.",
    bn: "এই অ্যাকাউন্টে পাসওয়ার্ড সেট নেই, রিসেট করুন",
  },
  ACCOUNT_SUSPENDED: {
    en: "Your account has been suspended. Please contact support.",
    bn: "আপনার অ্যাকাউন্ট বন্ধ করা হয়েছে, সাপোর্টে যোগাযোগ করুন",
  },
  NOT_AUTHENTICATED: {
    en: "You are not logged in",
    bn: "আপনি লগইন করেননি",
  },
  USER_NOT_FOUND: {
    en: "User not found",
    bn: "ইউজার পাওয়া যায়নি",
  },
  SERVER_ERROR: {
    en: "Something went wrong. Please try again.",
    bn: "একটি সমস্যা হয়েছে, আবার চেষ্টা করুন",
  },
  REGISTER_SUCCESS: {
    en: "Registration successful",
    bn: "রেজিস্ট্রেশন সফল হয়েছে",
  },
  LOGIN_SUCCESS: {
    en: "Login successful",
    bn: "লগইন সফল হয়েছে",
  },
  LOGOUT_SUCCESS: {
    en: "Logout successful",
    bn: "লগআউট সফল হয়েছে",
  },
};

export function t(code: string, lang: Lang = "en"): string {
  return messages[code]?.[lang] ?? code;
}
