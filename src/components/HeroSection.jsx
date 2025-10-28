// components/HeroSection.jsx - Hero секція як на лендінгу
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check } from 'lucide-react';
import { images } from '../config/images';

const HeroSection = ({ onGetStarted, onLearnMore }) => {
  return (
    <section className='relative h-auto min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-dark-900 pt-24 pb-16 md:pt-32 md:pb-24'>
      {/* Абстрактний фон */}
      <div className='absolute inset-0 overflow-hidden z-0'>
        <div className='absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-dark-900 dark:via-dark-800 dark:to-dark-900' />
        <div className='absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-red-50 to-transparent dark:from-red-900/10 dark:to-transparent' />
        <div className='absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-red-50 to-transparent dark:from-red-900/10 dark:to-transparent' />
      </div>

      {/* Контент */}
      <div className='container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 max-w-7xl'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className='text-left'
          >
            <motion.span 
              className='inline-block mb-4 px-4 py-1.5 rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-sm font-medium'
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              Новий підхід до звичок
            </motion.span>

            <motion.h1 
              className='text-4xl sm:text-5xl md:text-6xl font-black mb-6 text-gray-900 dark:text-white leading-tight tracking-tight'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Створюй звички,
              <span className='text-red-600 dark:text-red-500 block'>
                які залишаться
              </span>
            </motion.h1>

            <motion.p 
              className='text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-lg'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Простий та ефективний спосіб слідкувати за своїм розвитком. 
              Почни сьогодні та побач реальні результати вже за 21 день.
            </motion.p>

            <motion.div 
              className='flex flex-col sm:flex-row gap-4 mb-12'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <button 
                onClick={onGetStarted}
                className='px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-red-500/30 flex items-center justify-center gap-2'
              >
                <span>Спробувати безкоштовно</span>
                <ArrowRight className='w-5 h-5' />
              </button>
              <button 
                onClick={onLearnMore}
                className='px-6 py-4 bg-transparent border-2 border-gray-200 dark:border-dark-700 hover:border-red-200 dark:hover:border-red-500/30 text-gray-700 dark:text-gray-200 font-medium rounded-xl text-lg transition-all duration-300 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center justify-center gap-2 group'
              >
                <span>Детальніше</span>
                <svg className='w-5 h-5 text-red-600 dark:text-red-400 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 5l7 7-7 7' />
                </svg>
              </button>
            </motion.div>

            <motion.div 
              className='flex flex-wrap gap-6 text-sm text-gray-600 dark:text-gray-400'
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className='flex items-center gap-2'>
                <Check className='w-5 h-5 text-green-500' />
                <span>Безкоштовно назавжди</span>
              </div>
              <div className='flex items-center gap-2'>
                <Check className='w-5 h-5 text-green-500' />
                <span>Без реклами</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Зображення героя */}
          <motion.div 
            className='relative hidden lg:block'
            initial={{ opacity: 0, x: 30, rotate: 2 }}
            animate={{ opacity: 1, x: 0, rotate: 0 }}
            transition={{ delay: 0.5, duration: 0.8, type: 'spring', stiffness: 100 }}
          >
            <div className='relative z-10 rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500'>
              <div className='absolute inset-0 bg-gradient-to-tr from-red-500/10 to-transparent rounded-2xl' />
              <img 
                src={images.hero.mockup} 
                alt='Habit Tracker в дії' 
                className='w-full h-auto object-cover rounded-2xl' 
              />
            </div>
            
            {/* Декоративні елементи */}
            <div className='absolute -top-6 -right-6 w-32 h-32 bg-red-100 dark:bg-red-900/30 rounded-full -z-10' />
            <div className='absolute -bottom-8 -left-8 w-40 h-40 bg-red-50 dark:bg-red-900/20 rounded-full -z-10' />
            
            <motion.div 
              className='absolute -bottom-6 -right-6 bg-white dark:bg-dark-800 p-4 rounded-xl shadow-lg border border-gray-100 dark:border-dark-700 z-20'
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center'>
                  <Check className='w-5 h-5 text-red-600 dark:text-red-400' />
                </div>
                <div>
                  <div className='font-bold text-gray-900 dark:text-white'>Щоденний стік</div>
                  <div className='text-sm text-gray-500 dark:text-gray-400'>7 днів поспіль</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Хвилястий роздільник */}
      <div className='absolute bottom-0 left-0 w-full overflow-hidden leading-[0]'>
        <svg className='w-full h-16 sm:h-24 md:h-32' viewBox='0 0 1200 120' preserveAspectRatio='none'>
          <path 
            d='M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z' 
            fill='currentColor' 
            className='text-white dark:text-dark-900'
            opacity='1'
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
