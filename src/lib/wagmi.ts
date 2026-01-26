import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { baseAccount } from "wagmi/connectors";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";

const ROOT_URL =
  process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

// Создаем конфиг только на клиенте
let config: ReturnType<typeof createConfig> | null = null;

export function getConfig() {
  if (typeof window === "undefined") {
    // На сервере возвращаем минимальный конфиг
    return createConfig({
      chains: [base],
      transports: {
        [base.id]: http(),
      },
      connectors: [],
    });
  }

  // На клиенте создаем полный конфиг
  if (!config) {
    config = createConfig({
      chains: [base],
      transports: {
        [base.id]: http(),
      },
      connectors: [
        farcasterMiniApp(),
        baseAccount({
          appName: "Degen Memory",
          appLogoUrl: `${ROOT_URL}/icon.png`,
        }),
      ],
    });
  }

  return config;
}
