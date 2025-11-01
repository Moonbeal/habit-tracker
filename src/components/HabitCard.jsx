// components/HabitCard.jsx - Картка звички
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Trash2, Calendar, Flame, Edit } from 'lucide-react';

const HabitCard = ({ habit, onToggleComplete, onDelete, onEdit, onClick }) => {
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
    // ❗️ ЗМІНА:
    // - Ми прибираємо whileHover, оскільки 'card-3d' з вашого CSS дає кращий ефект
    // - Додано h-full для однакової висоти (вимагає 'h-full' у motion.div у HabitsPage.jsx)
    // - Додано flex flex-col для правильної внутрішньої верстки
    // - Додано 'shadow-purple'
    // - Додано isCompletedToday ? 'pulse-glow' : '' для ефекту сяйва
    <motion.div
      className={`glass-card glass-hover rounded-2xl p-5 shadow-purple transition-all relative overflow-hidden h-full flex flex-col card-3d ${
        isCompletedToday ? 'pulse-glow' : ''
      }`}
    >
      {/* Градієнтна лінія зліва */}
      <div 
        className='absolute left-0 top-0 bottom-0 w-1'
        style={{ 
          background: `linear-gradient(to bottom, ${habit.color}, ${habit.color}dd)` 
        }}
      />

      <div className='relative flex-1 flex flex-col justify-between'>
          <div className='flex items-start justify-between mb-3'>
            <div className='flex-1 pr-2'>
              <div className='flex items-center gap-2 mb-1'>
                {/* ❗️ ЗМІНА: Додано клас habit-card-emoji */}
                <span className='habit-card-emoji'>{categoryEmojis[habit.category]}</span>
                {/* ❗️ ЗМІНА: Додано клас habit-card-title */}
                <h3 className='font-bold text-purple-900 dark:text-purple-100 habit-card-title'>{habit.name}</h3>
              </div>
              {/* ❗️ ЗМІНА: Додано клас habit-card-text */}
              <p className='text-purple-600 dark:text-purple-400 mb-1 habit-card-text'>{categoryNames[habit.category]}</p>
              {habit.description && (
                <p className='text-gray-600 dark:text-gray-400 habit-card-text'>{habit.description}</p>
              )}
            </div>
            
            <div className='flex flex-col sm:flex-row gap-2'>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete(habit.id);
                }}
                className={`p-2 rounded-full transition-all ${
                  isCompletedToday
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg'
                    : 'glass text-purple-600 dark:text-purple-400 hover:scale-110'
                }`}
            	>
            	   {isCompletedToday ? <CheckCircle2 size={24} /> : <Circle size={24} />}
            	</motion.button>
              
            	<motion.button
            	   whileHover={{ scale: 1.1 }}
            	   whileTap={{ scale: 0.9 }}
            	   onClick={(e) => {
            	     e.stopPropagation();
            	     onEdit(habit);
            	   }}
            	   className='p-2 rounded-full glass text-purple-600 dark:text-purple-400 hover:scale-110 transition-transform'
            	>
            	   <Edit size={20} />
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
            	   className='p-2 rounded-full glass text-red-600 dark:text-red-400 hover:scale-110 transition-transform'
            	>
            	   <Trash2 size={20} />
            	</motion.button>
            </div>
          </div>

          {/* Статистика */}
          <div className='grid grid-cols-3 gap-3 mb-3'>
            <div className='glass rounded-xl p-3 text-center hover:scale-105 transition-transform cursor-pointer'>
              <div className='flex items-center justify-center gap-1 mb-1'>
                <Flame size={16} className='text-orange-500' />
                <span className='text-xs text-purple-600 dark:text-purple-400'>Серія</span>
              </div>
              <p className='text-lg font-bold text-purple-900 dark:text-purple-100'>{habit.currentStreak}</p>
            </div>
            
            <div className='glass rounded-xl p-3 text-center hover:scale-105 transition-transform cursor-pointer'>
              <p className='text-xs text-purple-600 dark:text-purple-400 mb-1'>Найкраща</p>
              <p className='text-lg font-bold text-purple-900 dark:text-purple-100'>{habit.bestStreak}</p>
            </div>
            
            <div className='glass rounded-xl p-3 text-center hover:scale-105 transition-transform cursor-pointer'>
              <p className='text-xs text-purple-600 dark:text-purple-400 mb-1'>Всього</p>
    	         <p className='text-lg font-bold text-purple-900 dark:text-purple-100'>{habit.completedDays.length}</p>
            </div>
          </div>

          {/* Останні 7 днів */}
          <div className='flex gap-1 mb-3 habit-card-7days'>
            {last7Days.map((day, index) => {
              const isCompleted = habit.completedDays.includes(day);
              return (
                <div
                  key={index}
                  className={`flex-1 rounded-lg transition-all ${
                    isCompleted 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500 shadow-sm' 
                      : 'glass opacity-30 hover:opacity-50'
                  }`}
                    title={day}
                />
              );
            })}
          </div>

          {/* Прогрес-бар */}
      	 <div className='habit-card-progress'>
            <div className='flex justify-between text-xs text-purple-600 dark:text-purple-400 mb-1'>
              <span>Прогрес</span>
              <span>{Math.round(completionRate)}%</span>
            </div>
            <div className='w-full glass rounded-full h-2.5 overflow-hidden'>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, completionRate)}%` }}
                className='bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 h-2.5 rounded-full shadow-glow'
              />
            </div>
          </div>
        </div>

       {/* Кнопка календаря */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className='w-full flex items-center justify-center gap-2 glass glass-hover text-purple-700 dark:text-purple-300 py-2.5 rounded-xl font-medium transition-all hover:shadow-md'
      >
        <Calendar size={16} />
        <span className='text-sm font-medium'>Переглянути календар</span>
      </motion.button>
    </motion.div>
  );
};

export default HabitCard;