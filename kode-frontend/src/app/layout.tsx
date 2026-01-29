import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "./providers";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";
import { Toaster } from "@/components/ui/sonner";
import { CartSync } from "@/features/cart/CartSync";
import { AuthModal } from "@/features/auth/components/auth-modal";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KODE | Decode your Style",
  description: "Decode your Style. E-commerce de ropa KODE con actitud y diseño minimalista premium.",
};

import { auth } from "@/lib/auth";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="es" suppressHydrationWarning className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black text-white min-h-screen flex flex-col`}
      >
        <Providers session={session}>
          <CartSync />
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <Toaster position="bottom-right" theme="dark" />
          <AuthModal />
        </Providers>
      </body>
    </html>
  );
}
