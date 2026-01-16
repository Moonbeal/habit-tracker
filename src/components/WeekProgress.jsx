// components/WeekProgress.jsx - Прогрес за тиждень
import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp } from 'lucide-react';

const WeekProgress = ({ habits }) => {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return {
      date: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('uk-UA', { weekday: 'short' }),
      dayNumber: date.getDate(),
      isToday: i === 6
    };
  });

  const weekData = last7Days.map(day => {
    const completed = habits.filter(h => 
      h.completedDays?.includes(day.date)
    ).length;
    const total = habits.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    return {
      ...day,
      completed,
      total,
      percentage
    };
  });

  const avgProgress = weekData.reduce((sum, day) => sum + day.percentage, 0) / 7;

  const bestDay = weekData.reduce((best, day) => 
    day.percentage > best.percentage ? day : best
  , weekData[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className='w-full max-w-4xl glass-card rounded-2xl p-6 shadow-md'
    >
      <div className='flex items-center justify-between mb-6'>
        <div className='flex items-center gap-2'>
          <Calendar className='text-purple-500' size={24} />
          <div>
            <h3 className='text-xl font-bold text-purple-900 dark:text-purple-100'>
              Прогрес тижня
            </h3>
            <p className='text-sm text-purple-600 dark:text-purple-400'>
              Середній прогрес: {Math.round(avgProgress)}%
            </p>
          </div>
        </div>
        
        {bestDay.percentage === 100 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className='flex items-center gap-1 text-green-500 text-sm font-medium'
          >
            <TrendingUp size={16} />
            <span>Ідеальний {bestDay.dayName}!</span>
          </motion.div>
        )}
      </div>

      {/* Візуалізація тижня */}
      <div className='grid grid-cols-7 gap-2'>
        {weekData.map((day, index) => {
          const height = Math.max(day.percentage, 10); 
          
          return (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className='flex flex-col items-center'
            >
              {/* День тижня */}
              <div className={`text-xs font-medium mb-2 ${
                day.isToday 
                  ? 'text-purple-600 dark:text-purple-400' 
                  : 'text-purple-500 dark:text-purple-500'
              }`}>
                {day.dayName}
              </div>

              {/* Стовпчик прогресу */}
              <motion.div
                whileHover={{ scale: 1.1 }}
                className='relative w-full h-32 glass rounded-lg overflow-hidden cursor-pointer group'
              >
                {/* Фон */}
                <div className='absolute inset-0 bg-gradient-to-t from-purple-100 to-transparent dark:from-purple-900/20 opacity-30' />
                
                {/* Прогрес */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${height}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`absolute bottom-0 left-0 right-0 rounded-t-lg ${
                    day.percentage === 100
                      ? 'bg-gradient-to-t from-green-400 to-emerald-500'
                      : day.percentage >= 75
                      ? 'bg-gradient-to-t from-blue-400 to-cyan-500'
                      : day.percentage >= 50
                      ? 'bg-gradient-to-t from-purple-400 to-pink-500'
                      : day.percentage > 0
                      ? 'bg-gradient-to-t from-orange-400 to-yellow-500'
                      : 'bg-gradient-to-t from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700'
                  }`}
                >
                  {/* Відсоток при hover */}
                  <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'>
                    <span className='text-white font-bold text-xs'>
                      {Math.round(day.percentage)}%
                    </span>
                  </div>
                </motion.div>

                {/* Індикатор сьогодні */}
                {day.isToday && (
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className='absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-purple-500'
                  />
                )}
              </motion.div>

              {/* Кількість виконань */}
              <div className='text-xs text-purple-600 dark:text-purple-400 mt-2 font-medium'>
                {day.completed}/{day.total}
              </div>

              {/* Число місяця */}
              <div className='text-xs text-purple-400 dark:text-purple-500'>
                {day.dayNumber}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Легенда */}
      <div className='mt-6 flex flex-wrap gap-4 text-xs'>
        <div className='flex items-center gap-2'>
          <div className='w-3 h-3 rounded bg-gradient-to-r from-green-400 to-emerald-500' />
          <span className='text-purple-600 dark:text-purple-400'>100%</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-3 h-3 rounded bg-gradient-to-r from-blue-400 to-cyan-500' />
          <span className='text-purple-600 dark:text-purple-400'>75-99%</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-3 h-3 rounded bg-gradient-to-r from-purple-400 to-pink-500' />
          <span className='text-purple-600 dark:text-purple-400'>50-74%</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-3 h-3 rounded bg-gradient-to-r from-orange-400 to-yellow-500' />
          <span className='text-purple-600 dark:text-purple-400'>1-49%</span>
        </div>
        <div className='flex items-center gap-2'>
          <div className='w-3 h-3 rounded bg-gray-300 dark:bg-gray-600' />
          <span className='text-purple-600 dark:text-purple-400'>0%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default WeekProgress;
