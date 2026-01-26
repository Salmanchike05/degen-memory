import { createConfig, http } from "wagmi";
import { base } from "wagmi/chains";
import { baseAccount } from "wagmi/connectors";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";

const ROOT_URL =
  process.env.NEXT_PUBLIC_URL || "http://localhost:3000";

// Минимальный конфиг для SSR (без connectors)
const ssrConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [],
});

// Полный конфиг для клиента (создается только на клиенте)
let clientConfig: ReturnType<typeof createConfig> | null = null;

function createClientConfig() {
  if (typeof window === "undefined") {
    return ssrConfig;
  }

  if (!clientConfig) {
    try {
      clientConfig = createConfig({
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
    } catch (error) {
      console.error("Error creating wagmi config:", error);
      return ssrConfig;
    }
  }

  return clientConfig;
}

export function getConfig() {
  return createClientConfig();
}
