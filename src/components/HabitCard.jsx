// components/HabitCard.jsx - Картка звички
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Trash2, Calendar, Flame } from 'lucide-react';

const HabitCard = ({ habit, onToggleComplete, onDelete, onClick }) => {
  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completedDays.includes(today);
  
  // Іконки категорій
  const categoryEmojis = {
    health: '🏥',
    sport: '⚽',
    study: '📚',
    work: '💼',
    personal: '🌟',
    other: '📌'
  };

  // Назви категорій українською
  const categoryNames = {
    health: 'Здоров\'я',
    sport: 'Спорт',
    study: 'Навчання',
    work: 'Робота',
    personal: 'Особисте',
    other: 'Інше'
  };

  // Прогрес за останні 7 днів
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  const getDaysSinceStart = (startDate) => {
    const start = new Date(startDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(1, diffDays);
  };

  const completionRate = (habit.completedDays.length / Math.max(1, getDaysSinceStart(habit.startDate))) * 100;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className='bg-white rounded-2xl p-5 shadow-md hover:shadow-lg transition-shadow border border-purple-100'
      style={{ borderLeftColor: habit.color, borderLeftWidth: '4px' }}
    >
      <div className='flex items-start justify-between mb-3'>
        <div className='flex-1'>
          <div className='flex items-center gap-2 mb-1'>
            <span className='text-2xl'>{categoryEmojis[habit.category]}</span>
            <h3 className='text-xl font-bold text-purple-900'>{habit.name}</h3>
          </div>
          <p className='text-sm text-purple-600 mb-1'>{categoryNames[habit.category]}</p>
          {habit.description && (
            <p className='text-sm text-gray-600'>{habit.description}</p>
          )}
        </div>
        
        <div className='flex gap-2'>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete(habit.id);
            }}
            className={`p-2 rounded-full transition-colors ${
              isCompletedToday
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-600 hover:bg-purple-100'
            }`}
          >
            {isCompletedToday ? <CheckCircle2 size={24} /> : <Circle size={24} />}
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              if (confirm('Видалити цю звичку?')) {
                onDelete(habit.id);
              }
            }}
            className='p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors'
          >
            <Trash2 size={20} />
          </motion.button>
        </div>
      </div>

      {/* Статистика */}
      <div className='grid grid-cols-3 gap-3 mb-3'>
        <div className='bg-purple-50 rounded-lg p-2 text-center'>
          <div className='flex items-center justify-center gap-1 mb-1'>
            <Flame size={16} className='text-orange-500' />
            <span className='text-xs text-purple-600'>Серія</span>
          </div>
          <p className='text-lg font-bold text-purple-900'>{habit.currentStreak}</p>
        </div>
        
        <div className='bg-purple-50 rounded-lg p-2 text-center'>
          <p className='text-xs text-purple-600 mb-1'>Найкраща</p>
          <p className='text-lg font-bold text-purple-900'>{habit.bestStreak}</p>
        </div>
        
        <div className='bg-purple-50 rounded-lg p-2 text-center'>
          <p className='text-xs text-purple-600 mb-1'>Всього</p>
          <p className='text-lg font-bold text-purple-900'>{habit.completedDays.length}</p>
        </div>
      </div>

      {/* Останні 7 днів */}
      <div className='flex gap-1 mb-3'>
        {last7Days.map((day, index) => {
          const isCompleted = habit.completedDays.includes(day);
          return (
            <div
              key={index}
              className={`flex-1 h-8 rounded transition-colors ${
                isCompleted ? 'bg-green-400' : 'bg-gray-200'
              }`}
              title={day}
            />
          );
        })}
      </div>

      {/* Прогрес-бар */}
      <div className='mb-2'>
        <div className='flex justify-between text-xs text-purple-600 mb-1'>
          <span>Прогрес</span>
          <span>{Math.round(completionRate)}%</span>
        </div>
        <div className='w-full bg-gray-200 rounded-full h-2'>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, completionRate)}%` }}
            className='bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full'
          />
        </div>
      </div>

      {/* Кнопка календаря */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className='w-full flex items-center justify-center gap-2 bg-purple-100 text-purple-700 py-2 rounded-lg hover:bg-purple-200 transition-colors'
      >
        <Calendar size={16} />
        <span className='text-sm font-medium'>Переглянути календар</span>
      </motion.button>
    </motion.div>
  );
};

export default HabitCard;
