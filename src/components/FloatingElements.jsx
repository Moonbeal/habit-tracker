// components/FloatingElements.jsx - Декоративні floating елементи
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Star, Zap, Heart, Target, TrendingUp } from 'lucide-react';

const FloatingElements = () => {
  const elements = [
    { Icon: Sparkles, color: 'text-purple-400', size: 32, delay: 0, duration: 8 },
    { Icon: Star, color: 'text-pink-400', size: 24, delay: 1, duration: 10 },
    { Icon: Zap, color: 'text-yellow-400', size: 28, delay: 2, duration: 9 },
    { Icon: Heart, color: 'text-red-400', size: 26, delay: 0.5, duration: 11 },
    { Icon: Target, color: 'text-blue-400', size: 30, delay: 1.5, duration: 7 },
    { Icon: TrendingUp, color: 'text-green-400', size: 28, delay: 2.5, duration: 12 },
  ];

  const positions = [
    { top: '10%', left: '5%' },
    { top: '20%', right: '10%' },
    { top: '40%', left: '8%' },
    { top: '60%', right: '5%' },
    { top: '75%', left: '12%' },
    { top: '85%', right: '15%' },
  ];

  return (
    <div className='fixed inset-0 pointer-events-none z-0 overflow-hidden'>
      {elements.map((element, index) => {
        const Icon = element.Icon;
        const position = positions[index];
        
        return (
          <motion.div
            key={index}
            className={`absolute ${element.color} opacity-20 dark:opacity-10`}
            style={position}
            animate={{
              y: [0, -30, 0],
              x: [0, 15, 0],
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              delay: element.delay,
              ease: 'easeInOut',
            }}
          >
            <Icon size={element.size} />
          </motion.div>
        );
      })}

      {/* Додаткові круги */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`circle-${i}`}
          className='absolute rounded-full'
          style={{
            width: 100 + i * 50,
            height: 100 + i * 50,
            top: `${10 + i * 15}%`,
            left: `${5 + i * 18}%`,
            background: `radial-gradient(circle, rgba(168, 85, 247, 0.1) 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.1, 0.3],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
};

export default FloatingElements;
