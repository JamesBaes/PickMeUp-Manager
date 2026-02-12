import type { Metadata } from "next";
import { DM_Sans, Nunito } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const headingText = DM_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
});

const bodyText = Nunito({
  variable: "--font-body",
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
    <html lang="en">
      <AuthProvider>
        <body
          className={`${headingText.variable} ${bodyText.variable} antialiased`}
        >
          {children}
        </body>
      </AuthProvider>
    </html>
  );
}
