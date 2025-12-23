import type { Metadata } from "next";
import "./globals.css";

import { ThemeProvider } from "@/providers/theme-provider";
import {Toaster} from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "AIMS Achievers Network",
  description: "Seamless Voting · Ticketing · Nominations",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
         <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
           {children}
           <Toaster position={"top-center"} richColors />
         </ThemeProvider>
      </body>
    </html>
  );
}