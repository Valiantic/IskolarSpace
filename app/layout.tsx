import type { Metadata } from "next";
import QueryProvider from "./providers/QueryProvider";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from 'react-hot-toast';
import { SITE_URL } from "./constants/site";
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

const description = "IskolarSpace is an AI-powered task manager for students. Plan coursework, prioritize deadlines on a Kanban board, and collaborate in shared spaces.";
const socialDescription = "Plan. Prioritize. Collaborate. Organize your student life and collaborate with your peers.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "IskolarSpace | AI Task Manager and Study Planner for Students",
    template: "%s | IskolarSpace",
  },
  description,
  keywords: "task management, productivity, collaboration, iskolarspace, student, education, teamwork, organize, prioritize, task app",
  authors: [{ name: "IskolarSpace Team" }],
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
  icons: { icon: "/svgs/iskolarspace_logo.svg" },
  openGraph: {
    title: "IskolarSpace",
    description: socialDescription,
    type: "website",
    images: ["/images/iskolarspace_logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "IskolarSpace",
    description: socialDescription,
    images: ["/images/iskolarspace_logo.png"],
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "IskolarSpace",
      url: SITE_URL,
      logo: `${SITE_URL}/images/iskolarspace_logo.png`,
      sameAs: [
        "https://www.instagram.com/stevemadali/",
        "https://github.com/Valiantic",
        "https://www.linkedin.com/in/steven-madali/",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "IskolarSpace",
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
    {
      "@type": "WebApplication",
      name: "IskolarSpace",
      url: SITE_URL,
      description,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      publisher: { "@id": `${SITE_URL}/#organization` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
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
