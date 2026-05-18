import type { Metadata } from "next";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import { Toast } from "@/components/shared/Toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

export const metadata: Metadata = {
  title: "FinCalc Pro — Financial Calculator Suite",
  description: "Premium financial calculator suite — SIP, EMI, FD, CAGR, retirement planning, tax savings, loan vs invest.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        <meta name="theme-color" content="#0D0D14" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <TooltipProvider delayDuration={200}>
            {children}
            <Toast />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
