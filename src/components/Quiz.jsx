import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { quizData } from '../data/storyData';
import { Check, X, Award } from 'lucide-react';

const Quiz = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null); // true, false, or null

  const handleOptionClick = (index) => {
    if (selectedOption !== null) return; // Prevent multiple clicks

    setSelectedOption(index);
    const correctIndex = quizData[currentQuestion].correct;

    if (index === correctIndex) {
      setIsCorrect(true);
      setTimeout(() => {
        handleNext();
      }, 1500);
    } else {
      setIsCorrect(false);
      // Allow retry? Or just move on? Let's allow retry or just show correct answer.
      // For a fun app, let's just show feedback and move on after a delay.
      setTimeout(() => {
        handleNext();
      }, 2000);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedOption(null);
      setIsCorrect(null);
    } else {
      onComplete();
    }
  };

  const question = quizData[currentQuestion];

  return (
    <div className="quiz-container" style={{
      padding: '20px',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #fff0f3 0%, #ffccd5 100%)'
    }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.3 }}
          style={{
            background: 'white',
            padding: '25px',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center'
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '20px',
            color: '#888'
          }}>
            <span>Question {currentQuestion + 1}/{quizData.length}</span>
            <Award size={20} color="var(--color-primary)" />
          </div>

          <h3 style={{
            fontSize: '1.4rem',
            color: 'var(--color-text)',
            marginBottom: '25px',
            fontFamily: 'var(--font-heading)'
          }}>
            {question.question}
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {question.options.map((option, index) => {
              let backgroundColor = '#f8f9fa';
              let borderColor = '#e9ecef';
              let textColor = '#495057';

              if (selectedOption !== null) {
                if (index === question.correct) {
                  backgroundColor = '#d4edda'; // Green
                  borderColor = '#c3e6cb';
                  textColor = '#155724';
                } else if (index === selectedOption) {
                  backgroundColor = '#f8d7da'; // Red
                  borderColor = '#f5c6cb';
                  textColor = '#721c24';
                }
              }

              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: selectedOption === null ? 1.02 : 1 }}
                  whileTap={{ scale: selectedOption === null ? 0.98 : 1 }}
                  onClick={() => handleOptionClick(index)}
                  style={{
                    padding: '15px',
                    borderRadius: '10px',
                    border: `2px solid ${borderColor}`,
                    background: backgroundColor,
                    color: textColor,
                    fontSize: '1rem',
                    cursor: selectedOption === null ? 'pointer' : 'default',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 'bold',
                    transition: 'all 0.3s ease',
                    position: 'relative'
                  }}
                >
                  {option}
                  {selectedOption !== null && index === question.correct && (
                    <Check size={18} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                  )}
                  {selectedOption !== null && index === selectedOption && index !== question.correct && (
                    <X size={18} style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                  )}
                </motion.button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: '20px',
                padding: '10px',
                borderRadius: '10px',
                background: isCorrect ? '#d4edda' : '#f8d7da',
                color: isCorrect ? '#155724' : '#721c24',
                fontWeight: 'bold'
              }}
            >
              {isCorrect ? "Yay! Correct! 🎉" : "Oops! Not quite. 😅"}
              <div style={{ fontSize: '0.9rem', marginTop: '5px', fontWeight: 'normal' }}>
                {question.feedback}
              </div>
            </motion.div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Quiz;
