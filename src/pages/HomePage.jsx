// pages/HomePage.jsx - Головна сторінка
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Target, TrendingUp, Award } from 'lucide-react';

const HomePage = () => {
  const features = [
    { icon: Target, title: 'Створюй звички', description: 'Додавай нові корисні звички' },
    { icon: TrendingUp, title: 'Відстежуй прогрес', description: 'Бачи свої досягнення щодня' },
    { icon: Award, title: 'Отримуй нагороди', description: 'Розблоковуй досягнення' },
  ];

  return (
    <div className='flex flex-col items-center justify-center min-h-screen py-12'>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className='text-center mb-12'
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className='inline-block mb-4'
        >
          <Sparkles size={48} className='text-purple-500' />
        </motion.div>
        <h1 className='text-5xl md:text-6xl font-bold text-purple-900 mb-4'>
          Щоденник звичок
        </h1>
        <p className='text-xl text-purple-600 mb-8'>
          Створюй корисні звички та досягай своїх цілей
        </p>
        <Link to='/habits'>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-lg hover:shadow-xl transition-shadow'
          >
            Почати 🚀
          </motion.button>
        </Link>
      </motion.div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full px-4'>
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className='bg-white/60 backdrop-blur-sm p-6 rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-purple-100'
            >
              <Icon className='text-purple-500 mb-3' size={32} />
              <h3 className='text-lg font-semibold text-purple-900 mb-2'>
                {feature.title}
              </h3>
              <p className='text-purple-600'>{feature.description}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default HomePage;
