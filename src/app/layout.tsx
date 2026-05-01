import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { FinanceProvider } from "@/context/FinanceContext";
import { cn } from "@/utils/helpers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finova - High End Financial Dashboard",
  description: "Modern, minimalist, and clean UI financial budgeting web application MVP.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "font-sans")}>
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen selection:bg-emerald-500/30`}>
        <FinanceProvider>
          <div className="flex">
            <Navbar />
            <main className="flex-1 ml-20 md:ml-64 p-6 lg:p-10 transition-all duration-300">
              {children}
            </main>
          </div>
        </FinanceProvider>
      </body>
    </html>
  );
}
