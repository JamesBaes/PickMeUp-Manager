"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { login } from "@/app/actions/login";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginForm({
  forgotPasswordLink,
}: {
  forgotPasswordLink: string;
}) {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (formData: FormData) => {
    setError(null);
    setLoading(true);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await login(email, password);

      if (result?.error) {
        setError(result.error);
      } else if (result?.redirectTo) {
        router.replace(result.redirectTo);
      }
    } catch (err) {
      console.log("Unexpected error during login:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {/* Logo */}
      <div className="flex justify-center mb-8 flex-col items-center gap-3">
        <Image
          src="/circle-logo.png"
          alt="Circle Logo"
          width={108}
          height={108}
          className="w-20 h-20 sm:w-27 sm:h-27"
        />
        <h1 className="font-body text-gray-700 font-semibold text-2xl sm:text-3xl text-center">
          Restaurant Manager
        </h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mb-4 rounded font-body text-center text-sm">
          {error}
        </div>
      )}

      <form action={handleLogin} className="space-y-5 w-full">
        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block font-heading font-medium text-base sm:text-xl text-gray-700 mb-2"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            className="bg-white w-full p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-gray-300 focus:border-blue-300 focus:outline-none text-gray font-body transition-colors"
            type="email"
            placeholder="GladiatorStaff@example.com"
            disabled={loading}
            required
          />
        </div>

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block font-heading font-medium text-gray-700 text-base sm:text-xl mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              className="bg-white w-full p-3 sm:p-4 rounded-xl border border-gray-200 hover:border-gray-300 focus:border-blue-300 focus:outline-none text-gray font-body pr-12 transition-colors"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              disabled={loading}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="text-right font-body">
          <Link
            href={forgotPasswordLink}
            className="text-sm underline text-[#0074BF] hover:text-[#026cb3]"
          >
            Forgot password?
          </Link>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full cursor-pointer bg-[#0074BF] hover:bg-[#05609c] disabled:opacity-50 disabled:cursor-not-allowed font-heading text-white font-semibold py-3 rounded-lg transition-colors"
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
    </div>
  );
}
