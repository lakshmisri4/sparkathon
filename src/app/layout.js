import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { FpjsProvider } from "@fingerprintjs/fingerprintjs-pro-react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Sparkathon",
  description: "A hackathon by walmart",
  icons: {
    icon: "https://i.pinimg.com/736x/f1/15/2e/f1152e348499a7c855852acf360c971f.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <FpjsProvider
          loadOptions={{
            apiKey: "3Wmy5tOyaQhhqH50vZhq",
            region: "ap",
          }}
        >
          {children}
        </FpjsProvider>
      </body>
    </html>
  );
}
