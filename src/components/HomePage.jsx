import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Lock, Star, Flag, Check } from 'lucide-react';

const HomePage = ({ unlockedLevel = 1 }) => {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const milestones = [
    {
      id: 1,
      path: '/timeline',
      title: 'Lets rewind the time',
      img: '/images/milestone1.jpeg',
      color: '#ff4d6d',
      position: 'center'
    },
    {
      id: 2,
      path: '/how-to-love',
      title: 'How to Love Me?',
      img: '/images/loader2.jpeg',
      color: '#ff758f',
      position: 'right'
    },
    {
      id: 3,
      path: '/quiz',
      title: 'Love Kwiss',
      img: '/images/quiz.jpeg',
      color: '#c9184a',
      position: 'left'
    },
    {
      id: 4,
      path: '/love',
      title: 'Why I Love You',
      img: '/images/yiloveu.jpeg',
      color: '#ff8fa3',
      position: 'right'
    },
    {
      id: 5,
      path: '/slideshow',
      title: 'Our Memories',
      img: '/images/slideshow11.jpeg',
      color: '#800f2f',
      position: 'center'
    },
    {
      id: 6,
      path: '/finale',
      title: 'Grand Finale',
      img: '/images/final.jpeg',
      color: '#4a0e4e',
      position: 'left'
    }
  ];

  const containerRef = useRef(null);
  const nodeRefs = useRef([]);
  const [positions, setPositions] = useState([]);
  const niyasCtrl = useAnimation();
  const shaharCtrl = useAnimation();
  const [avatarAt, setAvatarAt] = useState(unlockedLevel - 1);

  // Update avatarAt when unlockedLevel changes
  useEffect(() => {
    setAvatarAt(unlockedLevel - 1);
  }, [unlockedLevel]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Compute positions
  useEffect(() => {
    const updatePositions = () => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();

      const newPositions = milestones.map((_, i) => {
        const el = nodeRefs.current[i];
        if (!el) return { x: 0, y: 0 };
        const rect = el.getBoundingClientRect();
        return {
          x: rect.left + rect.width / 2 - containerRect.left,
          y: rect.top + rect.height / 2 - containerRect.top
        };
      });

      setPositions(newPositions);
    };

    updatePositions();
    // Use a timeout to ensure DOM is fully laid out
    const timer = setTimeout(updatePositions, 100);
    return () => clearTimeout(timer);
  }, [windowWidth, milestones.length]); // Re-run on resize

  // Helper: Cubic Bezier Point
  const cubicPoint = (p0, p1, p2, p3, t) => {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    return {
      x: uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x,
      y: uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y
    };
  };

  // Generate Path Control Points
  const getPathData = (idx) => {
    if (idx === 0) return null; // No path to first node from nowhere (or maybe from start point)
    const prev = positions[idx - 1];
    const curr = positions[idx];
    if (!prev || !curr) return null;

    // Calculate control points for S-curve
    const distY = curr.y - prev.y;
    const cp1 = { x: prev.x, y: prev.y + distY * 0.5 };
    const cp2 = { x: curr.x, y: curr.y - distY * 0.5 };

    return { prev, curr, cp1, cp2 };
  };

  // Set Initial Avatar Positions
  useEffect(() => {
    if (positions.length === 0) return;

    const targetIndex = Math.min(avatarAt, positions.length - 1);
    const targetPos = positions[targetIndex];

    if (targetPos) {
      // Offset slightly so they don't overlap perfectly
      niyasCtrl.set({ x: targetPos.x - 20, y: targetPos.y - 10, scale: 1 });
      shaharCtrl.set({ x: targetPos.x + 10, y: targetPos.y + 10, scale: 1 });
    }
  }, [positions]); // Only run when positions are first calculated/updated

  // Animate Avatars when avatarAt changes
  useEffect(() => {
    if (positions.length === 0 || avatarAt === 0) return;

    // We only animate if we are moving FROM prev to curr
    const fromIdx = avatarAt - 1;
    const toIdx = avatarAt;

    if (fromIdx < 0 || toIdx >= positions.length) return;

    const pathData = getPathData(toIdx);
    if (!pathData) return;

    const { prev, curr, cp1, cp2 } = pathData;

    // Generate keyframes along the cubic bezier
    const steps = 60;
    const niyasFrames = [];
    const shaharFrames = [];

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const pt = cubicPoint(prev, cp1, cp2, curr, t);

      // Add some "wobble" or distinct offset for each character so they don't look merged
      niyasFrames.push({
        x: pt.x - 20,
        y: pt.y - 10
      });

      // Shahar follows slightly behind or parallel? 
      // Let's make Shahar follow the same path but purely delayed in time (handled by animation delay/sequence)
      // OR calculate a slightly different path offset
      shaharFrames.push({
        x: pt.x + 10,
        y: pt.y + 10
      });
    }

    const animateSequence = async () => {
      // Niyas Moves
      await niyasCtrl.start({
        x: niyasFrames.map(p => p.x),
        y: niyasFrames.map(p => p.y),
        transition: { duration: 2, ease: "easeInOut" }
      });

      // Shahar Follows
      await shaharCtrl.start({
        x: shaharFrames.map(p => p.x),
        y: shaharFrames.map(p => p.y),
        transition: { duration: 2, ease: "easeInOut" }
      });
    };

    animateSequence();

  }, [avatarAt, positions, niyasCtrl, shaharCtrl]);


  const handleNodeClick = (id, path) => {
    if (id <= unlockedLevel) {
      navigate(path);
    }
  };

  return (
    <div className="home-container" style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #fceef0 0%, #f6dadd 100%)',
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>

      {/* Gamified Background Elements */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', opacity: 0.4 }}>
        <svg width="100%" height="100%">
          <pattern id="dot-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="2" cy="2" r="2" fill="#e0aeb9" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#dot-pattern)" />
        </svg>
      </div>


      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '500px',
          display: 'flex',
          flexDirection: 'column',
          paddingBottom: '100px' // Space for avatars at bottom
        }}
      >
        {/* SVG Path Layer */}
        <svg style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          overflow: 'visible'
        }}>
          {positions.length > 0 && milestones.map((m, i) => {
            if (i === 0) return null;
            const pathData = getPathData(i);
            if (!pathData) return null;
            const { prev, curr, cp1, cp2 } = pathData;
            const isUnlocked = m.id <= unlockedLevel;

            return (
              <g key={`path-${i}`}>
                {/* Background Path (Shadow/Guide) */}
                <path
                  d={`M ${prev.x} ${prev.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${curr.x} ${curr.y}`}
                  stroke="#e6c0c9"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                />
                {/* Progress Path (Dashed or Solid) */}
                <motion.path
                  d={`M ${prev.x} ${prev.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${curr.x} ${curr.y}`}
                  stroke={isUnlocked ? m.color : '#b0b0b0'}
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={isUnlocked ? "none" : "10,10"}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: i * 0.3 }}
                />
              </g>
            );
          })}
        </svg>

        {/* Nodes Layer */}
        {milestones.map((m, i) => {
          const isUnlocked = m.id <= unlockedLevel;
          const isCompleted = m.id < unlockedLevel;

          // Determine horizontal alignment based on configuration
          let alignSelf = 'center';
          if (m.position === 'left') alignSelf = 'flex-start';
          if (m.position === 'right') alignSelf = 'flex-end';

          // Add some padding for the wavy feel
          const marginStyle = {};
          if (m.position === 'left') marginStyle.marginLeft = '10%';
          if (m.position === 'right') marginStyle.marginRight = '10%';

          return (
            <div
              key={m.id}
              ref={el => nodeRefs.current[i] = el}
              style={{
                alignSelf,
                ...marginStyle,
                marginBottom: '80px', // Spacing between nodes
                zIndex: 2,
                position: 'relative'
              }}
            >
              <motion.div
                whileHover={isUnlocked ? { scale: 1.1, rotate: 5 } : {}}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                onClick={() => handleNodeClick(m.id, m.path)}
                style={{
                  width: '100px',
                  height: '100px',
                  background: isUnlocked ? 'white' : '#e0e0e0',
                  borderRadius: '50%',
                  border: `5px solid ${isUnlocked ? m.color : '#bdc3c7'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isUnlocked ? `0 10px 25px ${m.color}66` : 'none',
                  cursor: isUnlocked ? 'pointer' : 'not-allowed',
                  position: 'relative'
                }}
              >
                {/* Image inside Circle */}
                <div style={{
                  width: '85%',
                  height: '85%',
                  borderRadius: '50%',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <img
                    src={m.img}
                    alt={m.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: isUnlocked ? 'none' : 'grayscale(100%)'
                    }}
                  />
                  {/* Locked Overlay */}
                  {!isUnlocked && (
                    <div style={{
                      position: 'absolute',
                      top: 0, left: 0, width: '100%', height: '100%',
                      background: 'rgba(0,0,0,0.4)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Lock color="white" size={24} />
                    </div>
                  )}
                </div>
              </motion.div>

              <div style={{
                marginTop: '15px',
                textAlign: 'center',
                fontFamily: 'var(--font-heading)',
                color: isUnlocked ? '#333' : '#999',
                fontWeight: 'bold',
                width: '140px',
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)'
              }}>
                {m.title}
              </div>
            </div>
          )
        })}

        {/* Floating Avatars */}
        {positions.length > 0 && (
          <>
            {/* Shahar moved first in code rendering to be behind Niyas if overlapping, or vice versa? 
                    User: "followed by shahar's avatar" -> Shahar should be visible. 
                    Let's render them as absolute divs.
                */}
            <motion.div
              animate={shaharCtrl}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '50px', height: '50px',
                borderRadius: '50%',
                border: '3px solid white',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                overflow: 'hidden',
                zIndex: 20
              }}
            >
              <img src="/images/shahar.jpeg" alt="shahar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>

            <motion.div
              animate={niyasCtrl}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '55px', height: '55px',
                borderRadius: '50%',
                border: '3px solid white',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                overflow: 'hidden',
                zIndex: 21
              }}
            >
              <img src="/images/niyas.jpeg" alt="niyas" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </motion.div>
          </>
        )}
      </div>

    </div>
  );
};

export default HomePage;

