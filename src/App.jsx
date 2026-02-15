import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Loader from './components/Loader';
import Timeline from './components/Timeline';
import DistanceGame from './components/DistanceGame';
import Quiz from './components/Quiz';
import LoveGenerator from './components/LoveGenerator';
import Finale from './components/Finale';

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Define the route order for onComplete navigation
  const routeOrder = ['/', '/timeline', '/distance', '/quiz', '/love', '/finale'];

  const handleComplete = (fromPath = location.pathname) => {
    const idx = routeOrder.indexOf(fromPath);
    const next = routeOrder[Math.min(idx + 1, routeOrder.length - 1)];
    navigate(next);
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
            <Route path="/" element={<Loader onComplete={() => handleComplete('/')} />} />
            <Route path="/timeline" element={<Timeline onComplete={() => handleComplete('/timeline')} />} />
            <Route path="/distance" element={<DistanceGame onComplete={() => handleComplete('/distance')} />} />
            <Route path="/quiz" element={<Quiz onComplete={() => handleComplete('/quiz')} />} />
            <Route path="/love" element={<LoveGenerator onComplete={() => handleComplete('/love')} />} />
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
