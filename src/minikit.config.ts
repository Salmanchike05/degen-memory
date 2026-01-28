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
    header: "eyJmaWQiOi0xLCJ0eXBlIjoiYXV0aCIsImtleSI6IjB4NzBDRDNiQjBEMmJDMTQyZTMzOTI1NThENTlhODA3MGZGMDREOTM5YSJ9",
    payload: "eyJkb21haW4iOiJkZWdlbi1tZW1vcnkudmVyY2VsLmFwcCJ9",
    signature: "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABEOcxRv_SHNG3_H-wYUr_ATSjlUtrFBUqSvZ6dzo7pfVz4Qz74Wnho9aFa-F11MadJP5IOoIsL07KHQlX87jNMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAl8ZgIay2xclZzG8RWZzuWvO8j9R0fus3XxDee9lRlVy8dAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACKeyJ0eXBlIjoid2ViYXV0aG4uZ2V0IiwiY2hhbGxlbmdlIjoiLXAyWWpvNjJNMXA4dmdVaFlSdGR1RzVvZDRXUGhqVXVIVjM0RHBfcmh6RSIsIm9yaWdpbiI6Imh0dHBzOi8va2V5cy5jb2luYmFzZS5jb20iLCJjcm9zc09yaWdpbiI6ZmFsc2V9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
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
