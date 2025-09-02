import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ReactHotToast from "./components/providers/ReactHotToast";
import AuthSessionProvider from "./components/providers/AuthSessionProvider";
import ActiveStatus from "./components/ActiveStatus";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Real-Time Chat App",
  description: "A real-time chat application built with Next.js and Pusher.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthSessionProvider>
          <ReactHotToast />
          <ActiveStatus />
          {children}
        </AuthSessionProvider>
      </body>
    </html>
  );
}
