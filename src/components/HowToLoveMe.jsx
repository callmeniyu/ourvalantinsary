import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

// MilkSplash: spawns droplets and a spreading milk overlay from an origin point
const MilkSplash = ({ origin = { x: window.innerWidth / 2, y: window.innerHeight / 2 }, onDone = () => {} }) => {
    const [launched, setLaunched] = useState(false);
    const [droplets] = useState(() => {
        const arr = [];
        const count = 30;
        for (let i = 0; i < count; i++) {
            const size = 6 + Math.random() * 22; // px
            const angle = Math.random() * Math.PI * 2; // radians
            const distance = 60 + Math.random() * 600; // px
            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance + Math.random() * 120; // bias downward
            const rotate = Math.random() * 360;
            const delay = Math.random() * 200; // ms
            arr.push({ id: i, size, dx, dy, rotate, delay });
        }
        return arr;
    });

    useEffect(() => {
        // start next tick so transitions animate
        const t = requestAnimationFrame(() => setLaunched(true));
        const finish = setTimeout(() => onDone(), 1800);
        return () => {
            cancelAnimationFrame(t);
            clearTimeout(finish);
        };
    }, []);

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 200 }}>
            {/* Spreading milk blob (large) */}
            <div
                style={{
                    position: 'fixed',
                    left: origin.x,
                    top: origin.y,
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: 'white',
                    transform: launched ? 'translate(-50%, -50%) scale(35)' : 'translate(-50%, -50%) scale(0.02)',
                    opacity: launched ? 0.85 : 0.95,
                    transition: 'transform 900ms cubic-bezier(.12,.8,.25,1), opacity 900ms ease-out',
                    filter: 'blur(8px)'
                }}
            />

            {/* Individual droplets */}
            {droplets.map(d => (
                <div
                    key={d.id}
                    style={{
                        position: 'fixed',
                        left: origin.x,
                        top: origin.y,
                        width: d.size,
                        height: d.size,
                        marginLeft: -d.size / 2,
                        marginTop: -d.size / 2,
                        borderRadius: '50%',
                        background: 'white',
                        boxShadow: '0 6px 18px rgba(0,0,0,0.12)',
                        transform: launched ? `translate(${Math.round(d.dx)}px, ${Math.round(d.dy)}px) rotate(${d.rotate}deg) scale(0.8)` : 'translate(0,0) scale(1)',
                        opacity: launched ? 0 : 1,
                        transition: `transform 1200ms cubic-bezier(.12,.8,.25,1) ${d.delay}ms, opacity 1200ms ease ${d.delay}ms`
                    }}
                />
            ))}
        </div>
    );
};

const HowToLoveMe = ({ onComplete }) => {
    const navigate = useNavigate();
    const bananaRef = useRef(null);
    const [emitter, setEmitter] = useState(null); // { x, y }
    const [loveLevel, setLoveLevel] = useState(0);
    const [isWon, setIsWon] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    // Audio refs (optional, but good for "wow" factor if we had assets)
    // For now, visual feedback only.

    // Decay logic
    useEffect(() => {
        if (isWon) return;

        const decayInterval = setInterval(() => {
            setLoveLevel((prev) => {
                if (prev <= 0) return 0;
                // Decay speed increases as you get closer to finish? 
                // Or constant decay. Let's do constant for now.
                return Math.max(0, prev - 0.5);
            });
        }, 50); // Run every 50ms

        return () => clearInterval(decayInterval);
    }, [isWon]);

    const handleTap = () => {
        if (isWon) return;

        setLoveLevel((prev) => {
            const newVal = prev + 4; // Increment per tap
            if (newVal >= 100) {
                handleWin();
                return 100;
            }
            return newVal;
        });
    };

    const handleWin = () => {
        setIsWon(true);
        // Compute banana position to emit milk from its center
        setTimeout(() => {
            try {
                const el = bananaRef.current;
                if (el && el.getBoundingClientRect) {
                    const rect = el.getBoundingClientRect();
                    const x = rect.left + rect.width / 2;
                    const y = rect.top + rect.height / 2;
                    setEmitter({ x, y });
                } else {
                    setEmitter({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
                }
            } catch (e) {
                setEmitter({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
            }
        }, 80);
        // Do not auto-navigate; show popup after milk splash completes and let user continue
    };

    return (
        <div className="game-container" style={{
            minHeight: '100vh',
            width: '100%',
            background: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)', // Banana-ish yellow bg
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
            padding: '20px'
        }}>

            {/* Back Button */}
            <button
                onClick={() => navigate('/home')}
                style={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    background: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    cursor: 'pointer',
                    zIndex: 10
                }}
            >
                <ArrowLeft size={24} color="#333" />
            </button>

            {/* Title */}
            <h2 style={{
                fontFamily: 'var(--font-heading, fantasy)',
                color: '#F57F17',
                textAlign: 'center',
                marginBottom: '40px',
                fontSize: '2rem',
                zIndex: 5
            }}>
                How to Love Me? 🍌
            </h2>

            {/* Milk Bottle / Love Can Meter */}
            <div style={{
                position: 'absolute',
                right: '20px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '60px',
                height: '200px',
                border: '4px solid #333',
                borderRadius: '20px',
                background: 'rgba(255,255,255,0.5)',
                overflow: 'hidden',
                zIndex: 5,
                display: 'flex',
                flexDirection: 'column-reverse'
            }}>
                {/* Liquid */}
                <motion.div
                    style={{
                        width: '100%',
                        background: '#FFF', // Milk color
                        boxShadow: '0 0 10px rgba(255,255,255,0.8)'
                    }}
                    animate={{ height: `${loveLevel}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
                {/* Markers */}
                <div style={{ position: 'absolute', top: '25%', left: 0, width: '100%', height: 2, background: 'rgba(0,0,0,0.1)' }} />
                <div style={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: 2, background: 'rgba(0,0,0,0.1)' }} />
                <div style={{ position: 'absolute', top: '75%', left: 0, width: '100%', height: 2, background: 'rgba(0,0,0,0.1)' }} />
            </div>

            {/* The Big Banana */}
            <motion.div
                ref={bananaRef}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9, rotate: [0, -5, 5, 0] }}
                onClick={handleTap}
                style={{
                    fontSize: '150px',
                    cursor: 'pointer',
                    userSelect: 'none',
                    zIndex: 5,
                    filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))'
                }}
            >
                🍌
            </motion.div>

            <p style={{ marginTop: '20px', color: '#8D6E63', fontWeight: 'bold' }}>
                Tap it fast! Don't let it dry up!
            </p>


            {/* Splash Effect Overlay */}
            <AnimatePresence>
                {isWon && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 10 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: 'radial-gradient(circle, #FFFFFF 20%, transparent 80%)',
                            zIndex: 20,
                            pointerEvents: 'none'
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Full Screen Whiteout for "Splash" */}
            <AnimatePresence>
                {isWon && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.8, 0] }}
                        transition={{ duration: 1.5, delay: 0.2 }}
                        style={{
                            position: 'fixed',
                            top: 0, left: 0, width: '100vw', height: '100vh',
                            background: 'white',
                            zIndex: 19
                        }}
                    />
                )}
            </AnimatePresence>

            {/* Popup */}
            <AnimatePresence>
                {isWon && emitter && (
                    <MilkSplash key="milk" origin={emitter} onDone={() => setShowPopup(true)} />
                )}
            </AnimatePresence>

            {/* Post-splash popup: banana-themed image, text, and continue button */}
            <AnimatePresence>
                {showPopup && (
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        style={{
                            position: 'fixed',
                            top: '',
                            left: '',
                            transform: 'translate(-50%, -50%)',
                            background: 'linear-gradient(180deg, #FFFDF9, #FFF8E6)',
                            padding: '20px',
                            borderRadius: '18px',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.18)',
                            zIndex: 310,
                            textAlign: 'center',
                            maxWidth: '90%',
                            width: '320px',
                            maxHeight: '90vh',
                            overflowY: 'auto'
                        }}
                    >
                        <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🍌</div>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#333' }}>if you know you know</h3>
                        <p style={{ margin: '8px 0 16px 0', color: '#666', fontSize: '0.9rem' }}>You know it well 🫣</p>

                        <div style={{ width: '100%', height: '200px', overflow: 'hidden', borderRadius: '12px', marginBottom: '14px' }}>
                            <img src="/images/shy.gif" alt="milestone" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>

                        <button
                            onClick={() => onComplete()}
                            style={{
                                background: 'linear-gradient(90deg,#FFD259,#FFB74D)',
                                border: 'none',
                                padding: '10px 16px',
                                borderRadius: '10px',
                                color: '#3a2a0a',
                                fontWeight: '700',
                                cursor: 'pointer',
                                fontSize: '0.9rem'
                            }}
                        >
                            Yeah!! I'll love you this way →
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default HowToLoveMe;
