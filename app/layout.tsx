import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const text = DM_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "PickMeUp Manager",
  description: "Handle orders, inventory, and employees in a centralized application.",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${text.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
