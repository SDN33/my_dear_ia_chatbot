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
    ],
    domains: ['m.media-amazon.com'], // Ajoute ce domaine ici

  },
};
