// components/AddHabitForm.jsx - Форма додавання звички
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
    setName('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      {/* Назва звички */}
      <div>
        <label className='block text-sm font-medium text-purple-900 mb-2'>
          Назва звички *
        </label>
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Наприклад: Ранкова зарядка'
          required
          className='w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
        />
      </div>

      {/* Опис */}
      <div>
        <label className='block text-sm font-medium text-purple-900 mb-2'>
          Опис (необов'язково)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder='Короткий опис звички...'
          rows={3}
          className='w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none'
        />
      </div>

      {/* Категорія */}
      <div>
        <label className='block text-sm font-medium text-purple-900 mb-2'>
          Категорія *
        </label>
        <div className='grid grid-cols-2 gap-2'>
          {categories.map((cat) => (
            <motion.button
              key={cat.value}
              type='button'
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCategory(cat.value)}
              className={`p-3 rounded-lg border-2 transition-colors ${
                category === cat.value
                  ? 'border-purple-500 bg-purple-50 text-purple-900'
                  : 'border-purple-200 bg-white text-gray-700 hover:border-purple-300'
              }`}
            >
              <span className='text-xl mr-2'>{cat.emoji}</span>
              <span className='text-sm font-medium'>{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Колір */}
      <div>
        <label className='block text-sm font-medium text-purple-900 mb-2'>
          Колір акценту *
        </label>
        <div className='flex gap-2'>
          {colors.map((c) => (
            <motion.button
              key={c.value}
              type='button'
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setColor(c.value)}
              className={`w-10 h-10 rounded-full border-2 transition-all ${
                color === c.value ? 'border-purple-900 scale-110' : 'border-gray-300'
              }`}
              style={{ backgroundColor: c.value }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* Кнопки */}
      <div className='flex gap-3 pt-4'>
        <motion.button
          type='button'
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onCancel}
          className='flex-1 px-6 py-3 border border-purple-300 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors font-medium'
        >
          Скасувати
        </motion.button>
        <motion.button
          type='submit'
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className='flex-1 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-shadow font-medium'
        >
          Додати звичку
        </motion.button>
      </div>
    </form>
  );
};

export default AddHabitForm;
