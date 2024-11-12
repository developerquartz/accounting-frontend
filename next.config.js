/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.node/,
      use: "raw-loader",
    });

    return config;
  },
};
