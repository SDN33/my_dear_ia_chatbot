import React from 'react';

const Header = () => (
  <div className="w-full text-center py-4 border-b">
  <div className="text-2xl font-bold text-gray-800 dark:text-zinc-200 w-8 h-auto mx-auto">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      {/* Fond décoratif */}
      <circle cx="100" cy="100" r="90" fill="#F8E1E8" opacity="0.3"/>

      {/* Cercle principal */}
      <circle cx="100" cy="100" r="60" fill="#E8B4BC"/>

      {/* Motifs géométriques élégants */}
      <path d="M100 40 L120 60 L100 80 L80 60 Z" fill="#B4D7D9" opacity="0.6"/>
      <path d="M40 100 L60 120 L40 140 L20 120 Z" fill="#B4D7D9" opacity="0.6"/>
      <path d="M160 100 L180 120 L160 140 L140 120 Z" fill="#B4D7D9" opacity="0.6"/>

      {/* Éléments abstraits */}
      <circle cx="100" cy="100" r="35" fill="#F8E1E8"/>

      {/* Lignes décoratives courbes */}
      <path d="M65 100 Q100 130 135 100" stroke="#B4D7D9" strokeWidth="3" fill="none"/>
      <path d="M65 90 Q100 120 135 90" stroke="#B4D7D9" strokeWidth="3" fill="none"/>

      {/* Détails élégants */}
      <circle cx="70" cy="85" r="5" fill="#B4D7D9"/>
      <circle cx="130" cy="85" r="5" fill="#B4D7D9"/>

      {/* Éléments de connexion subtils */}
      <path d="M40 70 Q70 40 100 40" stroke="#E8B4BC" strokeWidth="2" fill="none" opacity="0.6"/>
      <path d="M160 70 Q130 40 100 40" stroke="#E8B4BC" strokeWidth="2" fill="none" opacity="0.6"/>
    </svg>
  </div>
  </div>
);

export default Header;
