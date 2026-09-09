import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "./LanguageProvider";

export const metadata: Metadata = {
  title: "KRIDAVIRASAT | Rediscover the Heritage of Indian Play",
  description:
    "KRIDAVIRASAT is an interactive Indian Knowledge System platform celebrating traditional Indian games, culture, heritage and language learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}