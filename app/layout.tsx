import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "audya amalia", template: "%s - audya amalia" },
  description: "Audya Amalia — visual artist based in Bandung, Indonesia.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@400;700;900&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
