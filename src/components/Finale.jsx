import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Finale = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    const newHearts = [...Array(20)].map((_, i) => ({
      id: i,
      x: Math.random() * 100 + 'vw',
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 5,
      size: Math.random() * 30 + 10
    }));
    setHearts(newHearts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRestart = () => {
    window.location.reload();
  };

  return (
    <div className="finale-container" style={{
      padding: '20px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #ff4d6d 0%, #ff8fa3 100%)',
      color: 'white',
      textAlign: 'center',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Floating Hearts Background */}
      <div style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'hidden', pointerEvents: 'none' }}>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ y: '110vh', x: heart.x, opacity: 0 }}
            animate={{ y: '-10vh', opacity: [0, 1, 0] }}
            transition={{
              duration: heart.duration,
              repeat: Infinity,
              delay: heart.delay,
              ease: "linear"
            }}
            style={{ position: 'absolute' }}
          >
            <Heart size={heart.size} fill="rgba(255,255,255,0.3)" color="transparent" />
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        style={{ zIndex: 10 }}
      >
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '3rem',
          marginBottom: '20px',
          textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
        }}>
          Happy Anniversary & Valentine's!
        </h1>

        <div style={{
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          border: '5px solid white',
          overflow: 'hidden',
          margin: '0 auto 30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          background: 'white'
        }}>
          <img
            src="https://placehold.co/400x400/ffccd5/ff4d6d?text=Us+Forever"
            alt="Us"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <p style={{
          fontSize: '1.2rem',
          maxWidth: '500px',
          margin: '0 auto 30px',
          lineHeight: '1.6',
          fontFamily: 'var(--font-body)'
        }}>
          To my amazing Shahar,<br/>
          From the A4 sheet to Delhi days, every moment with you has been an adventure.
          I can't wait to close the distance for good. <br/>
          I love you! ❤️
        </p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleRestart}
          style={{
            background: 'white',
            color: 'var(--color-primary)',
            border: 'none',
            padding: '12px 30px',
            borderRadius: '50px',
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(0,0,0,0.2)'
          }}
        >
          Watch Again ↺
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Finale;
