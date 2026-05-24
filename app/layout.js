import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import LayoutShell from "@/components/LayoutShell";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-primary",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

export const metadata = {
  title: {
    default: "Sasmika Mobiles — Premium Accessories & Custom Gifts",
    template: "%s — Sasmika Mobiles",
  },
  description: "Browse premium mobile accessories, chargers, designer backcases, earbuds, headsets, and order beautiful custom gift printing services - photo frames, mug printing, soft pillows.",
  keywords: ["Sasmika Mobiles", "mobile accessories", "custom photo frames", "mug printing", "phone cover printing", "pillows printing", "Fast chargers", "earbuds"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="antialiased bg-[var(--dark-900)] text-[var(--white-90)] min-h-screen transition-colors duration-300">
        <ThemeProvider>
          <LayoutShell>{children}</LayoutShell>
        </ThemeProvider>
      </body>
    </html>
  );
}
