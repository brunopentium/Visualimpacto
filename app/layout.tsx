import type { Metadata } from "next";
import "./globals.css";
import "./crm.css";
import "./clients.css";
import "./production.css";
import "./prospect-ai.css";
import "./finance.css";
import "./marketing.css";

export const metadata: Metadata = {
  title: "Visual Impacto — Admin",
  description: "Painel privado de operação da Visual Impacto.",
  robots: { index: false, follow: false },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">{children}</body>
    </html>
  );
}
