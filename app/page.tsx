import Image from "next/image";
import LoginForm from "@/components/LoginForm";

export default function Page() {
  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <div className="relative w-3/5">
        <Image src="/burger-login.png" alt="Burger" fill className="object-cover" priority />
      </div>
      
      <div className="w-2/5 bg-lightbg flex items-center justify-center">
        <div className="w-full px-12">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}