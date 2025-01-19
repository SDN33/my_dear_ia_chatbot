// next.config.js
module.exports = {
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 'avatar.vercel.sh',
      },
      {
        hostname: 'm.media-amazon.com',
      },
    ],
  },
};
