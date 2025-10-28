// components/HabitFilters.jsx - Компонент фільтрації та пошуку звичок
import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, X, SortAsc } from 'lucide-react';

const HabitFilters = ({ 
  searchQuery, 
  setSearchQuery, 
  selectedCategories, 
  setSelectedCategories,
  sortBy,
  setSortBy,
  showFilters,
  setShowFilters
}) => {
  const categories = [
    { id: 'health', name: 'Здоров\'я', emoji: '🏥' },
    { id: 'sport', name: 'Спорт', emoji: '⚽' },
    { id: 'study', name: 'Навчання', emoji: '📚' },
    { id: 'work', name: 'Робота', emoji: '💼' },
    { id: 'personal', name: 'Особисте', emoji: '🌟' },
    { id: 'other', name: 'Інше', emoji: '📌' },
  ];

  const sortOptions = [
    { id: 'name', name: 'За назвою' },
    { id: 'date', name: 'За датою створення' },
    { id: 'streak', name: 'За серією' },
    { id: 'progress', name: 'За прогресом' },
  ];

  const toggleCategory = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
    setSortBy('date');
  };

  const hasActiveFilters = searchQuery || selectedCategories.length > 0 || sortBy !== 'date';

  return (
    <div className='mb-6'>
      {/* Пошук та кнопка фільтрів */}
      <div className='flex gap-3 mb-4'>
        <div className='flex-1 relative'>
          <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-purple-400' size={20} />
          <input
            type='text'
            placeholder='Пошук звичок...'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-10 py-3 rounded-xl glass text-purple-900 dark:text-purple-100 placeholder-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:shadow-purple transition-all'
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600 dark:hover:text-purple-300'
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-3 rounded-xl flex items-center gap-2 font-medium transition-all ${
            showFilters || hasActiveFilters
              ? 'btn-gradient-primary text-white shadow-purple'
              : 'glass text-purple-600 dark:text-purple-400'
          }`}
        >
          <Filter size={20} />
          Фільтри
        </motion.button>
      </div>

      {/* Панель фільтрів */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className='glass-card rounded-xl p-4 mb-4 shadow-md'
        >
          {/* Категорії */}
          <div className='mb-4'>
            <h4 className='text-sm font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2'>
              <Filter size={16} />
              Категорії
            </h4>
            <div className='flex flex-wrap gap-2'>
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleCategory(category.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategories.includes(category.id)
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                      : 'glass text-purple-700 dark:text-purple-300 hover:scale-105'
                  }`}
                >
                  <span className='mr-1'>{category.emoji}</span>
                  {category.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Сортування */}
          <div className='mb-4'>
            <h4 className='text-sm font-semibold text-purple-900 dark:text-purple-100 mb-3 flex items-center gap-2'>
              <SortAsc size={16} />
              Сортування
            </h4>
            <div className='flex flex-wrap gap-2'>
              {sortOptions.map((option) => (
                <motion.button
                  key={option.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSortBy(option.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortBy === option.id
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md'
                      : 'glass text-purple-700 dark:text-purple-300 hover:scale-105'
                  }`}
                >
                  {option.name}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Очистити фільтри */}
          {hasActiveFilters && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={clearFilters}
              className='w-full py-2 rounded-lg btn-gradient-danger text-white font-medium shadow-md flex items-center justify-center gap-2'
            >
              <X size={16} />
              Очистити фільтри
            </motion.button>
          )}
        </motion.div>
      )}

      {/* Активні фільтри (чіпси) */}
      {(selectedCategories.length > 0 || searchQuery) && (
        <div className='flex flex-wrap gap-2 mb-4'>
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className='px-3 py-1.5 rounded-full glass text-purple-700 dark:text-purple-300 text-sm flex items-center gap-2 shadow-sm'
            >
              <Search size={14} />
              "{searchQuery}"
              <button
                onClick={() => setSearchQuery('')}
                className='hover:text-purple-900 dark:hover:text-purple-100'
              >
                <X size={14} />
              </button>
            </motion.div>
          )}
          {selectedCategories.map((categoryId) => {
            const category = categories.find(c => c.id === categoryId);
            return (
              <motion.div
                key={categoryId}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className='px-3 py-1.5 rounded-full glass text-purple-700 dark:text-purple-300 text-sm flex items-center gap-2 shadow-sm'
              >
                {category.emoji} {category.name}
                <button
                  onClick={() => toggleCategory(categoryId)}
                  className='hover:text-purple-900 dark:hover:text-purple-100'
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default HabitFilters;
