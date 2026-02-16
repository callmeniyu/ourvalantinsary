import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Slideshow = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showGallery, setShowGallery] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const audioRef = useRef(null);
  const slides = Array.from({ length: 19 }, (_, i) => `/images/slideshow${i + 1}.jpeg`);

  useEffect(() => {
    // Play music
    if (audioRef.current) {
      audioRef.current.volume = 0.45;
      audioRef.current.play().catch(() => {});
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const handleTap = () => {
    if (showGallery) return;
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((s) => s + 1);
    } else {
      // End of slides -> show gallery
      setShowGallery(true);
      if (audioRef.current) audioRef.current.pause();
    }
  };

return (
    <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #ffebee 0%, #fce4ec 100%)',
        position: 'relative',
        overflow: 'hidden',
        padding: 20
    }}>
        <audio ref={audioRef} src="/audios/slideshow.mp3" loop />

        {!showGallery ? (
            <div onClick={handleTap} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 0.92, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        transition={{ duration: 0.6, ease: 'easeInOut' }}
                        style={{
                            position: 'relative',
                            width: '92%',
                            maxWidth: '700px',
                            height: '72vh',
                            borderRadius: '20px',
                            overflow: 'hidden',
                            boxShadow: '0 30px 80px rgba(0,0,0,0.28)',
                            cursor: 'pointer'
                        }}
                    >
                        <img
                            src={slides[currentSlide]}
                            alt={`Slide ${currentSlide + 1}`}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            bottom: 18,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            background: 'rgba(0,0,0,0.5)',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '16px',
                            fontSize: '1rem',
                            fontWeight: 700
                        }}>
                            {currentSlide + 1} / {slides.length}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        ) : (
            <div style={{ width: '100%', maxWidth: 1000 }}>
                <h2 style={{ textAlign: 'center', marginBottom: 12, color: '#52223f' }}>Our Memories</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12 }}>
                    {slides.map((src, i) => (
                        <div key={i} style={{ borderRadius: 12, overflow: 'hidden', cursor: 'pointer' }} onClick={() => setLightbox(src)}>
                            <img src={src} alt={`thumb-${i}`} style={{ width: '100%', height: 120, objectFit: 'cover', display: 'block' }} />
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 18 }}>
                    <button onClick={() => onComplete()} style={{ padding: '10px 18px', borderRadius: 12, border: 'none', background: 'linear-gradient(90deg,#ff9bb3,#ff6ea1)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>Loved you every second☺️</button>
                </div>
            </div>
        )}

        {/* Lightbox */}
        <AnimatePresence>
            {lightbox && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', zIndex: 9999 }} onClick={() => setLightbox(null)}>
                    <motion.img src={lightbox} alt="lightbox" initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: 12 }} />
                </motion.div>
            )}
        </AnimatePresence>

        {/* Floating hearts animation */}
        {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, y: 80, x: Math.random() * window.innerWidth }}
                animate={{
                    opacity: [0, 1, 0],
                    y: -window.innerHeight - 100,
                    x: Math.random() * window.innerWidth
                }}
                transition={{
                    duration: 5 + Math.random() * 3,
                    delay: Math.random() * 3,
                    repeat: Infinity,
                    repeatDelay: 2
                }}
                style={{ position: 'absolute', fontSize: `${18 + Math.random() * 18}px`, pointerEvents: 'none' }}
            >
                ❤️
            </motion.div>
        ))}
    </div>
);
};

export default Slideshow;