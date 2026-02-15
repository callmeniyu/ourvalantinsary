import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { reasons } from '../data/storyData';
import { Heart, Stars } from 'lucide-react';

const LoveGenerator = ({ onComplete }) => {
  const [currentReason, setCurrentReason] = useState(null);
  const [clickCount, setClickCount] = useState(0);

  const generateReason = () => {
    const randomIndex = Math.floor(Math.random() * reasons.length);
    setCurrentReason(reasons[randomIndex]);
    setClickCount((prev) => prev + 1);
  };

  return (
    <div className="generator-container" style={{
      padding: '20px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #ffccd5 0%, #fff0f3 100%)',
      textAlign: 'center'
    }}>
      <h2 style={{
        fontFamily: 'var(--font-heading)',
        color: 'var(--color-primary)',
        fontSize: '2rem',
        marginBottom: '30px'
      }}>
        Why I Love You
      </h2>

      <div style={{
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '30px',
        width: '100%',
        maxWidth: '500px'
      }}>
        <AnimatePresence mode="wait">
          {currentReason ? (
            <motion.div
              key={`${currentReason}-${clickCount}`}
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              style={{
                background: 'white',
                padding: '30px',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(255, 77, 109, 0.2)',
                position: 'relative',
                width: '100%'
              }}
            >
              <Heart
                size={40}
                color="var(--color-secondary)"
                fill="var(--color-bg)"
                style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)' }}
              />
              <p style={{
                fontSize: '1.4rem',
                color: '#4a4a4a',
                fontFamily: 'var(--font-body)',
                lineHeight: '1.6'
              }}>
                "{currentReason}"
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                fontSize: '1.2rem',
                color: '#888',
                fontStyle: 'italic'
              }}
            >
              Tap the button below to find out...
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={generateReason}
        style={{
          background: 'var(--color-primary)',
          color: 'white',
          border: 'none',
          padding: '15px 40px',
          borderRadius: '50px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          marginBottom: '20px',
          boxShadow: '0 5px 15px rgba(255, 77, 109, 0.4)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <Stars size={20} />
        {clickCount === 0 ? "Tell Me Why" : "Another Reason"}
      </motion.button>

      {clickCount >= 3 && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={onComplete}
          style={{
            background: 'transparent',
            border: '2px solid var(--color-primary)',
            color: 'var(--color-primary)',
            padding: '10px 30px',
            borderRadius: '30px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '20px'
          }}
        >
          Is that all? (Go to Finale)
        </motion.button>
      )}
    </div>
  );
};

export default LoveGenerator;
