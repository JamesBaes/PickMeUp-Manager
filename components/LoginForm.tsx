"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions";

export default function LoginForm() {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (formData: FormData) => {
    setError(null);
    setLoading(true);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await login(email, password);

    if (result?.error) {
      setError(result.error);
    } else if (result?.redirectTo) {
      router.push(result.redirectTo);
    }
    setLoading(false);
  };

  return (
    <div className="w-full">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <Image
          src="/circle-logo.png"
          alt="Circle Logo"
          width={108}
          height={108}
        />
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-4 mb-4 rounded font-body text-center">
          {error}
        </div>
      )}

      <form action={handleLogin} className="space-y-6 w-full">
        {/* Email */}
        <div>
          <label htmlFor="email" className="block font-heading font-medium text-xl mb-2">
            Email
          </label>
          <input
            id="email"
            name="email"
            className="bg-white w-full p-4 rounded-xl border-gray-100 border text-gray font-body"
            type="email"
            placeholder="GladiatorStaff@example.com"
            disabled={loading}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block font-heading font-medium text-xl mb-2">
            Password
          </label>
          <input
            id="password"
            name="password"
            className="bg-white w-full p-4 rounded-xl border-gray-100 border text-gray font-body"
            type="password"
            placeholder="Password123"
            disabled={loading}
            required
          />
        </div>

        {/* Forgot Password */}
        <div className="text-right font-body">
          <a href="#" className="text-sm text-accent hover:text-[#850911]">
            Forgot password?
          </a>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-accent hover:bg-[#850911] disabled:opacity-50 disabled:cursor-not-allowed font-heading text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}