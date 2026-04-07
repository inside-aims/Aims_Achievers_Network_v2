import type { Metadata } from "next";
import "./globals.css";

import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import { ThemeProvider } from "@/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/query-provider";
import { ConvexClientProvider } from "@/providers/convex-auth-provider";

export const metadata: Metadata = {
  title: {
    template: "%s | AIMS Achievers Network",
    default: "AIMS Achievers Network - Seamless Voting, Ticketing & Nominations"
  },
  description: "Fostering excellence through meaningful partnerships and unforgettable campus experiences across Ghanaian institutions. Your platform for seamless voting, ticketing, and event nominations.",
  keywords: ["AIMS", "Achievers Network", "Ghana Campus Events", "Voting", "Ticketing", "Nominations", "Student Awards"],
  authors: [{ name: "AIMS Achievers Network" }],
  openGraph: {
    title: "AIMS Achievers Network",
    description: "Fostering excellence through meaningful partnerships and unforgettable campus experiences across Ghanaian institutions.",
    url: "https://aimsachievers.network",
    siteName: "AIMS Achievers Network",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AIMS Achievers Network Open Graph Cover"
      }
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AIMS Achievers Network",
    description: "Your platform for seamless voting, ticketing, and event nominations.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased">
          <ConvexClientProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <QueryProvider>
                {children}
                <Toaster position={"top-center"} richColors />
              </QueryProvider>
            </ThemeProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}