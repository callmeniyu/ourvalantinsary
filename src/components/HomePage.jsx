import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Heart, Star, BookOpen, Music, Lock, Flag, MapPin, Gamepad2, BrainCircuit, Sparkles } from 'lucide-react';

const HomePage = ({ unlockedLevel = 1 }) => {
  const navigate = useNavigate();

  const milestones = [
    {
      id: 1,
      path: '/timeline',
      title: "Our Story",
      description: "How it all began...",
      icon: <BookOpen size={24} />,
      color: "#ff4d6d",
      position: "left"
    },
    {
      id: 2,
      path: '/distance',
      title: "Smash Distance",
      description: "Tap to bridge the gap!",
      icon: <MapPin size={24} />,
      color: "#ff758f",
      position: "right"
    },
    {
      id: 3,
      path: '/quiz',
      title: "Love Quiz",
      description: "How well do you know us?",
      icon: <BrainCircuit size={24} />,
      color: "#c9184a",
      position: "left"
    },
    {
      id: 4,
      path: '/love',
      title: "Why I Love You",
      description: "Reasons why you're the one.",
      icon: <Sparkles size={24} />,
      color: "#ff8fa3",
      position: "right"
    },
    {
      id: 5,
      path: '/finale',
      title: "Grand Finale",
      description: "A special surprise...",
      icon: <Heart size={24} fill="white" />,
      color: "#800f2f",
      position: "center"
    }
  ];

  const handleNavigate = (path, id) => {
    if (id <= unlockedLevel) {
      navigate(path);
    }
  };

  return (
    <div className="home-container" style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(180deg, #fff0f3 0%, #ffccd5 100%)',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Decor */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 0 }}>
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: '100vh', opacity: [0, 0.5, 0] }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: "linear"
            }}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`,
              color: 'var(--color-secondary)'
            }}
          >
            ❤️
          </motion.div>
        ))}
      </div>

      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-primary)',
          fontSize: '2.5rem',
          marginBottom: '40px',
          textAlign: 'center',
          zIndex: 10,
          textShadow: '2px 2px 0px white'
        }}
      >
        Our Love Journey 🚀
      </motion.h1>

      <div style={{ position: 'relative', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}>

        {/* Central Line */}
        <div style={{
          position: 'absolute',
          top: '40px',
          bottom: '50px',
          left: '50%',
          width: '4px',
          background: 'rgba(255, 255, 255, 0.5)',
          transform: 'translateX(-50%)',
          borderRadius: '2px',
          zIndex: 0
        }} />

        {milestones.map((milestone, index) => {
          const isUnlocked = milestone.id <= unlockedLevel;
          const isCompleted = milestone.id < unlockedLevel;
          const isNext = milestone.id === unlockedLevel;

          return (
            <motion.div
              key={milestone.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: milestone.position === 'center' ? 'center' : (milestone.position === 'left' ? 'flex-start' : 'flex-end'),
                marginBottom: '60px',
                position: 'relative'
              }}
            >
              {/* Connector Line to Center (if not center aligned) */}
              {milestone.position !== 'center' && (
                <div style={{
                  position: 'absolute',
                  top: '30px',
                  left: milestone.position === 'left' ? '50%' : 'auto',
                  right: milestone.position === 'right' ? '50%' : 'auto',
                  width: '50%',
                  height: '2px',
                  background: isUnlocked ? milestone.color : '#ccc',
                  zIndex: -1,
                  transformOrigin: milestone.position === 'left' ? 'left' : 'right',
                  transform: 'scaleX(0.8)'
                }} />
              )}

              <motion.div
                whileHover={isUnlocked ? { scale: 1.05 } : {}}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                onClick={() => handleNavigate(milestone.path, milestone.id)}
                style={{
                  background: isUnlocked ? 'white' : '#e0e0e0',
                  padding: '15px',
                  borderRadius: '15px',
                  width: '160px',
                  boxShadow: isUnlocked ? `0 10px 20px ${milestone.color}40` : 'none',
                  border: `3px solid ${isUnlocked ? milestone.color : '#bdbdbd'}`,
                  cursor: isUnlocked ? 'pointer' : 'default',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  zIndex: 2,
                  opacity: isUnlocked ? 1 : 0.7
                }}
              >
                {/* Milestone Icon Circle */}
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: isUnlocked ? milestone.color : '#9e9e9e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  marginBottom: '10px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  position: 'relative'
                }}>
                  {isUnlocked ? milestone.icon : <Lock size={20} />}

                  {/* Pulse Effect for Current Level */}
                  {isNext && (
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{
                        position: 'absolute',
                        top: 0, left: 0, right: 0, bottom: 0,
                        borderRadius: '50%',
                        border: `2px solid ${milestone.color}`,
                        zIndex: -1
                      }}
                    />
                  )}
                </div>

                <h3 style={{
                  fontSize: '1rem',
                  color: isUnlocked ? 'var(--color-text)' : '#757575',
                  marginBottom: '4px',
                  fontFamily: 'var(--font-heading)'
                }}>
                  {milestone.title}
                </h3>

                <p style={{
                  fontSize: '0.75rem',
                  color: '#888',
                  lineHeight: '1.2'
                }}>
                  {isUnlocked ? milestone.description : "Locked"}
                </p>

                {/* Status Indicator */}
                {isCompleted && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '-10px',
                    background: '#4cc9f0',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '5px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                  }}>
                    <Flag size={12} fill="white" />
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
        })}

        {/* Start Line */}
        <div style={{
          position: 'absolute',
          bottom: '-20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: 'white',
          border: '4px solid var(--color-primary)',
          zIndex: 1
        }} />
      </div>

      <p style={{
        marginTop: '30px',
        fontSize: '0.9rem',
        color: 'var(--color-primary)',
        fontStyle: 'italic',
        textAlign: 'center',
        maxWidth: '300px'
      }}>
        "Every step brings us closer..." ❤️
      </p>
    </div>
  );
};

export default HomePage;
