const { hostname } = require("os");

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
      {
        hostname: 'commons.wikimedia.org',
      },
      {
        hostname: 'upload.wikimedia.org',
      },
      {
        hostname: 'images.bfmtv.com',
      },
    ],
  },
};
