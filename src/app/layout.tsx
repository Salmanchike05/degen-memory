import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./ready";
import Providers from "@/components/Providers";
import { minikitConfig } from "@/minikit.config";

const BASE_APP_ID = "6977f1ce3a92926b661fd741";

export async function generateMetadata(): Promise<Metadata> {
  const miniapp = minikitConfig.miniapp;

  return {
    title: miniapp.name,
    description: miniapp.description,
    other: {
      "base:app_id": BASE_APP_ID,
      "fc:miniapp": JSON.stringify({
        version: "next",
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
}

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
