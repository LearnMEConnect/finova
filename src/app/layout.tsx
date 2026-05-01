import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import TopBar from "@/components/layout/Navbar";
import { FinanceProvider } from "@/context/FinanceContext";
import { cn } from "@/utils/helpers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finova — Simple Budget Dashboard",
  description:
    "A clean, single-page personal finance dashboard. Track transactions, assets, liabilities, and net worth — all in one view.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("dark", "font-sans")}>
      <body
        className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen selection:bg-emerald-500/30`}
      >
        <FinanceProvider>
          <TopBar />
          <main className="px-4 sm:px-6 py-6 lg:py-10 transition-all duration-300">
            {children}
          </main>
        </FinanceProvider>
      </body>
    </html>
  );
}
