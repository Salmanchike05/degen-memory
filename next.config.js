/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fix for wagmi connectors optional dependencies
    // These are optional peer dependencies that we don't use
    const optionalDeps = [
      'porto',
      'porto/internal',
      '@metamask/sdk',
      '@safe-global/safe-apps-sdk',
      '@safe-global/safe-apps-provider',
      '@walletconnect/ethereum-provider',
      '@coinbase/wallet-sdk',
      '@gemini-wallet/core',
    ];
    
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    
    optionalDeps.forEach((dep) => {
      config.resolve.alias[dep] = false;
    });
    
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
};

module.exports = nextConfig;
