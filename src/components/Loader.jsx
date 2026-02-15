import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';

const Loader = ({ onComplete }) => {
  const [kissCount, setKissCount] = useState(0);
  const [flyingHearts, setFlyingHearts] = useState([]);
  const [niyasReaction, setNiyasReaction] = useState(false);
  const [currentReaction, setCurrentReaction] = useState(null);
  const [showFinalButton, setShowFinalButton] = useState(false);
  const [audioUnmuted, setAudioUnmuted] = useState(false);
  const audioRef = useRef(null);
  const kissAudioRef = useRef(null);

  const kissSounds = [
    '/audios/kiss1.wav',
    '/audios/kiss2.wav',
    '/audios/kiss3.wav',
    '/audios/kiss4.wav',
    '/audios/kiss5.wav',
    '/audios/kiss6.wav'
  ];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Autoplay blocked, will play on user interaction
      });
    }
  }, []);

  // Character Avatars (using dicebear for cute/cartoon style)
  // Using 'notionists' style for a clean, modern look, or 'micah' for sketchy/hand-drawn feel.
  // Let's go with 'micah' as it's very expressive.
  const niyasAvatar = "/images/niyas.jpeg";
  const shaharAvatar = "/images/shahar.jpeg";

  const sendKiss = () => {
    // Unmute audio on first interaction
    if (!audioUnmuted && audioRef.current) {
      audioRef.current.muted = false;
      setAudioUnmuted(true);
    }

    // Play kiss sound effect
    if (kissAudioRef.current) {
      const randomSound = kissSounds[Math.floor(Math.random() * kissSounds.length)];
      kissAudioRef.current.src = randomSound;
      kissAudioRef.current.currentTime = 0; // Reset to start
      kissAudioRef.current.play();
    }

    // Prevent more clicks than needed (considering active hearts)
    if (kissCount + flyingHearts.length >= 10) return;

    const newHeartId = Date.now();
    setFlyingHearts((prev) => [...prev, { id: newHeartId }]);

    // Trigger progress update after animation duration (approx 1s)
    setTimeout(() => {
      const newCount = kissCount + 1;
      setKissCount(newCount);
      if (newCount === 10) {
        setShowFinalButton(true);
      }
      setNiyasReaction(true);
      setTimeout(() => setNiyasReaction(false), 300); // Reset reaction

      // Set reaction popup
      setCurrentReaction({
        type: newCount === 10 ? 'video' : 'image',
        src: newCount === 10 ? '/images/loader10.mp4' : `/images/loader${newCount}.jpeg`
      });
      setTimeout(() => setCurrentReaction(null), 2000); // Hide after 2s

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
      {/* Kiss Me Audio */}
      <audio ref={audioRef} src="/audios/kissme.mp3" autoPlay loop style={{ display: 'none' }} />      {/* Kiss Sound Effect */}
      <audio ref={kissAudioRef} src="/audios/kiss.wav" style={{ display: 'none' }} />
      <h2 style={{
        color: 'var(--color-primary)',
        fontSize: '2rem',
        marginBottom: '20px',
        textAlign: 'center'
      }}>
        Kiss mee!! <br/> Close your eyes🙈
      </h2>

      {/* Characters & Progress Area (stacked vertically) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '300px',
        position: 'relative',
        marginBottom: '40px',
        padding: '0 20px'
      }}>
        {/* Niyas (Left) */}
        <motion.div
          animate={niyasReaction ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
          transition={{ duration: 0.3 }}
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            overflow: 'hidden',
            border: '3px solid var(--color-primary)',
            backgroundColor: 'white',
            zIndex: 10,
            marginBottom: '18px'
          }}
        >
          <img src={niyasAvatar} alt="Niyas" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </motion.div>

        {/* Reaction Popup */}
        <AnimatePresence>
          {currentReaction && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                top: '-50px', // Position above Niyas
                left: '17%',
                transform: 'translateX(-50%)',
                zIndex: 50,
                width: '200px',
                height: '200px',
                borderRadius: '10px',
                overflow: 'hidden',
                border: '2px solid var(--color-primary)',
                borderRadius:"50%"
              }}
            >
              {currentReaction.type === 'image' ? (
                <img src={currentReaction.src} alt="Reaction" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <video src={currentReaction.src} autoPlay muted style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress Bar Track (vertical) */}
        <div style={{
          width: '40px',
          height: '220px',
          backgroundColor: '#e6e6e6',
          borderRadius: '12px',
          margin: '12px 0',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'flex-end',
          zIndex: 5
        }}>
          {/* Progress Fill (grows upward) */}
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${kissCount * 10}%` }}
            transition={{ type: 'spring', stiffness: 60 }}
            style={{
              width: '100%',
              backgroundColor: 'var(--color-primary)',
              borderRadius: '12px 12px 0 0',
              transformOrigin: 'bottom'
            }}
          />
        </div>

        {/* Shahar (Right) */}
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: '3px solid var(--color-secondary)',
          backgroundColor: 'white',
          zIndex: 10,
          marginTop: '18px'
        }}>
          <img src={shaharAvatar} alt="Shahar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>

        {/* Flying Hearts Container (Absolute over the track) */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: '40px',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
          zIndex: 20
        }}>
          <AnimatePresence>
            {flyingHearts.map((heart) => (
              <motion.div
                key={heart.id}
                initial={{ bottom: 8, opacity: 1, scale: 0.6 }} // start near Shahar (bottom)
                animate={{ bottom: 400, opacity: 1, scale: 1 }}  // move up toward Niyas (top)
                exit={{ opacity: 0, scale: 1.5 }}
                transition={{ duration: 1, ease: "easeInOut" }}
                style={{
                  position: 'absolute',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  bottom: '8px',
                  width: '32px',
                  height: '32px',
                  zIndex: 30
                }}
              >
                <Heart fill="var(--color-primary)" color="var(--color-accent)" size={30} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Button */}
      {showFinalButton ? (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onComplete}
          style={{
            background: 'var(--color-primary)',
            color: 'white',
            border: 'none',
            padding: '15px 40px',
            borderRadius: '50px',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 5px 15px rgba(255, 77, 109, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          Enough kisses? 💋
        </motion.button>
      ) : (
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
      )}

    </div>
  );
};

export default Loader;
