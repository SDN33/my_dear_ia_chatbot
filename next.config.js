// next.config.js
module.exports = {
  experimental: {
    ppr: true,
    analyticsId: null, // Désactive complètement l'icône de Vercel Analytics
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
