/** @type {import('next').NextConfig} */

const { i18n } = require("./next-i18next.config")

const nextConfig = {
  reactStrictMode: true,
  env: {
    RPC_NETWORK: process.env.RPC_NETWORK,
    DB_HOST: process.env.DB_HOST
  },
  i18n,
  webpack(config) {
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
  }
}

module.exports = nextConfig
