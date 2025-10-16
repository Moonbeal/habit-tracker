// pages/HabitsPage.jsx - Сторінка зі звичками
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X } from 'lucide-react';
import HabitCard from '../components/HabitCard';
import AddHabitForm from '../components/AddHabitForm';
import CalendarView from '../components/CalendarView';
import useLocalStorage from '../hooks/useLocalStorage';

const HabitsPage = () => {
  const [habits, setHabits] = useLocalStorage('habits', []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [motivationalMessage, setMotivationalMessage] = useState('');

  // Функція для додавання нової звички
  const handleAddHabit = (habit) => {
    setHabits([...habits, habit]);
    setShowAddForm(false);
    setMotivationalMessage('Перша звичка створена! 💫');
    setTimeout(() => setMotivationalMessage(''), 3000);
  };

  // Функція для відмітки виконання звички
  const handleToggleComplete = (habitId) => {
    const today = new Date().toISOString().split('T')[0];
    
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDays.includes(today);
        let newCompletedDays;
        
        if (isCompleted) {
          // Видаляємо відмітку
          newCompletedDays = habit.completedDays.filter(day => day !== today);
        } else {
          // Додаємо відмітку
          newCompletedDays = [...habit.completedDays, today].sort();
        }
        
        // Підрахунок серії
        const { currentStreak, bestStreak } = calculateStreaks(newCompletedDays);
        
        // Мотиваційне повідомлення
        if (!isCompleted) {
          if (currentStreak === 1) setMotivationalMessage('Перший день — чудово 💫');
          else if (currentStreak === 5) setMotivationalMessage('5 днів підряд — гарний старт! 🌟');
          else if (currentStreak === 7) setMotivationalMessage('Тиждень стабільності 💪');
          else if (currentStreak === 30) setMotivationalMessage('30 днів — ви легенда 🔥');
          else if (currentStreak === 100) setMotivationalMessage('100 виконань — неймовірно! 🏆');
          
          setTimeout(() => setMotivationalMessage(''), 3000);
        }
        
        return {
          ...habit,
          completedDays: newCompletedDays,
          currentStreak,
          bestStreak: Math.max(bestStreak, habit.bestStreak)
        };
      }
      return habit;
    }));
  };

  // Функція для видалення звички
  const handleDeleteHabit = (habitId) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
    setSelectedHabit(null);
  };

  // Підрахунок серій днів
  const calculateStreaks = (completedDays) => {
    if (completedDays.length === 0) return { currentStreak: 0, bestStreak: 0 };
    
    const sortedDays = completedDays.sort().reverse();
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 1;
    
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (sortedDays[0] === todayStr || sortedDays[0] === yesterdayStr) {
      currentStreak = 1;
      
      for (let i = 1; i < sortedDays.length; i++) {
        const current = new Date(sortedDays[i - 1]);
        const previous = new Date(sortedDays[i]);
        const diffDays = Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          currentStreak++;
        } else {
          break;
        }
      }
    }
    
    // Підрахунок найкращої серії
    for (let i = 1; i < sortedDays.length; i++) {
      const current = new Date(sortedDays[i - 1]);
      const previous = new Date(sortedDays[i]);
      const diffDays = Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        tempStreak++;
      } else {
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 1;
      }
    }
    bestStreak = Math.max(bestStreak, tempStreak);
    
    return { currentStreak, bestStreak };
  };

  return (
    <div className='py-6'>
      {/* Заголовок */}
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-3xl font-bold text-purple-900'>Мої звички</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddForm(true)}
          className='bg-purple-500 text-white p-3 rounded-full shadow-lg hover:bg-purple-600 transition-colors'
        >
          <Plus size={24} />
        </motion.button>
      </div>

      {/* Мотиваційне повідомлення */}
      <AnimatePresence>
        {motivationalMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='bg-purple-100 border-l-4 border-purple-500 p-4 mb-4 rounded-lg'
          >
            <p className='text-purple-900 font-semibold'>{motivationalMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Список звичок */}
      {habits.length === 0 ? (
        <div className='text-center py-12'>
          <p className='text-purple-600 text-lg'>Поки що немає звичок. Додайте першу!</p>
        </div>
      ) : (
        <div className='grid grid-cols-1 gap-4'>
          {habits.map((habit, index) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <HabitCard
                habit={habit}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteHabit}
                onClick={() => setSelectedHabit(habit)}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Модальне вікно додавання звички */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className='bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto'
            >
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-2xl font-bold text-purple-900'>Нова звичка</h3>
                <button
                  onClick={() => setShowAddForm(false)}
                  className='text-purple-600 hover:text-purple-800'
                >
                  <X size={24} />
                </button>
              </div>
              <AddHabitForm onAdd={handleAddHabit} onCancel={() => setShowAddForm(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Модальне вікно календаря */}
      <AnimatePresence>
        {selectedHabit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'
            onClick={() => setSelectedHabit(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className='bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto'
            >
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-2xl font-bold text-purple-900'>{selectedHabit.name}</h3>
                <button
                  onClick={() => setSelectedHabit(null)}
                  className='text-purple-600 hover:text-purple-800'
                >
                  <X size={24} />
                </button>
              </div>
              <CalendarView habit={selectedHabit} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HabitsPage;
