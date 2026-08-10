"use client";

import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

const inputBase =
  "w-full pl-12 pr-4 py-3 text-sm text-text-dark border border-gray-200 focus:border-primary-gold focus:ring-1 focus:ring-primary-gold outline-none transition-colors placeholder:text-gray-400 disabled:bg-gray-100";

const iconBox =
  "absolute left-0 top-0 h-full w-11 grid place-items-center border-r border-gray-200 text-gray-400 pointer-events-none";

interface FieldProps {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  disabled?: boolean;
  maxLength?: number;
  inputMode?: "text" | "numeric" | "tel" | "email";
}

export function AuthField({
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
  autoComplete,
  required = true,
  disabled,
  maxLength,
  inputMode,
}: FieldProps) {
  const isPassword = type === "password";
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <span className={iconBox}>{icon}</span>
      <input
        type={isPassword && show ? "text" : type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={inputBase}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        maxLength={maxLength}
        inputMode={inputMode}
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary-gold transition-colors"
        >
          {show ? <FiEyeOff size={16} /> : <FiEye size={16} />}
        </button>
      )}
    </div>
  );
}

export function AuthButton({
  loading,
  label,
}: {
  loading: boolean;
  label: string;
}) {
  return (
    <div className="flex justify-center pt-1">
      <button
        type="submit"
        disabled={loading}
        className="w-44 bg-primary-gold py-3 text-sm font-semibold text-white hover:bg-highlight disabled:opacity-50 transition-colors"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-b-2 border-white" />
            Processing...
          </span>
        ) : (
          label
        )}
      </button>
    </div>
  );
}

export function AuthError({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="mb-4 border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-600">
      {message}
    </div>
  );
}
