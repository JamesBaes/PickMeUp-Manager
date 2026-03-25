'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, EyeOff, Check, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import supabase from '@/utils/client'

const requirements = [
  { label: 'At least 10 characters', test: (pw: string) => pw.length >= 10 },
  { label: 'Uppercase letter', test: (pw: string) => /[A-Z]/.test(pw) },
  { label: 'Number', test: (pw: string) => /[0-9]/.test(pw) },
  { label: 'Special character', test: (pw: string) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
];

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace('/forgot-password');
      } else {
        setIsValidSession(true);
      }
    };
    checkSession();
  }, [router]);

  const allValid = requirements.every(r => r.test(newPassword));
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!allValid) {
      setError('Password does not meet all requirements.');
      setIsLoading(false);
      return;
    }
    if (!passwordsMatch) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      setError(updateError.message);
      setIsLoading(false);
      return;
    }

    await supabase.auth.signOut();
    setShowSuccess(true);
    setTimeout(() => {
      router.push("/");
    }, 2000);
  }

  if (!isValidSession) {
    return (
      <div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-gray-100">
        <div className="w-full max-w-lg p-12 rounded-2xl bg-white shadow-lg flex flex-col items-center">
          <p className="font-heading text-gray-700 font-medium text-2xl">Verifying session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center overflow-hidden bg-gray-100">
      <div className="w-full max-w-lg p-8 rounded-2xl bg-white shadow-lg">
        <div className="w-full">
          <div className="flex justify-center mb-6 flex-col items-center gap-4">
            <Image src="/circle-logo.png" alt="Circle Logo" width={108} height={108} />
            <h1 className="font-body text-gray-700 font-semibold text-3xl">Reset Password</h1>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 mb-4 rounded font-body text-center">
              {error}
            </div>
          )}

          {showSuccess ? (
            <div className="text-center space-y-4">
              <p className="font-body text-gray-600 text-lg">
                Password Successfully Updated.<br />
                Redirecting to login page...
              </p>
              <Link
                href="/"
                className="block text-sm underline text-brand-blue hover:text-brand-blue-link-hover font-body"
              >
                Click here if not redirected
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 w-full">
              <div>
                <label htmlFor="newPassword" className="block font-heading font-medium text-xl text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-white w-full p-4 rounded-xl border border-gray-200 pr-12 font-body transition-colors"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => setShowNewPassword(v => !v)}
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block font-heading font-medium text-xl text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                    disabled={isLoading}
                    className="bg-white w-full p-4 rounded-xl border border-gray-200 pr-12 font-body transition-colors"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                    onClick={() => setShowConfirmPassword(v => !v)}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                  </button>
                </div>
                {confirmPassword && (
                  <div className="mt-2 text-sm font-body text-right">
                    {passwordsMatch ? (
                      <span className="text-green-600 flex items-center gap-1"><Check size={16} /> Passwords match</span>
                    ) : (
                      <span className="text-red-600 flex items-center gap-1"><X size={16} /> Passwords do not match</span>
                    )}
                  </div>
                )}
              </div>
              <div className="mb-2">
                <ul className="font-body text-sm space-y-1">
                  {requirements.map(r => (
                    <li key={r.label} className="flex items-center gap-2">
                      {r.test(newPassword)
                        ? <Check size={16} className="text-green-600" />
                        : <X size={16} className="text-red-600" />}
                      <span className={r.test(newPassword) ? "text-green-700" : "text-gray-700"}>{r.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-right font-body">
                <Link href="/" className="text-sm underline text-brand-blue hover:text-brand-blue-link-hover">
                  Back to Login
                </Link>
              </div>
              <button
                type="submit"
                disabled={isLoading || !newPassword || !confirmPassword || !allValid || !passwordsMatch}
                className="w-full cursor-pointer bg-brand-blue hover:bg-brand-blue-hover disabled:opacity-50 disabled:cursor-not-allowed font-heading text-white font-semibold py-3 rounded-lg transition-colors"
              >
                {isLoading ? 'Updating...' : 'Reset Password'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ResetPassword