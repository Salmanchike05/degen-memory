const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: "",
  },
  miniapp: {
    version: "1",
    name: "Degen Memory",
    subtitle: "Test your memory with crypto tokens",
    description:
      "A fun memory matching game featuring popular crypto tokens. Match pairs of tokens to win!",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/icon.png`,
    splashImageUrl: `${ROOT_URL}/splash.png`,
    splashBackgroundColor: "#000000",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "games",
    tags: ["memory", "games", "crypto", "tokens", "puzzle"],
    heroImageUrl: `${ROOT_URL}/hero.png`,
    tagline: "Match crypto tokens and test your memory!",
    ogTitle: "Degen Memory - Crypto Token Memory Game",
    ogDescription: "Test your memory with popular crypto tokens in this fun matching game",
    ogImageUrl: `${ROOT_URL}/og-image.png`,
  },
} as const;
