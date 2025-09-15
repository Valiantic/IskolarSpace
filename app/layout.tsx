import type { Metadata } from "next";
import QueryProvider from "./providers/QueryProvider";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from 'react-hot-toast';
import "./globals.css";
import 'aos/dist/aos.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "IskolarSpace",
  description: "Plan. Prioritize. Collaborate.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/svgs/iskolarspace_logo.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* SEO Meta Tags */}
        <meta name="keywords" content="task management, productivity, collaboration, iskolarspace, student, education, teamwork, organize, prioritize, task app" />
        <meta name="author" content="IskolarSpace Team" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="canonical" href="https://iskolarspace.com/" />
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="IskolarSpace" />
        <meta property="og:description" content="Plan. Prioritize. Collaborate. Organize your student life and collaborate with your peers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://iskolarspace.com/" />
        <meta property="og:image" content="https://iskolarspace.com/images/iskolarspace_logo.png" />
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="IskolarSpace" />
        <meta name="twitter:description" content="Plan. Prioritize. Collaborate. Organize your student life and collaborate with your peers." />
        <meta name="twitter:image" content="https://iskolarspace.com/images/iskolarspace_logo.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable}`}>
        <QueryProvider>{children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(15, 23, 42, 0.95)',
              color: '#fff',
              border: '1px solid rgba(34, 211, 238, 0.3)',
              backdropFilter: 'blur(10px)',
            },
            success: {
              iconTheme: {
                primary: '#22d3ee',
                secondary: '#0f172a',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#0f172a',
              },
            },
          }}
        />
        <Analytics />
        </QueryProvider>
      </body>
    </html>
  );
}
