import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Placeholder domain — no production domain is configured anywhere in this
// repo. Matches the placeholder used in src/app/sitemap.ts and robots.ts;
// swap all three for the real deployed domain together.
const BASE_URL = "https://quantumlearn.example";

const title = {
  default: "QuantumLearn — Learn Quantum Mechanics & Quantum Computing",
  template: "%s · QuantumLearn",
};
const description =
  "An interactive platform for learning quantum mechanics and quantum computing — lessons, simulators, and problem sets for advanced high-school and early-college students.";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title,
  description,
  openGraph: {
    title: title.default,
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: title.default,
    description,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-2 focus:left-2 focus:rounded-full focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-brand-foreground focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-background"
        >
          Skip to content
        </a>
        <Navbar />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
