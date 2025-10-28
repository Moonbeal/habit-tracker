// components/TodayProgress.jsx - Прогрес сьогоднішнього дня
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Flame } from 'lucide-react';
import ConfettiEffect from './ConfettiEffect';

const TodayProgress = ({ habits, onToggleComplete }) => {
  const [showConfetti, setShowConfetti] = useState(0);
  const today = new Date().toISOString().split('T')[0];
  const todayHabits = habits.filter(h => h.completedDays?.includes(today) || !h.completedDays?.includes(today));
  const completed = habits.filter(h => h.completedDays?.includes(today)).length;
  const total = habits.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  const handleToggle = (habitId) => {
    onToggleComplete(habitId);
    setShowConfetti(prev => prev + 1);
  };

  // Групування по часу дня
  const getTimeOfDay = (habit) => {
    // Можна додати поле timeOfDay до звички, поки що розподіляємо рівномірно
    const index = habits.indexOf(habit);
    if (index < habits.length / 3) return 'morning';
    if (index < (habits.length * 2) / 3) return 'day';
    return 'evening';
  };

  const morningHabits = habits.filter(h => getTimeOfDay(h) === 'morning');
  const dayHabits = habits.filter(h => getTimeOfDay(h) === 'day');
  const eveningHabits = habits.filter(h => getTimeOfDay(h) === 'evening');

  const timeGroups = [
    { 
      title: 'Ранок', 
      emoji: '🌅', 
      habits: morningHabits,
      color: 'from-orange-400 to-yellow-400'
    },
    { 
      title: 'День', 
      emoji: '☀️', 
      habits: dayHabits,
      color: 'from-blue-400 to-cyan-400'
    },
    { 
      title: 'Вечір', 
      emoji: '🌙', 
      habits: eveningHabits,
      color: 'from-purple-400 to-indigo-400'
    },
  ];

  const HabitItem = ({ habit }) => {
    const isCompleted = habit.completedDays?.includes(today);
    
    return (
      <motion.button
        whileHover={{ scale: 1.02, x: 4 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => handleToggle(habit.id)}
        className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
          isCompleted 
            ? 'glass-card border-l-4 border-green-500' 
            : 'glass hover:glass-hover border-l-4 border-purple-300 dark:border-purple-700'
        }`}
      >
        <motion.div
          animate={isCompleted ? { scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          {isCompleted ? (
            <CheckCircle2 className='text-green-500' size={24} />
          ) : (
            <Circle className='text-purple-400' size={24} />
          )}
        </motion.div>
        
        <div className='flex-1 text-left'>
          <p className={`font-medium ${
            isCompleted 
              ? 'text-gray-500 dark:text-gray-400 line-through' 
              : 'text-purple-900 dark:text-purple-100'
          }`}>
            {habit.name}
          </p>
          {habit.currentStreak > 0 && (
            <div className='flex items-center gap-1 text-xs text-orange-500'>
              <Flame size={12} />
              <span>{habit.currentStreak} днів</span>
            </div>
          )}
        </div>

        {!isCompleted && (
          <Clock className='text-purple-400' size={16} />
        )}
      </motion.button>
    );
  };

  if (habits.length === 0) {
    return null;
  }

  return (
    <div className='w-full max-w-4xl'>
      <ConfettiEffect trigger={showConfetti} />
      {/* Загальний прогрес */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='glass-card rounded-2xl p-6 mb-6 shadow-purple'
      >
        <div className='flex items-center justify-between mb-4'>
          <div>
            <h3 className='text-2xl md:text-3xl font-black text-gradient-purple'>
              Твій прогрес сьогодні
            </h3>
            <p className='text-purple-600 dark:text-purple-400'>
              {completed} з {total} звичок виконано
            </p>
          </div>
          <div className='text-4xl font-bold text-purple-500'>
            {Math.round(progress)}%
          </div>
        </div>

        {/* Прогрес-бар */}
        <div className='relative h-4 glass rounded-full overflow-hidden'>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className='absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 rounded-full shadow-glow'
          />
        </div>

        {/* Мотиваційне повідомлення */}
        {progress === 100 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className='mt-4 p-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl text-white text-center font-semibold'
          >
            🎉 Вітаю! Всі звички виконано!
          </motion.div>
        )}
        {progress > 0 && progress < 100 && (
          <p className='mt-4 text-center text-purple-600 dark:text-purple-400 text-sm'>
            💪 Ще трохи! Ти майже на фінішній прямій
          </p>
        )}
        {progress === 0 && (
          <p className='mt-4 text-center text-purple-600 dark:text-purple-400 text-sm'>
            🚀 Почни свій день з першої звички!
          </p>
        )}
      </motion.div>

      {/* Timeline по часу дня */}
      <div className='space-y-4'>
        {timeGroups.map((group, groupIndex) => {
          if (group.habits.length === 0) return null;
          
          const groupCompleted = group.habits.filter(h => 
            h.completedDays?.includes(today)
          ).length;
          const groupTotal = group.habits.length;

          return (
            <motion.div
              key={group.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: groupIndex * 0.1 }}
              className='glass-card rounded-2xl p-5'
            >
              <div className='flex items-center gap-3 mb-4'>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${group.color} flex items-center justify-center text-2xl`}>
                  {group.emoji}
                </div>
                <div className='flex-1'>
                  <h4 className='text-lg font-bold text-purple-900 dark:text-purple-100'>
                    {group.title}
                  </h4>
                  <p className='text-sm text-purple-600 dark:text-purple-400'>
                    {groupCompleted}/{groupTotal} виконано
                  </p>
                </div>
                <div className='text-2xl'>
                  {groupCompleted === groupTotal ? '✅' : '⏳'}
                </div>
              </div>

              <div className='space-y-2'>
                {group.habits.map((habit, index) => (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: groupIndex * 0.1 + index * 0.05 }}
                  >
                    <HabitItem habit={habit} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TodayProgress;
