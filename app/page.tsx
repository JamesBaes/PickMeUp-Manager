import LoginForm from "@/components/LoginForm";

export default function Page() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100 overflow-hidden">
      <div className="w-2/7 min-w-100 p-12 rounded-xl bg-white shadow-lg flex items-center justify-center">
        <LoginForm forgotPasswordLink="/forgot-password" />
      </div>
    </div>
  );
}