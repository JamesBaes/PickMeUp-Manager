"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import supabase from "@/utils/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validatePassword = (password: string) => {
    const minLength = 10;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    if (password.length < minLength) {
      return `Password must be at least ${minLength} characters.`;
    }
    if (!hasUpper) {
      return "Password must contain at least one uppercase letter.";
    }
    if (!hasLower) {
      return "Password must contain at least one lowercase letter.";
    }
    if (!hasNumber) {
      return "Password must contain at least one number.";
    }
    if (!hasSpecial) {
      return "Password must contain at least one special character.";
    }
    return null;
  };

  const onSetPassword = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (updateError) {
      setError(updateError.message || "Failed to reset password.");
      setLoading(false);
      return;
    }

    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-10 rounded-2xl shadow-md">
        <div className="flex justify-center mb-8">
          <Image src="/circle-logo.png" alt="Circle Logo" width={108} height={108} />
        </div>
        <h1 className="text-2xl font-heading font-bold text-center mb-2">
          Reset Your Password
        </h1>
        <p className="text-center text-sm text-gray-500 font-body mb-6">
          Enter a new password for your account.
        </p>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-4 mb-4 rounded font-body text-center">
            {error}
          </div>
        )}
        <form onSubmit={onSetPassword} className="space-y-6">
          <div>
            <label htmlFor="password" className="block font-heading font-medium text-xl mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-white w-full p-4 rounded-xl border-gray-100 border text-gray font-body"
              placeholder="Password123"
              disabled={loading}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block font-heading font-medium text-xl mb-2">
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="bg-white w-full p-4 rounded-xl border-gray-100 border text-gray font-body"
              placeholder="Password123"
              disabled={loading}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-[#850911] disabled:opacity-50 disabled:cursor-not-allowed font-heading text-white font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? "Setting password..." : "Set Password"}
          </button>
        </form>
      </div>
    </div>
  );
}