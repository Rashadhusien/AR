import { Cairo } from "next/font/google";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin"],
});

export const metadata = {
  title: "AR requests",
  description: "made with ❤ by Rashad",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar">
      <body className={`${cairo.variable} antialiased`}>{children}</body>
    </html>
  );
}
