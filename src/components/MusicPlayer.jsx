import React, { useState, useRef } from 'react';
import { Music, PauseCircle, PlayCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Placeholder music - User should replace this with their own song!
  // Using a royalty free sample for now.
  const musicUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 1000
    }}>
      <audio ref={audioRef} src={musicUrl} loop />

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={togglePlay}
        style={{
          background: 'var(--color-bg)',
          border: '2px solid var(--color-primary)',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          color: 'var(--color-primary)'
        }}
      >
        {isPlaying ? <PauseCircle size={24} /> : <Music size={24} />}
      </motion.button>
    </div>
  );
};

export default MusicPlayer;
