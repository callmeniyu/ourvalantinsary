import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-pink-50" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'var(--color-bg)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999
    }}>
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 0.8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Heart size={80} color="var(--color-primary)" fill="var(--color-primary)" />
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          marginTop: '20px',
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-text)',
          fontSize: '2rem'
        }}
      >
        Loading Love...
      </motion.h2>
    </div>
  );
};

export default Loader;
