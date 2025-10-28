// components/ConfettiEffect.jsx - Ефект конфетті при виконанні
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfettiEffect = ({ trigger }) => {
  const [confetti, setConfetti] = useState([]);

  useEffect(() => {
    if (trigger) {
      const newConfetti = Array.from({ length: 50 }, (_, i) => ({
        id: Date.now() + i,
        x: Math.random() * window.innerWidth,
        y: -20,
        rotation: Math.random() * 360,
        color: ['#a855f7', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'][Math.floor(Math.random() * 6)],
        size: Math.random() * 10 + 5,
        delay: Math.random() * 0.3,
      }));
      
      setConfetti(newConfetti);
      
      setTimeout(() => {
        setConfetti([]);
      }, 3000);
    }
  }, [trigger]);

  return (
    <div className='fixed inset-0 pointer-events-none z-50'>
      <AnimatePresence>
        {confetti.map((piece) => (
          <motion.div
            key={piece.id}
            className='absolute'
            style={{
              left: piece.x,
              top: piece.y,
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              borderRadius: Math.random() > 0.5 ? '50%' : '0%',
            }}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{
              y: window.innerHeight + 100,
              x: piece.x + (Math.random() - 0.5) * 200,
              rotate: piece.rotation + 720,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random(),
              delay: piece.delay,
              ease: 'easeIn',
            }}
            exit={{ opacity: 0 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ConfettiEffect;
