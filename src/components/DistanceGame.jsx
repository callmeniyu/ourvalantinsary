import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, User } from 'lucide-react';

const DistanceGame = ({ onComplete }) => {
  const [distance, setDistance] = useState(100);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleClick = () => {
    if (distance > 0) {
      setDistance((prev) => Math.max(0, prev - 5)); // Reduce distance by 5% per click
    }
  };

  useEffect(() => {
    if (distance === 0 && !showSuccess) {
      setShowSuccess(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distance]);

  return (
    <div className="game-container" style={{
      padding: '20px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #ffe5ec 0%, #fff0f3 100%)',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <h2 style={{
        fontFamily: 'var(--font-heading)',
        color: 'var(--color-primary)',
        fontSize: '2rem',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        {distance > 0 ? "Smash the Distance!" : "Together at Last! ❤️"}
      </h2>

      <p style={{
        marginBottom: '30px',
        color: '#4a4a4a',
        textAlign: 'center'
      }}>
        Tap fast to bring us closer!
      </p>

      {/* Characters Container */}
      <div style={{
        width: '100%',
        height: '200px',
        position: 'relative',
        marginBottom: '40px',
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: '20px',
        border: '2px dashed var(--color-secondary)'
      }}>
        {/* Niyas */}
        <motion.div
          animate={{ left: `${10 + (100 - distance) * 0.4}%` }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: '#a2d2ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid white',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}>
            <User size={30} color="white" />
          </div>
          <span style={{ fontSize: '0.8rem', marginTop: '5px', fontWeight: 'bold' }}>Niyas</span>
        </motion.div>

        {/* Shahar */}
        <motion.div
          animate={{ right: `${10 + (100 - distance) * 0.4}%` }}
          transition={{ type: "spring", stiffness: 300 }}
          style={{
            position: 'absolute',
            top: '50%',
            transform: 'translate(50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid white',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}>
            <User size={30} color="white" />
          </div>
          <span style={{ fontSize: '0.8rem', marginTop: '5px', fontWeight: 'bold' }}>Shahar</span>
        </motion.div>

        {/* Heart in the middle appearing when distance is 0 */}
        {distance === 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.5, 1], opacity: 1 }}
            transition={{ duration: 0.5, repeat: Infinity }}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 10
            }}
          >
            <Heart size={80} fill="var(--color-primary)" color="var(--color-primary)" />
          </motion.div>
        )}
      </div>

      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleClick}
        disabled={distance === 0}
        style={{
          background: distance === 0 ? '#ccc' : 'var(--color-accent)',
          color: 'white',
          border: 'none',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          cursor: distance === 0 ? 'default' : 'pointer',
          boxShadow: '0 10px 20px rgba(201, 24, 74, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px'
        }}
      >
        <span>TAP!</span>
        <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>{Math.round(distance)}km left</span>
      </motion.button>
    </div>
  );
};

export default DistanceGame;
