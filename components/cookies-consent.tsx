'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { setCookie, getCookie } from 'cookies-next';

interface CookieConsentProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

const CookieConsent = ({ onAccept, onDecline }: CookieConsentProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsent = getCookie('cookie-consent');
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    setCookie('cookie-consent', 'accepted', { maxAge: 60 * 60 * 24 * 365 }); // 1 year
    setIsVisible(false);
    onAccept?.();
  };

  const handleDecline = () => {
    setCookie('cookie-consent', 'declined', { maxAge: 60 * 60 * 24 * 365 }); // 1 year
    setIsVisible(false);
    onDecline?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 w-full bg-white px-8 py-10 rounded-t-2xl
                     shadow-lg flex items-center gap-6 z-50 dark:bg-gray-800"
        >
          <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed text-center">
            Nous utilisons des cookies pour améliorer votre expérience.
            En continuant, vous acceptez notre politique de confidentialité.
          </p>
          <div className="flex gap-3 shrink-0">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAccept}
              className="bg-teal-500 text-white px-4 py-2 rounded-lg text-sm
                       hover:bg-teal-600 transition-colors"
            >
              Accepter
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDecline}
              className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg text-sm
                       hover:bg-gray-200 transition-colors"
            >
              Refuser
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
