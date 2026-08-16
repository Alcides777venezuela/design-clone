import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Enlace biográfico | Diseña un enlace biográfico en cuestión de segundos | Design.com",
  description: "Crea tu propio enlace en la biografía en segundos. Explora miles de plantillas atractivas.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}