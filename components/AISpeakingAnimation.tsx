import React from 'react';
import { motion } from 'framer-motion';

const AISpeakingAnimation = ({ isSpeaking }: { isSpeaking: boolean }) => {
  if (!isSpeaking) return null;

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const circleVariants = {
    initial: {
      scale: 0.8,
      opacity: 0.4,
    },
    animate: {
      scale: [0.8, 1.3, 0.8],
      opacity: [0.4, 1, 0.4],
      transition: {
        duration: 1.8,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      className="flex items-center justify-center gap-4 my-8"
      variants={containerVariants}
      animate="animate"
    >
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="relative"
          variants={circleVariants}
          initial="initial"
          animate="animate"
          custom={i}
        >
          <div className="size-3 rounded-full bg-[#e8b4bc]" />
          <div className="absolute inset-0 rounded-full bg-[#e8b4bc] blur-sm" />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AISpeakingAnimation;
