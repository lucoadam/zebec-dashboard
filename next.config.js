/** @type {import('next').NextConfig} */

// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require("./next-i18next.config")

const nextConfig = {
  reactStrictMode: true,
  env: {
    RPC_NETWORK: process.env.RPC_NETWORK,
    DB_HOST: process.env.DB_HOST,
    ZBC_AIRDROP: process.env.ZBC_AIRDROP,
    NOTIFI_CARD_ID: process.env.NOTIFI_CARD_ID,
    SYNDICA_API: process.env.SYNDICA_API,
    PROGRAM_ID: process.env.PROGRAM_ID,
    FEE_RECEIVER_WALLET: process.env.FEE_RECEIVER_WALLET,
    SDK_ENV: process.env.SDK_ENV,
    SOLANA_API_URL: process.env.SOLANA_API_URL,
    RELAYER_API_URL: process.env.RELAYER_API_URL
  },
  i18n,
  images: {
    domains: ["res.cloudinary.com"]
  },
  webpack(config) {
    config.experiments.asyncWebAssembly = true
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      encoding: false
    }
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
    )
    return config
  },
  experimental: {
    outputStandalone: true
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders
      }
    ]
  }
}

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors https://magic.store"
  }
]

module.exports = nextConfig
