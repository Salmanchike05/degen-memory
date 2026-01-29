import type { Metadata, Viewport } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import { minikitConfig } from "@/minikit.config";

const BASE_APP_ID = "697a8345a35c6ecde6aca552";
const miniapp = minikitConfig.miniapp;

// Статический metadata, как требует Base (в их примере показан именно статический export)
export const metadata: Metadata = {
  title: miniapp.name,
  description: miniapp.description,
  other: {
    "base:app_id": BASE_APP_ID,
    "fc:miniapp": JSON.stringify({
      version: "1",
      imageUrl: miniapp.heroImageUrl,
      button: {
        title: `Play ${miniapp.name}`,
        action: {
          type: "launch_frame",
          url: miniapp.homeUrl,
        },
      },
    }),
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Дублируем метатег явно в <head>, как просит Base */}
        <meta name="base:app_id" content={BASE_APP_ID} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
