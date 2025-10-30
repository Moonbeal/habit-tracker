// components/AddHabitForm.jsx 
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AddHabitForm = ({ onAdd, onCancel }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#a855f7');
  const [category, setCategory] = useState('health');

  const colors = [
    { name: 'Фіолетовий', value: '#a855f7' },
    { name: 'Синій', value: '#3b82f6' },
    { name: 'Зелений', value: '#10b981' },
    { name: 'Жовтий', value: '#f59e0b' },
    { name: 'Рожевий', value: '#ec4899' },
    { name: 'Червоний', value: '#ef4444' },
  ];

  const categories = [
    { value: 'health', label: 'Здоров\'я', emoji: '🏥' },
    { value: 'sport', label: 'Спорт', emoji: '⚽' },
    { value: 'study', label: 'Навчання', emoji: '📚' },
    { value: 'work', label: 'Робота', emoji: '💼' },
    { value: 'personal', label: 'Особисте', emoji: '🌟' },
    { value: 'other', label: 'Інше', emoji: '📌' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newHabit = {
      id: Date.now().toString(),
      name,
      description,
      color,
      category,
      startDate: new Date().toISOString(),
      completedDays: [],
      currentStreak: 0,
      bestStreak: 0,
    };
    onAdd(newHabit);
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-3'>
      {/* Назва звички */}
      <div>
        <label className='block text-sm font-medium text-purple-900 dark:text-purple-200 mb-1'>
          Назва звички *
        </label>
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Наприклад: Ранкова зарядка'
          required
          className='w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-purple-800/50 dark:border-purple-700'
        />
      </div>

      {/* Опис */}
      <div>
        <label className='block text-sm font-medium text-purple-900 dark:text-purple-200 mb-1'>
          Опис (необов'язково)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Короткий опис звички...'
          rows={2}
          className='w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none dark:bg-purple-800/50 dark:border-purple-700'
        />
      </div>

      {/* Категорія */}
      <div>
        <label className='block text-sm font-medium text-purple-900 dark:text-purple-200 mb-1'>
          Категорія *
        </label>
        <div className='grid grid-cols-3 gap-2'>
          {categories.map((cat) => (
            <motion.button
              key={cat.value}
              type='button'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCategory(cat.value)}
              className={`p-2 rounded-lg border-2 transition-colors flex items-center justify-center ${
                category === cat.value
                  ? 'border-purple-500 bg-purple-100 text-purple-900 dark:bg-purple-800 dark:text-purple-100 dark:border-purple-400'
                  : 'border-purple-200 bg-white text-gray-700 hover:border-purple-300 dark:bg-purple-900/50 dark:border-purple-700 dark:text-purple-200 dark:hover:border-purple-600'
              }`}
            >
              <span className='text-lg mr-1'>{cat.emoji}</span>
              <span className='text-sm font-medium'>{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Колір */}
      <div>
        <label className='block text-sm font-medium text-purple-900 dark:text-purple-200 mb-1'>
          Колір акценту *
        </label>
        <div className='flex gap-2 justify-between'>
          {colors.map((c) => (
            <motion.button
              key={c.value}
              type='button'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setColor(c.value)}
              className={`w-9 h-9 rounded-full border-4 transition-all ${
                color === c.value ? 'border-purple-900 scale-110 dark:border-purple-300' : 'border-transparent'
              }`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* Кнопки */}
      <div className='flex gap-3 pt-2'>
        <motion.button
          type='button'
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCancel}
          className='px-6 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors'
        >
          Скасувати
        </motion.button>
      	<motion.button
      	  type='submit'
      	  whileHover={{ scale: 1.02 }}
  	  whileTap={{ scale: 0.98 }}
  	  className='flex-1 btn-gradient-primary text-white py-3 rounded-lg font-semibold transition-colors'
  	>
  	  Додати звичку
  	</motion.button>
    </div>
  </form>
  );
};

export default AddHabitForm;