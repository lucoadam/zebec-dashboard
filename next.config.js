/** @type {import('next').NextConfig} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require("./next-i18next.config");

const nextConfig = {
  reactStrictMode: true,
  env: {
    RPC_NETWORK: process.env.RPC_NETWORK,
    DB_HOST: process.env.DB_HOST,
    ZBC_AIRDROP: process.env.ZBC_AIRDROP,
  },
  i18n,
  webpack(config) {
    config.experiments.asyncWebAssembly = true;
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      encoding: false
    };
    config.module.rules.push(
      {
        test: /\.svg$/i,
        type: "asset",
        resourceQuery: /url/
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: [/url/] },
        use: [{ loader: "@svgr/webpack", options: { icon: true } }]
      }
    );
    return config;
  },
  experimental: {
    outputStandalone: true
  }
};

module.exports = nextConfig;
