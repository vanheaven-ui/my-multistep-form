import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "../components/layout/Footer";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Multi-Step Form Starter",
  description: "Next.js Multi-Step Form Template",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <main className="flex-1">{children}</main>
        <Footer
          companyName="My Client Company"
          year={new Date().getFullYear()}
          links={[
            {
              label: "GitHub",
              href: "https://github.com/yourusername/my-multistep-form",
              external: true,
            },
            { label: "Docs", href: "/docs" },
          ]}
        />
      </body>
    </html>
  );
}
