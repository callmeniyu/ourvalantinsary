import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { storyData } from '../data/storyData';
import { ArrowRight, Heart } from 'lucide-react';

const Timeline = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < storyData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  const currentStory = storyData[currentIndex];

  return (
    <div className="timeline-container" style={{
      padding: '20px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #fff0f3 0%, #ffe5ec 100%)'
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'white',
            padding: '20px',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(255, 77, 109, 0.15)',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <div style={{
            marginBottom: '10px',
            color: 'var(--color-secondary)',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            Chapter {currentIndex + 1} of {storyData.length}
          </div>

          <h2 style={{
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-primary)',
            fontSize: '1.8rem',
            marginBottom: '15px'
          }}>
            {currentStory.title}
          </h2>

          <div style={{
            width: '100%',
            height: '200px',
            backgroundColor: '#ffe5ec',
            borderRadius: '10px',
            marginBottom: '20px',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <img
              src={currentStory.image}
              alt={currentStory.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>

          <p style={{
            fontSize: '1.1rem',
            lineHeight: '1.6',
            color: '#4a4a4a',
            marginBottom: '25px',
            fontFamily: 'var(--font-body)'
          }}>
            {currentStory.text}
          </p>

          <button
            onClick={handleNext}
            style={{
              background: 'var(--color-primary)',
              color: 'white',
              border: 'none',
              padding: '12px 30px',
              borderRadius: '50px',
              fontSize: '1rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              boxShadow: '0 5px 15px rgba(255, 77, 109, 0.4)',
              cursor: 'pointer'
            }}
          >
            {currentIndex === storyData.length - 1 ? "Start The Game!" : "Next Chapter"}
            {currentIndex === storyData.length - 1 ? <Heart size={20} fill="white" /> : <ArrowRight size={20} />}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Timeline;
