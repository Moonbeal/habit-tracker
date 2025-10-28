// components/FeaturesSection.jsx - Секція "What's Included"
import React from 'react';
import { motion } from 'framer-motion';
import { Target, TrendingUp, Award, Sparkles, Calendar, BarChart2 } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Target,
      title: 'Відстеження',
      description: 'Відмічай виконання звичок кожного дня та бач свій прогрес',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      title: 'Статистика',
      description: 'Детальна аналітика з графіками та діаграмами твого прогресу',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Calendar,
      title: 'Календар',
      description: 'Візуалізація історії виконань у зручному календарі',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      icon: Award,
      title: 'Досягнення',
      description: 'Розблоковуй нагороди та святкуй свої перемоги',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      icon: Sparkles,
      title: 'AI Асистент',
      description: 'Персональні рекомендації та підказки від штучного інтелекту',
      gradient: 'from-pink-500 to-rose-500'
    },
    {
      icon: BarChart2,
      title: 'Аналітика',
      description: 'Глибокий аналіз твоїх звичок та патернів поведінки',
      gradient: 'from-indigo-500 to-purple-500'
    },
  ];

  return (
    <section className='w-full py-16 md:py-24 bg-white dark:bg-dark-900'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center mb-16 md:mb-20'
        >
          <span className='inline-block mb-3 px-4 py-1.5 rounded-full bg-red-100 text-red-800 text-sm font-medium'>
            Можливості
          </span>
          <h2 className='text-3xl sm:text-4xl md:text-5xl font-black mb-4 text-gray-900 dark:text-white'>
            Що ви отримуєте
          </h2>
          <p className='text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto'>
            Усе необхідне для формування міцних звичок
          </p>
        </motion.div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -50px 0px' }}
                transition={{ delay: Math.min(index * 0.1, 0.3) }}
                whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
                className='group bg-white dark:bg-dark-800 rounded-xl p-6 transition-all duration-300 border border-gray-100 dark:border-dark-700 hover:border-red-200 dark:hover:border-red-500/30'
              >
                <div className='w-12 h-12 rounded-xl mb-6 flex items-center justify-center bg-red-100 dark:bg-red-900/30 group-hover:bg-red-500/10 transition-colors'>
                  <Icon className='text-red-600 dark:text-red-400' size={20} />
                </div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
                  {feature.title}
                </h3>
                <p className='text-gray-600 dark:text-gray-400 leading-relaxed mb-6'>
                  {feature.description}
                </p>
                <div className='mt-auto pt-4 border-t border-gray-100 dark:border-dark-700 group-hover:border-red-100 dark:group-hover:border-red-900/50 transition-colors'>
                  <span className='inline-flex items-center text-red-600 dark:text-red-400 font-medium text-sm'>
                    Детальніше
                    <svg className='ml-2 w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
                    </svg>
                  </span>
                </div>

              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
