import type { Metadata } from "next";
import { Archivo, Space_Mono } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import { Providers } from "@/components/providers";
import { APP_NAME } from "@/lib/constants";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: `${APP_NAME} — Finanzas personales`,
  description:
    "Controla tus tarjetas, compras a meses y proyección de ahorro con Nox Ledger.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ViewTransitions>
      <html lang="es" suppressHydrationWarning>
        <body className={`${archivo.variable} ${spaceMono.variable} antialiased`}>
          <Providers>{children}</Providers>
        </body>
      </html>
    </ViewTransitions>
  );
}
