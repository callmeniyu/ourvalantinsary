import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const Loader = ({ onComplete }) => {
  const [kissCount, setKissCount] = useState(0);
  const [flyingHearts, setFlyingHearts] = useState([]);
  const [niyasReaction, setNiyasReaction] = useState(false);

  // Character Avatars (using dicebear for cute/cartoon style)
  // Using 'notionists' style for a clean, modern look, or 'micah' for sketchy/hand-drawn feel.
  // Let's go with 'micah' as it's very expressive.
  const niyasAvatar = "https://api.dicebear.com/9.x/micah/svg?seed=Niyas&backgroundColor=ffdfbf";
  const shaharAvatar = "https://api.dicebear.com/9.x/micah/svg?seed=Shahar&backgroundColor=ffdfbf";

  const sendKiss = () => {
    // Prevent more clicks than needed (considering active hearts)
    if (kissCount + flyingHearts.length >= 10) return;

    const newHeartId = Date.now();
    setFlyingHearts((prev) => [...prev, { id: newHeartId }]);

    // Trigger progress update after animation duration (approx 1s)
    setTimeout(() => {
      setKissCount((prev) => {
        const newCount = prev + 1;
        if (newCount >= 10) {
          setTimeout(onComplete, 500); // Give a little moment after full load
        }
        return newCount;
      });
      setNiyasReaction(true);
      setTimeout(() => setNiyasReaction(false), 300); // Reset reaction

      // Remove heart from state
      setFlyingHearts((prev) => prev.filter(h => h.id !== newHeartId));
    }, 1000);
  };

  return (
    <div className="loader-container" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#fff0f3',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      fontFamily: 'var(--font-heading)'
    }}>
      <h2 style={{
        color: 'var(--color-primary)',
        fontSize: '2rem',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        {kissCount < 10 ? "Send Kisses to Load! 💋" : "Loaded with Love! ❤️"}
      </h2>

      {/* Characters & Progress Area */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '400px',
        position: 'relative',
        marginBottom: '40px',
        padding: '0 20px'
      }}>
        {/* Niyas (Left) */}
        <motion.div
          animate={niyasReaction ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.3 }}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid var(--color-primary)',
            backgroundColor: 'white',
            zIndex: 10
          }}
        >
          <img src={niyasAvatar} alt="Niyas" style={{ width: '100%', height: '100%' }} />
        </motion.div>

        {/* Progress Bar Track */}
        <div style={{
          flex: 1,
          height: '15px',
          backgroundColor: '#e6e6e6',
          borderRadius: '10px',
          margin: '0 15px',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Progress Fill */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${kissCount * 10}%` }}
            transition={{ type: 'spring', stiffness: 50 }}
            style={{
              height: '100%',
              backgroundColor: 'var(--color-primary)',
              borderRadius: '10px'
            }}
          />
        </div>

        {/* Shahar (Right) */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '3px solid var(--color-secondary)',
          backgroundColor: 'white',
          zIndex: 10
        }}>
          <img src={shaharAvatar} alt="Shahar" style={{ width: '100%', height: '100%' }} />
        </div>

        {/* Flying Hearts Container (Absolute over the track) */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '100px', // Roughly start of track
          right: '100px', // Roughly end of track
          height: '0px',
          transform: 'translateY(-50%)',
          pointerEvents: 'none'
        }}>
          <AnimatePresence>
            {flyingHearts.map((heart) => (
              <motion.div
                key={heart.id}
                initial={{ x: '100%', opacity: 1, scale: 0.5 }} // Start at Shahar (Right)
                animate={{ x: '0%', opacity: 1, scale: 1 }}     // End at Niyas (Left)
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                style={{
                  position: 'absolute',
                  top: '-15px', // Center vertically relative to container
                  width: '30px',
                  height: '30px'
                }}
              >
                <Heart fill="var(--color-primary)" color="var(--color-accent)" size={30} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={sendKiss}
        disabled={kissCount >= 10}
        style={{
          background: kissCount >= 10 ? '#ccc' : 'var(--color-primary)',
          color: 'white',
          border: 'none',
          padding: '15px 40px',
          borderRadius: '50px',
          fontSize: '1.2rem',
          fontWeight: 'bold',
          cursor: kissCount >= 10 ? 'default' : 'pointer',
          boxShadow: '0 5px 15px rgba(255, 77, 109, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        {kissCount >= 10 ? "All Loaded! 🚀" : "Send Kiss 💋"}
      </motion.button>

      <p style={{ marginTop: '15px', color: '#888', fontFamily: 'var(--font-body)' }}>
        {kissCount}/10 Kisses sent
      </p>
    </div>
  );
};

export default Loader;
