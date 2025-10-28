// components/HabitShowcase.jsx - Горизонтальний скрол карток як на лендінгу
import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Book, Droplet, Moon, Coffee, Heart } from 'lucide-react';
import { images } from '../config/images';

const HabitShowcase = ({ onSelectTemplate }) => {
  const showcaseHabits = [
    {
      id: 1,
      title: 'Ранкова',
      subtitle: 'пробіжка',
      icon: Dumbbell,
      image: `url("${images.showcase.running.url}")`,
      description: 'Спорт',
      stats: '30 хв'
    },
    {
      id: 2,
      title: 'Медитація',
      subtitle: 'щодня',
      icon: Moon,
      image: `url("${images.showcase.meditation.url}")`,
      description: 'Особисте',
      stats: '10 хв'
    },
    {
      id: 3,
      title: 'Читання',
      subtitle: 'книжок',
      icon: Book,
      image: `url("${images.showcase.reading.url}")`,
      description: 'Навчання',
      stats: '20 стор'
    },
    {
      id: 4,
      title: 'Вода',
      subtitle: 'щодня',
      icon: Droplet,
      image: `url("${images.showcase.water.url}")`,
      description: 'Здоров\'я',
      stats: '8 склянок'
    },
    {
      id: 5,
      title: 'Вдячність',
      subtitle: 'щодня',
      icon: Heart,
      image: `url("${images.showcase.gratitude.url}")`,
      description: 'Особисте',
      stats: '3 речі'
    },
  ];

  return (
    <div className='w-full mb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className='text-center mb-10 md:mb-14'
      >
        <div className='inline-block mb-2 px-4 py-1.5 rounded-full bg-red-100 text-red-800 text-sm font-medium'>
          Популярне
        </div>
        <h2 className='text-3xl sm:text-4xl md:text-5xl font-black mb-3 text-gray-900 dark:text-white'>
          Популярні звички
        </h2>
        <p className='text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
          Обери готовий шаблон або створи свій власний
        </p>
      </motion.div>

      {/* Горизонтальний скрол */}
      <div className='relative'>
        <div className='flex gap-4 sm:gap-6 pb-6 overflow-x-auto scrollbar-hide px-1 py-2 -mx-4 sm:mx-0'>
          {showcaseHabits.map((habit, index) => {
            const Icon = habit.icon;
            return (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '0px 0px -100px 0px' }}
                transition={{ delay: Math.min(index * 0.1, 0.4) }}
                whileHover={{ y: -8 }}
                className='flex-shrink-0 w-64 sm:w-72 h-80 sm:h-96 rounded-xl sm:rounded-2xl overflow-hidden relative group cursor-pointer transition-all duration-300 hover:shadow-lg border border-gray-200 dark:border-gray-700/50'
                style={{ backgroundImage: habit.image, backgroundSize: 'cover', backgroundPosition: 'center' }}
                onClick={() => onSelectTemplate && onSelectTemplate(habit)}
              >
                {/* Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent' />
                
                {/* Контент */}
                <div className='relative h-full flex flex-col justify-between p-5 sm:p-6'>
                  {/* Іконка зверху */}
                  <div className='flex justify-between items-start'>
                    <div className='w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center'>
                      <Icon className='text-white' size={20} />
                    </div>
                    <div className='px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-xs sm:text-sm font-medium'>
                      {habit.stats}
                    </div>
                  </div>

                  {/* Текст внизу */}
                  <div className='mt-auto'>
                    <div className='text-white text-2xl sm:text-3xl font-black mb-1 sm:mb-2 leading-tight'>
                      {habit.title}
                    </div>
                    <div className='text-white/90 text-lg sm:text-xl font-light mb-2 sm:mb-3'>
                      {habit.subtitle}
                    </div>
                    <div className='text-white/70 text-sm'>
                      {habit.description}
                    </div>
                  </div>

                  {/* Кнопка при hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className='absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity'
                  >
                    <button 
                      className='bg-white text-red-600 hover:bg-red-50 px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105'
                      onClick={() => onSelectTemplate && onSelectTemplate(habit)}
                    >
                      Обрати
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Індикатор скролу для мобільних пристроїв */}
        <div className='w-full flex justify-center mt-4 md:hidden'>
          <div className='h-1.5 w-24 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden'>
            <div className='h-full w-1/2 bg-red-500 rounded-full animate-pulse'></div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default HabitShowcase;
