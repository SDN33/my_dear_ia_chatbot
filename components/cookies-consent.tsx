'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { setCookie, getCookie } from 'cookies-next';

interface CookieConsentProps {
  onAccept?: () => void;
  onReject?: () => void;
  onCustomize?: () => void;
}

const CookieConsent = ({ onAccept, onReject, onCustomize }: CookieConsentProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsent = getCookie('cookie-consent');
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    setCookie('cookie-consent', 'accepted', { maxAge: 60 * 60 * 3 }); // 3 hours
    setIsVisible(false);
    onAccept?.();
  };

  const handleReject = () => {
    setCookie('cookie-consent', 'rejected', { maxAge: 60 * 60 * 3 }); // 3 hours
    setIsVisible(false);
    onReject?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            className="bg-black rounded-xl p-6 max-w-lg w-full mx-auto shadow-xl"
          >
            <h2 className="text-xl font-semibold mb-4 text-white">Gestion des cookies</h2>

            <p className="text-gray-300 text-sm mb-6">
              Nous utilisons des cookies pour fournir et améliorer nos services, analyser l&apos;utilisation du site et, si vous acceptez, personnaliser votre expérience et vous proposer des services adaptés. Vous pouvez lire notre politique de cookies{' '}
              <a href="#" className="text-white hover:underline">ici</a>.
            </p>

            <div className="flex flex-col gap-2 w-full">

              <div className="flex gap-2 w-full">
                <button
                  onClick={handleReject}
                  className="flex-1 px-4 py-2 text-white border border-gray-600 rounded-lg
                       hover:bg-gray-800 transition-colors text-sm"
                >
                  Refuser tous les cookies
                </button>

                <button
                  onClick={handleAccept}
                  className="flex-1 px-4 py-2 text-white bg-teal-700 rounded-lg
                           hover:bg-teal-800 transition-colors text-sm border teal-orange-700"
                >
                  Accepter tous les cookies
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
