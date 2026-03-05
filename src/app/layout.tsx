import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Расчёт ставок - Контейнерные перевозки Россия-Беларусь",
  description: "Калькулятор расчёта ставок на контейнерные автомобильные перевозки между Россией и Беларусью. Расчёт стоимости перевозки контейнеров 20DC, 40HC, 45HC.",
  keywords: ["контейнерные перевозки", "расчёт ставок", "логистика", "Россия", "Беларусь", "грузоперевозки", "контейнеры", "20DC", "40HC", "45HC"],
  authors: [{ name: "Raschet Stavok" }],
  icons: {
    icon: ["/favicon.png", "/truck-logo.png"],
  },
  openGraph: {
    title: "Расчёт ставок - Контейнерные перевозки",
    description: "Калькулятор расчёта ставок на контейнерные автомобильные перевозки",
    url: "https://raschet-stavok.vercel.app",
    siteName: "Расчёт ставок",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Расчёт ставок - Контейнерные перевозки",
    description: "Калькулятор расчёта ставок на контейнерные автомобильные перевозки",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
