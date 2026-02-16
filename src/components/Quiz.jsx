import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Check, X } from 'lucide-react';

const questions = [
  {
    id: 1,
    question: 'Who is the boss in our relationship?',
    options: ['You (Shahar)', 'Me (Niyas)'],
    correct: [1],
    correctText: 'Humm, yes maam! you r right. 😌',
    wrongText: "Oh I think you should rethink! 🤔",
    audioCorrect: '/audios/kiss2.wav',
    audioWrong: '/audios/kiss3.wav'
  },
  {
    id: 2,
    question: 'What do i love the most?',
    options: ['sleep', 'work', 'You'],
    correct: [0, 1], // both A and B correct
    correctText: 'Right! Both are beloved 😉',
    wrongText: "Nope — you are not the favorite here 😅",
    audioCorrect: '/audios/kiss4.wav',
    audioWrong: '/audios/kiss5.wav'
  },
  {
    id: 3,
    question: 'Date we proposed on the bus?',
    options: ['February 4, 2025', 'February 5, 2025', 'February 6, 2025', 'February 7, 2025', 'February 8, 2025'],
    correct: [3], // D is correct (index 3)
    correctText: 'You know, because i said to you yesterday 💬',
    wrongText: "ayyyeee! Dont even know our anniversary?? 😱",
    audioCorrect: '/audios/kiss1.wav',
    audioWrong: '/audios/kiss3.wav'
  },
  {
    id: 4,
    question: 'wanna meet on 19th february?',
    options: ['No'],
    correct: [0],
    correctText: 'yaya, obedient girl 🫶',
    audioCorrect: '/audios/kiss5.wav'
  },
  {
    id: 5,
    question: 'who has more good looks?',
    options: ['me (niyas)', 'you (shahar)'],
    correct: [0],
    correctText: 'Obviously😎',
    audioCorrect: '/audios/kissme.mp3'
  }
];

// Removed sound-on-click: no audio playback on quiz button clicks

const Quiz = ({ onComplete }) => {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [okToContinue, setOkToContinue] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false); // for Q2 reveal
  const moveBtnRef = useRef(null);
  const [btnPos, setBtnPos] = useState({ left: '50%', top: '50%' });
  const movingInterval = useRef(null);

  const q = questions[current];

  useEffect(() => {
    // reset per question
    setSelected(null);
    setFeedback('');
    setOkToContinue(false);
    setShowAnswers(false);
    if (current === 4) startMoving();
    else stopMoving();
    return () => stopMoving();
  }, [current]);

  function startMoving() {
    stopMoving();
    movingInterval.current = setInterval(() => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      // keep within viewport margins
      const left = Math.max(5, Math.random() * (vw - 120));
      const top = Math.max(100, Math.random() * (vh - 240));
      setBtnPos({ left: `${left}px`, top: `${top}px` });
    }, 300);
  }

  function stopMoving() {
    if (movingInterval.current) {
      clearInterval(movingInterval.current);
      movingInterval.current = null;
    }
  }

  const handleOption = (idx) => {
    // For q5, option 1 (index 1) should be impossible to click; ignore clicks
    if (current === 4 && idx === 1) {
      // evasive button: show teasing feedback without sound
      setFeedback('Nope! Try catching me 😜');
      return;
    }
    // Special behavior for question 2: reveal ticks/cross for all options when any clicked
    if (current === 1) {
      setSelected(idx);
      setShowAnswers(true);
      const isCorrect = q.correct.includes(idx);
      setOkToContinue(isCorrect);
      return;
    }

    const isCorrect = q.correct.includes(idx);
    setSelected(idx);

    if (isCorrect) {
      setFeedback(q.correctText);
      setOkToContinue(true);
    } else {
      setFeedback(q.wrongText || 'Try again');
      setOkToContinue(false);
    }
  };

  const handleContinue = () => {
    if (!okToContinue) return;
    if (current < questions.length - 1) setCurrent((c) => c + 1);
    else onComplete();
  };

  return (
    <div style={{
      padding: 16,
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #fffaf0 0%, #fff2cc 100%)'
    }}>
      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}
          style={{
            width: '92%',
            maxWidth: 420,
            background: 'white',
            borderRadius: 16,
            padding: 18,
            boxShadow: '0 10px 30px rgba(0,0,0,0.12)'
          }}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ color: '#888' }}>Question {current + 1}/{questions.length}</div>
            <Award size={18} color="#f0a500" />
          </div>

          <h3 style={{ margin: 0, marginBottom: 12, fontSize: '1.2rem' }}>{q.question}</h3>

          <div style={{ position: 'relative', minHeight: 120 }}>
            {/* Render options differently for question 5 */}
            {q.options.map((opt, i) => {
              if (current === 4 && i === 1) {
                // moving evasive button
                return (
                  <motion.button
                    key={i}
                    ref={moveBtnRef}
                    onClick={() => handleOption(i)}
                    style={{
                      position: 'absolute',
                      left: btnPos.left,
                      top: btnPos.top,
                      transform: 'translate(-50%, -50%)',
                      padding: '10px 14px',
                      borderRadius: 12,
                      border: '2px solid #ffdca8',
                      background: '#fff8e6',
                      fontWeight: '700',
                      cursor: 'pointer'
                    }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {opt}
                  </motion.button>
                );
              }

              // Common rendering
              return (
                <motion.button key={i} onClick={() => handleOption(i)} whileTap={{ scale: 0.98 }} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  padding: '12px 14px',
                  marginBottom: 10,
                  borderRadius: 12,
                  border: '2px solid #f0e6d6',
                  background: selected === i ? '#fff2cc' : '#fff9f0',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}>{opt}
                  {/* Icons for question 2 reveal */}
                  {current === 1 && showAnswers && (
                    (i === 0 || i === 1) ? <Check size={18} color="#128a4b" /> : <X size={18} color="#b31b1b" />
                  )}
                  {/* only show icons for question 2 (reveal). other questions use feedback area */}
                </motion.button>
              );
            })}
          </div>

          {/* Feedback area */}
          <div style={{ minHeight: 48 }}>
            {/* For question 3 (index 2) display gifs instead of text feedback */}
            {current === 2 && selected !== null ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 8, display: 'flex', justifyContent: 'center' }}>
                <img src={okToContinue ? '/images/kiss.gif' : '/images/kick.gif'} alt={okToContinue ? 'kiss' : 'kick'} style={{ width: 160, height: 120, objectFit: 'cover', borderRadius: 10 }} />
              </motion.div>
            ) : (
              feedback && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ marginTop: 8, padding: 10, borderRadius: 10, background: okToContinue ? '#e6ffef' : '#fff0f0', color: okToContinue ? '#0b6b3a' : '#7a1b1b', fontWeight: 700 }}>
                  <div style={{ fontSize: 18 }}>{okToContinue ? '🎉' : '🙈'} <span style={{ marginLeft: 8, fontWeight: 800 }}>{feedback}</span></div>
                </motion.div>
              )
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
            <button onClick={handleContinue} disabled={!okToContinue} style={{ padding: '10px 14px', borderRadius: 10, border: 'none', background: okToContinue ? 'linear-gradient(90deg,#FFD259,#FFB74D)' : '#eee', color: okToContinue ? '#3a2a0a' : '#999', fontWeight: 800, cursor: okToContinue ? 'pointer' : 'default' }}>
              Continue
            </button>
          </div>

        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
