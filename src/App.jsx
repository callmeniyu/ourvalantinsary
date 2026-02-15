import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from './components/Loader';
import MusicPlayer from './components/MusicPlayer';
import Timeline from './components/Timeline';
import DistanceGame from './components/DistanceGame';
import Quiz from './components/Quiz';
import LoveGenerator from './components/LoveGenerator';
import Finale from './components/Finale';

function App() {
  const [loading, setLoading] = useState(true);
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const nextSection = () => {
    setCurrentSection((prev) => prev + 1);
  };

  const renderSection = () => {
    switch (currentSection) {
      case 0:
        return <Timeline onComplete={nextSection} />;
      case 1:
        return <DistanceGame onComplete={nextSection} />;
      case 2:
        return <Quiz onComplete={nextSection} />;
      case 3:
        return <LoveGenerator onComplete={nextSection} />;
      case 4:
        return <Finale />;
      default:
        return <Timeline onComplete={nextSection} />;
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="app-container" style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
      <MusicPlayer />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', height: '100%' }}
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default App;
