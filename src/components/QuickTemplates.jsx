// components/QuickTemplates.jsx - Швидкі шаблони звичок
import React from 'react';
import { motion } from 'framer-motion';
import { Dumbbell, Book, Droplet, Moon, Coffee, Heart, Zap } from 'lucide-react';

const QuickTemplates = ({ onSelectTemplate }) => {
  const templates = [
    {
      id: 'morning-run',
      name: 'Ранкова пробіжка',
      emoji: '🏃',
      icon: Dumbbell,
      category: 'sport',
      description: '30 хвилин кардіо',
      color: '#ef4444',
      gradient: 'from-red-400 to-orange-400'
    },
    {
      id: 'reading',
      name: 'Читання',
      emoji: '📚',
      icon: Book,
      category: 'study',
      description: '20 сторінок на день',
      color: '#3b82f6',
      gradient: 'from-blue-400 to-cyan-400'
    },
    {
      id: 'water',
      name: 'Випити воду',
      emoji: '💧',
      icon: Droplet,
      category: 'health',
      description: '8 склянок води',
      color: '#06b6d4',
      gradient: 'from-cyan-400 to-blue-400'
    },
    {
      id: 'meditation',
      name: 'Медитація',
      emoji: '🧘',
      icon: Moon,
      category: 'personal',
      description: '10 хвилин спокою',
      color: '#8b5cf6',
      gradient: 'from-purple-400 to-pink-400'
    },
    {
      id: 'morning-coffee',
      name: 'Ранкова рутина',
      emoji: '☕',
      icon: Coffee,
      category: 'personal',
      description: 'Кава + планування',
      color: '#f59e0b',
      gradient: 'from-amber-400 to-orange-400'
    },
    {
      id: 'gratitude',
      name: 'Вдячність',
      emoji: '🙏',
      icon: Heart,
      category: 'personal',
      description: '3 речі за які вдячний',
      color: '#ec4899',
      gradient: 'from-pink-400 to-rose-400'
    },
  ];

  const handleTemplateClick = (template) => {
    const newHabit = {
      id: Date.now().toString(),
      name: template.name,
      description: template.description,
      category: template.category,
      color: template.color,
      completedDays: [],
      currentStreak: 0,
      bestStreak: 0,
      startDate: new Date().toISOString().split('T')[0]
    };
    onSelectTemplate(newHabit);
  };

  return (
    <div className='w-full max-w-4xl'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='glass-card rounded-2xl p-6 shadow-md'
      >
        <div className='flex items-center gap-2 mb-4'>
          <Zap className='text-purple-500' size={24} />
          <h3 className='text-xl font-bold text-purple-900 dark:text-purple-100'>
            Швидкий старт
          </h3>
        </div>
        
        <p className='text-purple-600 dark:text-purple-400 text-sm mb-4'>
          Обери готовий шаблон або створи свою власну звичку
        </p>

        <div className='grid grid-cols-2 md:grid-cols-3 gap-3'>
          {templates.map((template, index) => {
            const Icon = template.icon;
            return (
              <motion.button
                key={template.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTemplateClick(template)}
                className='glass glass-hover p-4 rounded-xl text-left group relative overflow-hidden'
              >
                {/* Градієнтний фон */}
                <div className={`absolute inset-0 bg-gradient-to-br ${template.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />
                
                <div className='relative z-10'>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${template.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                    <span className='text-xl'>{template.emoji}</span>
                  </div>
                  
                  <h4 className='font-semibold text-purple-900 dark:text-purple-100 text-sm mb-1'>
                    {template.name}
                  </h4>
                  
                  <p className='text-xs text-purple-600 dark:text-purple-400'>
                    {template.description}
                  </p>
                </div>

                {/* Іконка додавання */}
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileHover={{ opacity: 1, scale: 1 }}
                  className='absolute top-2 right-2 w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center'
                >
                  <span className='text-white text-xs'>+</span>
                </motion.div>
              </motion.button>
            );
          })}
        </div>

        {/* Кнопка створити власну */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectTemplate(null)}
          className='w-full mt-4 glass glass-hover p-3 rounded-xl flex items-center justify-center gap-2 text-purple-700 dark:text-purple-300 font-medium'
        >
          <span className='text-lg'>✨</span>
          Створити власну звичку
        </motion.button>
      </motion.div>
    </div>
  );
};

export default QuickTemplates;
