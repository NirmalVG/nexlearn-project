/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "https://nexlearn.noviindusdemosites.in/:path*",
      },
    ]
  },
}

module.exports = nextConfig
