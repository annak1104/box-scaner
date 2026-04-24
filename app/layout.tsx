import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Parcel Flow",
  description: "Mobile-first parcel management for branch staff.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
