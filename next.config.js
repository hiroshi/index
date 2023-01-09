/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // https://stackoverflow.com/a/73306694/338986
  output: "standalone",
};

module.exports = nextConfig;
