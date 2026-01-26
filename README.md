# Degen Memory

A memory matching game mini app for Base App featuring popular crypto tokens.

## Getting Started

This is a [NextJS](https://nextjs.org/) + TypeScript + React app built for Base App.

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Building for Production

```bash
npm run build
npm start
```

## Base App Integration

This mini app follows the Base App mini app specifications:

- Manifest configuration in `minikit.config.ts`
- Farcaster manifest at `app/.well-known/farcaster.json`
- Webhook endpoint at `app/api/webhook/route.ts`

## Deployment

Deploy to Vercel for easy hosting:

1. Push your code to GitHub
2. Import the repository to Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_URL` - Your production URL
4. Deploy

After deployment, follow the [Base App documentation](https://docs.base.org/mini-apps/quickstart/create-new-miniapp) to:
1. Create account association credentials
2. Update `minikit.config.ts` with account association
3. Publish your app

## Resources

- [Base App Mini Apps Docs](https://docs.base.org/mini-apps)
- [MiniKit Docs](https://docs.base.org/base-app/build-with-minikit/overview)
- [Farcaster Mini Apps](https://miniapps.farcaster.xyz)
