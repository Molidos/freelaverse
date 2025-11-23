import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Freelaverse",
  description: "Freelaverse é uma plataforma onde você pode encontrar o profissional perfeito para o seu negócio.",
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Freelaverse",
    description: "Freelaverse é uma plataforma onde você pode encontrar o profissional perfeito para o seu negócio.",
    url: "https://freelaverse.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
