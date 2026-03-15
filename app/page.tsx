import LoginForm from "@/components/LoginForm";

export default function Page() {
  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg p-12 rounded-2xl bg-white shadow-lg">
        <LoginForm forgotPasswordLink="/forgot-password" />
      </div>
    </div>
  );
}