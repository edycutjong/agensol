import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Agensol | SNS AI Agent Identity Registry",
  description:
    "AI agent identity registry on Solana Name Service. Mint .sol passports for autonomous agents. Revoke via transfer.",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
  openGraph: {
    title: "Agensol — AI Agent Identity on SNS",
    description: "Verifiable on-chain identity for AI agents using .sol sub-domains",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Agensol | SNS AI Agent Identity Registry",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className="antialiased min-h-screen bg-brand-bg text-white"
        style={{
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}
