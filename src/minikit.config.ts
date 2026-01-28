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
    header: "eyJmaWQiOjM3ODIyOCwidHlwZSI6ImN1c3RvZHkiLCJrZXkiOiIweDQwNkRmMjBmNjMzMDFCOTZkZDQ0ZTI3Qzg1YmRFMTFEYTkxMzBDMjAifQ",
    payload: "eyJkb21haW4iOiJkZWdlbi1tZW1vcnkudmVyY2VsLmFwcCJ9",
    signature: "J/o8ATlFx9fIKj9MuKxtsRKcVsW/tEcTtYI1x8XzpaIJu9Di7PyjyQqwnlk9hg1yanahAgmHfHjErF7OsxAdHRs=",
  },
  miniapp: {
    version: "1",
    name: "Degen Memory",
    subtitle: "Match crypto tokens",
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
    tagline: "Match tokens to win!",
    ogTitle: "Degen Memory Game",
    ogDescription: "Test your memory with popular crypto tokens in this fun matching game",
    ogImageUrl: `${ROOT_URL}/og-image.png`,
    noindex: true,
  },
} as const;
