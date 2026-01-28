import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./ready";
import Providers from "@/components/Providers";
import { minikitConfig } from "@/minikit.config";

export async function generateMetadata(): Promise<Metadata> {
  const miniapp = minikitConfig.miniapp;

  return {
    title: miniapp.name,
    description: miniapp.description,
    other: {
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="robots" content="noindex" />
        <meta name="base:app_id" content="6977f1ce3a92926b661fd741" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
