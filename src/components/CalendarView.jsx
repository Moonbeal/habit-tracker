// components/CalendarView.jsx - Календар виконань звички
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarView = ({ habit }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const monthNames = [
    'Січень', 'Лютий', 'Березень', 'Квітень', 'Травень', 'Червень',
    'Липень', 'Серпень', 'Вересень', 'Жовтень', 'Листопад', 'Грудень'
  ];

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    let firstDayOfWeek = firstDay.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const days = [];
    
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
  
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const nextMonth = () => {
    const today = new Date();
    const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1);
    if (next <= today) {
      setCurrentMonth(next);
    }
  };

  const isCompleted = (date) => {
    if (!date) return false;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;
    return habit.completedDays.includes(dateStr);
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isFuture = (date) => {
    if (!date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  return (
    <div>
      {/* Навігація по місяцях */}
      <div className='flex items-center justify-between mb-6'>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={previousMonth}
          className='p-2 rounded-lg hover:bg-purple-100 text-purple-600'
        >
          <ChevronLeft size={24} />
        </motion.button>
        
        <h4 className='text-lg font-semibold text-purple-900'>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h4>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={nextMonth}
          className='p-2 rounded-lg hover:bg-purple-100 text-purple-600'
          disabled={currentMonth.getMonth() === new Date().getMonth() && currentMonth.getFullYear() === new Date().getFullYear()}
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>

      {/* Дні тижня */}
      <div className='grid grid-cols-7 gap-2 mb-2'>
        {weekDays.map((day) => (
          <div key={day} className='text-center text-sm font-medium text-purple-600 py-2'>
            {day}
          </div>
        ))}
      </div>

      {/* Календарна сітка */}
      <div className='grid grid-cols-7 gap-2'>
        {days.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className='aspect-square' />;
          }

          const completed = isCompleted(date);
          const today = isToday(date);
          const future = isFuture(date);

          return (
            <motion.div
              key={index}
              whileHover={!future ? { scale: 1.1 } : {}}
              className={`aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                future
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : completed
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-700 hover:bg-purple-100'
              } ${
                today ? 'ring-2 ring-purple-500 ring-offset-2' : ''
              }`}
            >
              {date.getDate()}
            </motion.div>
          );
        })}
      </div>

      {/* Легенда */}
      <div className='mt-6 flex flex-wrap gap-4 text-sm'>
        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 bg-green-500 rounded' />
          <span className='text-gray-700'>Виконано</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 bg-gray-200 rounded' />
          <span className='text-gray-700'>Не виконано</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 bg-gray-100 rounded' />
          <span className='text-gray-700'>Майбутнє</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-4 h-4 bg-white border-2 border-purple-500 rounded' />
          <span className='text-gray-700'>Сьогодні</span>
        </div>
      </div>

      {/* Статистика */}
      <div className='mt-6 grid grid-cols-3 gap-4'>
        <div className='bg-purple-50 rounded-lg p-3 text-center'>
          <p className='text-2xl font-bold text-purple-900'>{habit.completedDays.length}</p>
          <p className='text-xs text-purple-600'>Всього днів</p>
        </div>
        <div className='bg-purple-50 rounded-lg p-3 text-center'>
          <p className='text-2xl font-bold text-purple-900'>{habit.currentStreak}</p>
          <p className='text-xs text-purple-600'>Поточна серія</p>
        </div>
        <div className='bg-purple-50 rounded-lg p-3 text-center'>
          <p className='text-2xl font-bold text-purple-900'>{habit.bestStreak}</p>
          <p className='text-xs text-purple-600'>Найкраща серія</p>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
