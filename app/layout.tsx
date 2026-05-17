import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TestForge Pro — AI-Assisted Test Generation",
  description:
    "AI-assisted workflow: scan a GitHub repo, generate Jest tests with Gemini, open a real PR. Built for IBM Bob Hackathon 2026.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}