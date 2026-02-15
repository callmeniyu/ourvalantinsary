import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Loader from './components/Loader';
import HomePage from './components/HomePage';
import Timeline from './components/Timeline';
import DistanceGame from './components/DistanceGame';
import Quiz from './components/Quiz';
import LoveGenerator from './components/LoveGenerator';
import Finale from './components/Finale';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize state from localStorage or default to 1
  const [unlockedLevel, setUnlockedLevel] = useState(() => {
    const saved = localStorage.getItem('unlockedLevel');
    return saved ? parseInt(saved, 10) : 1;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('unlockedLevel', unlockedLevel.toString());
  }, [unlockedLevel]);

  // Handler for completing a level
  const handleLevelComplete = (completedLevelId) => {
    // If completing the current level, unlock the next one
    if (completedLevelId >= unlockedLevel) {
      setUnlockedLevel(completedLevelId + 1);
    }
    // Navigate back to home
    navigate('/home');
  };

  const handleLoaderComplete = () => {
    navigate('/home');
  };

  return (
    <div className="app-container" style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.45 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Routes location={location}>
            <Route path="/" element={<Loader onComplete={handleLoaderComplete} />} />
            <Route path="/home" element={<HomePage unlockedLevel={unlockedLevel} />} />

            <Route
              path="/timeline"
              element={<Timeline onComplete={() => handleLevelComplete(1)} />}
            />
            <Route
              path="/distance"
              element={<DistanceGame onComplete={() => handleLevelComplete(2)} />}
            />
            <Route
              path="/quiz"
              element={<Quiz onComplete={() => handleLevelComplete(3)} />}
            />
            <Route
              path="/love"
              element={<LoveGenerator onComplete={() => handleLevelComplete(4)} />}
            />
            <Route path="/finale" element={<Finale />} />

            {/* Fallback to loader for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
