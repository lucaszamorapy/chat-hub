import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/auth-provider";
import ProtecaoRota from "./components/protecao-rota";
import { cookies } from "next/headers";
import { Toaster } from "sonner";
import { ConversasProvider } from "./contexts/conversas-provider";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChatHub",
  description: "Chat Online",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <AuthProvider>
          <ConversasProvider>
            <ProtecaoRota token={token}>{children}</ProtecaoRota>
          </ConversasProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
