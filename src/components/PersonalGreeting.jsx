// components/PersonalGreeting.jsx - Персоналізоване привітання
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Sun, Moon, Coffee, Sunset } from 'lucide-react';

const PersonalGreeting = ({ habits }) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const hour = currentTime.getHours();
  const today = new Date().toISOString().split('T')[0];
  
  // Визначаємо час доби
  const getTimeOfDay = () => {
    if (hour >= 5 && hour < 12) return 'morning';
    if (hour >= 12 && hour < 17) return 'afternoon';
    if (hour >= 17 && hour < 22) return 'evening';
    return 'night';
  };

  const timeOfDay = getTimeOfDay();

  // Привітання залежно від часу
  const greetings = {
    morning: {
      text: 'Доброго ранку',
      emoji: '🌅',
      icon: Sun,
      color: 'from-orange-400 to-yellow-400',
      message: 'Новий день — нові можливості!'
    },
    afternoon: {
      text: 'Добрий день',
      emoji: '☀️',
      icon: Coffee,
      color: 'from-blue-400 to-cyan-400',
      message: 'Продовжуй в тому ж дусі!'
    },
    evening: {
      text: 'Добрий вечір',
      emoji: '🌆',
      icon: Sunset,
      color: 'from-purple-400 to-pink-400',
      message: 'Час підбити підсумки дня'
    },
    night: {
      text: 'Доброї ночі',
      emoji: '🌙',
      icon: Moon,
      color: 'from-indigo-400 to-purple-400',
      message: 'Відпочинь і готуйся до нового дня'
    }
  };

  const greeting = greetings[timeOfDay];
  const Icon = greeting.icon;

  // Статистика
  const totalHabits = habits.length;
  const completedToday = habits.filter(h => 
    h.completedDays?.includes(today)
  ).length;
  const currentStreaks = habits.reduce((sum, h) => sum + (h.currentStreak || 0), 0);
  const bestStreak = Math.max(...habits.map(h => h.bestStreak || 0), 0);

  // Мотиваційні повідомлення
  const getMotivationalMessage = () => {
    if (totalHabits === 0) {
      return 'Почни свій шлях до кращого себе! 🚀';
    }
    
    const progress = totalHabits > 0 ? (completedToday / totalHabits) * 100 : 0;
    
    if (progress === 100) {
      return 'Ти неймовірний! Всі звички виконано! 🎉';
    } else if (progress >= 75) {
      return 'Чудова робота! Ще трохи до ідеального дня! 💪';
    } else if (progress >= 50) {
      return 'Ти на правильному шляху! Продовжуй! ⭐';
    } else if (progress > 0) {
      return 'Гарний початок! Не зупиняйся! 🔥';
    } else if (timeOfDay === 'morning') {
      return 'Почни день з першої звички! ☕';
    } else if (timeOfDay === 'evening') {
      return 'Ще є час виконати свої звички! 🌟';
    } else {
      return greeting.message;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className='w-full max-w-4xl mb-8 card-3d'
    >
      <div className='glass-card rounded-3xl p-8 shadow-purple pulse-glow relative overflow-hidden group cursor-pointer'>
        {/* Декоративний градієнт */}
        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${greeting.color} opacity-10 blur-3xl rounded-full`} />
        
        <div className='relative z-10'>
          {/* Привітання */}
          <div className='flex items-start justify-between mb-6'>
            <div className='flex-1'>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
                className='inline-block mb-2'
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${greeting.color} flex items-center justify-center shadow-lg`}>
                  <Icon className='text-white' size={32} />
                </div>
              </motion.div>
              
              <h1 className='text-4xl md:text-6xl font-black text-gradient-purple mb-2 neon-glow'>
                {greeting.text}! 👋
              </h1>
              
              <p className='text-xl md:text-2xl font-semibold text-purple-600 dark:text-purple-300 mb-4'>
                {getMotivationalMessage()}
              </p>

              {/* Час */}
              <div className='flex items-center gap-2 text-purple-500 dark:text-purple-400'>
                <Sparkles size={16} className='animate-pulse-slow' />
                <span className='text-sm font-medium'>
                  {currentTime.toLocaleDateString('uk-UA', { 
                    weekday: 'long', 
                    day: 'numeric', 
                    month: 'long' 
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Швидка статистика */}
          {totalHabits > 0 && (
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
              <motion.div
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className='glass rounded-xl p-4 text-center cursor-pointer card-3d'
              >
                <div className='text-3xl md:text-4xl font-black text-gradient-purple'>
                  {completedToday}/{totalHabits}
                </div>
                <div className='text-sm text-purple-600 dark:text-purple-400 mt-1'>
                  Сьогодні
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className='glass rounded-xl p-4 text-center cursor-pointer card-3d'
              >
                <div className='text-3xl md:text-4xl font-black flex items-center justify-center gap-1 animate-bounce-slow'>
                  🔥 <span className='text-gradient' style={{background: 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>{currentStreaks}</span>
                </div>
                <div className='text-sm font-medium text-purple-600 dark:text-purple-400 mt-1'>
                  Активні серії
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className='glass rounded-xl p-4 text-center cursor-pointer card-3d'
              >
                <div className='text-3xl md:text-4xl font-black' style={{background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                  {bestStreak}
                </div>
                <div className='text-sm font-medium text-purple-600 dark:text-purple-400 mt-1'>
                  Рекорд
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className='glass rounded-xl p-4 text-center cursor-pointer card-3d'
              >
                <div className='text-3xl md:text-4xl font-black' style={{background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                  {Math.round((completedToday / totalHabits) * 100)}%
                </div>
                <div className='text-sm font-medium text-purple-600 dark:text-purple-400 mt-1'>
                  Прогрес
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PersonalGreeting;
