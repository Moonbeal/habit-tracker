// pages/HabitsPage.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, ClipboardList, SearchX, ClipboardCheck, BarChart3 } from 'lucide-react'; 
import HabitCard from '../components/HabitCard';
import AddHabitForm from '../components/AddHabitForm';
import EditHabitForm from '../components/EditHabitForm';
import CalendarView from '../components/CalendarView';
import HabitFilters from '../components/HabitFilters';
import useLocalStorage from '../hooks/useLocalStorage';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};


const HabitsPage = () => {
  const [habits, setHabits] = useLocalStorage('habits', []);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('date');
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const todayCompletions = habits.filter(h => h.completedDays.includes(today)).length;
  const progress = habits.length > 0 ? (todayCompletions / habits.length) * 100 : 0;

  const getDaysSinceStart = (startDate) => {
    const start = new Date(startDate);
    const today = new Date();
    start.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffTime = Math.abs(today.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1;
  };
  
  const totalCompletions = habits.reduce((acc, h) => acc + h.completedDays.length, 0);
  const totalDaysTracked = habits.reduce((acc, h) => {
    const days = getDaysSinceStart(h.startDate);
    return days > 0 ? acc + days : acc;
  }, 0);
  
  const overallCompletionRate = totalDaysTracked > 0 ? (totalCompletions / totalDaysTracked) * 100 : 0;
  const overallBestStreak = Math.max(0, ...habits.map(h => h.bestStreak || 0));
  
  let bestHabit = null;
  if (habits.length > 0) {
    bestHabit = habits.reduce((best, current) => {
      return (current.bestStreak || 0) > (best.bestStreak || 0) ? current : best;
    }, habits[0]);
    if (bestHabit && (bestHabit.bestStreak || 0) === 0) {
      bestHabit = null;
    }
  }

  const handleAddHabit = (habit) => {
    setHabits([...habits, { ...habit, bestStreak: 0, currentStreak: 0 }]);
    setShowAddForm(false);
    setMotivationalMessage('Перша звичка створена! 💫');
    setTimeout(() => setMotivationalMessage(''), 3000);
  };

  const handleToggleComplete = (habitId) => {
    const today = new Date().toISOString().split('T')[0];
    setHabits(habits.map(habit => {
      if (habit.id === habitId) {
        const isCompleted = habit.completedDays.includes(today);
        if (isCompleted) return habit; 
        const newCompletedDays = [...habit.completedDays, today].sort();
        const { currentStreak, bestStreak } = calculateStreaks(newCompletedDays);
        if (currentStreak === 1) setMotivationalMessage('Перший день — чудово 💫');
        else if (currentStreak === 5) setMotivationalMessage('5 днів підряд — гарний старт! 🌟');
        setTimeout(() => setMotivationalMessage(''), 3000);
        return {
          ...habit,
          completedDays: newCompletedDays,
          currentStreak,
          bestStreak: Math.max(bestStreak, habit.bestStreak || 0)
        };
      }
      return habit;
    }));
  };

  const handleEditHabit = (updatedHabit) => {
    setHabits(habits.map(habit => 
      habit.id === updatedHabit.id ? updatedHabit : habit
    ));
    setEditingHabit(null);
    setMotivationalMessage('Звичку оновлено! ✨');
    setTimeout(() => setMotivationalMessage(''), 3000);
  };

  const handleDeleteHabit = (habitId) => {
    setHabits(habits.filter(habit => habit.id !== habitId));
    setSelectedHabit(null);
    setMotivationalMessage('Звичку видалено 🗑️');
    setTimeout(() => setMotivationalMessage(''), 3000);
  };

  const calculateStreaks = (completedDays) => {
    if (completedDays.length === 0) return { currentStreak: 0, bestStreak: 0 };
    const sortedDays = completedDays.sort().reverse();
    let currentStreak = 0;
    let bestStreak = 0;
    let tempStreak = 1;
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const todayStr = today.toISOString().split('T')[0];
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    if (sortedDays[0] === todayStr || (sortedDays[0] === yesterdayStr && sortedDays.includes(todayStr) === false)) {
      currentStreak = 1;
      for (let i = 1; i < sortedDays.length; i++) {
      const current = new Date(sortedDays[i - 1]);
      const previous = new Date(sortedDays[i]);
      const diffDays = Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        currentStreak++;
      } else if (diffDays > 1) {
        break;
      }
      }
    } else if (sortedDays[0] !== todayStr && sortedDays[0] !== yesterdayStr) {
      currentStreak = 0;
    }
    
    if (sortedDays.length > 0) {
      tempStreak = 1;
      bestStreak = 1;
      for (let i = 1; i < sortedDays.length; i++) {
      const current = new Date(sortedDays[i - 1]);
      const previous = new Date(sortedDays[i]);
      const diffDays = Math.floor((current.getTime() - previous.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        bestStreak = Math.max(bestStreak, tempStreak);
        tempStreak = 1;
      }
      }
      bestStreak = Math.max(bestStreak, tempStreak);
    } else {
      bestStreak = 0;
    }
    return { currentStreak, bestStreak };
  };

  const filteredAndSortedHabits = habits
    .filter(habit => {
      const matchesSearch = habit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           habit.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategories.length === 0 || 
                             selectedCategories.includes(habit.category);
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'streak':
          return b.currentStreak - a.currentStreak;
        case 'progress':
          const progressA = a.completedDays.length / Math.max(1, getDaysSinceStart(a.startDate));
          const progressB = b.completedDays.length / Math.max(1, getDaysSinceStart(b.startDate));
          return progressB - progressA;
        case 'date':
        default:
          return new Date(b.startDate) - new Date(a.startDate);
      }
    });


  return (
    <div className='max-w-7xl mx-auto px-4 py-8 md:py-12 space-y-8'>
      
      {/* --- Блок Заголовку та Прогресу --- */}
      <div className='space-y-6'>
        <div className='flex flex-col sm:flex-row justify-between sm:items-center gap-4'>
          <div>
            <h2 className='text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-400 pb-2 animate-gradient'>
              Мої Звички
            </h2>
            <p className='text-purple-600 dark:text-purple-400 text-base'>
              {habits.length} {habits.length === 1 ? 'звичка' : habits.length < 5 ? 'звички' : 'звичок'} • {todayCompletions} виконано
            </p>
          </div>
          <div className='flex items-center gap-3'>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowStats(true)}
              className='glass text-purple-700 dark:text-purple-200 p-4 rounded-2xl shadow-purple'
              aria-label="Показати статистику"
            >
              <BarChart3 size={24} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddForm(true)}
              className='btn-gradient-primary text-white p-4 rounded-2xl shadow-purple flex items-center justify-center sm:justify-start gap-2'
            >
              <Plus size={24} />
              <span className='hidden md:inline'>Додати звичку</span>
            </motion.button>
          </div>
        </div>
        <AnimatePresence>
          {habits.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className='glass p-4 rounded-xl shadow-purple'
            >
              <div className='flex justify-between items-center mb-2'>
                <div className='flex items-center gap-2 text-purple-800 dark:text-purple-200'>
                  <ClipboardCheck size={18} />
                  <span className='font-semibold'>Сьогоднішній прогрес</span>
                </div>
                <span className='font-bold text-purple-900 dark:text-purple-100'>
                  {todayCompletions} / {habits.length}
                </span>
              </div>
              <div className='w-full bg-purple-200 dark:bg-purple-900 rounded-full h-2.5 overflow-hidden'>
                <motion.div
                  className='btn-gradient-primary h-2.5 rounded-full'
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Мотиваційне повідомлення */}
      <AnimatePresence>
        {motivationalMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className='glass border-l-4 border-purple-500 p-4 rounded-xl shadow-purple' 
          >
            <p className='text-purple-900 dark:text-purple-100 font-semibold'>{motivationalMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Фільтри */}
      <div className='glass p-4 rounded-xl shadow-purple'>
        <HabitFilters
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            sortBy={sortBy}
            setSortBy={setSortBy}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
        />
      </div>

      {/* Список звичок */}
      {habits.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className='glass-card text-center p-12 rounded-2xl flex flex-col items-center gap-6'
        >
          <ClipboardList size={48} className='text-purple-400 animate-float-slow' />
          <p className='text-purple-700 dark:text-purple-300 text-xl font-medium'>
            Ваш список звичок порожній
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddForm(true)}
            className='btn-gradient-primary text-white py-3 px-6 rounded-xl shadow-purple flex items-center gap-2'
          >
            <Plus size={20} />
            <span>Створити першу звичку</span>
          </motion.button>
        </motion.div>
      ) : filteredAndSortedHabits.length === 0 ? (
      <div className='glass-card text-center p-12 rounded-2xl flex flex-col items-center gap-4'>
          <SearchX size={48} className='text-purple-400 animate-float-slow' />
        <p className='text-purple-700 dark:text-purple-300 text-xl font-medium'>
            Нічого не знайдено
          </p>
          <p className='text-purple-600 dark:text-purple-400'>
            Спробуйте змінити параметри пошуку або фільтри.
          </p>
      </div>
      ) : (
      <motion.div 
          className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
        {filteredAndSortedHabits.map((habit) => (
        <motion.div
          key={habit.id}
          layout
                variants={itemVariants}
          className='h-full'
        >
          <HabitCard
            habit={habit}
            onToggleComplete={handleToggleComplete}
            onEdit={setEditingHabit}
            onClick={() => setSelectedHabit(habit)}
            onDelete={handleDeleteHabit}
          />
        </motion.div>
        ))}
      </motion.div>
      )}
      
      {/* Модальне вікно статистики */}
      <AnimatePresence>
        {showStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 backdrop-blur-md grid place-items-center z-50 p-8'
            onClick={() => setShowStats(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className='glass-strong rounded-2xl p-6 max-w-2xl w-full max-h-full overflow-y-auto shadow-glow space-y-6'
            >
              <div className='flex justify-between items-center'>
                <h3 className='text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-400 pb-1'>
                  Ваш Прогрес
                </h3>
                <button
                  onClick={() => setShowStats(false)}
                  className='text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200'
                >
                  <X size={24} />
                </button>
              </div>
              <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                <div className='glass p-4 rounded-xl text-center'>
                  <p className='text-sm text-purple-700 dark:text-purple-300'>Найкраща серія</p>
                  <p className='text-3xl font-bold text-purple-900 dark:text-purple-100'>
                    {overallBestStreak} {overallBestStreak === 1 ? 'день' : 'днів'}
                  </p>
                </div>
                <div className='glass p-4 rounded-xl text-center'>
                  <p className='text-sm text-purple-700 dark:text-purple-300'>Загалом виконано</p>
                  <p className='text-3xl font-bold text-purple-900 dark:text-purple-100'>
                    {overallCompletionRate.toFixed(0)}%
                  </p>
                </div>
                <div className='glass p-4 rounded-xl text-center'>
                  <p className='text-sm text-purple-700 dark:text-purple-300'>Усі звички</p>
                  <p className='text-3xl font-bold text-purple-900 dark:text-purple-100'>
                    {habits.length}
                  </p>
                </div>
              </div>
              <div className='glass p-6 rounded-xl space-y-4'>
                <h4 className='text-xl font-bold text-purple-900 dark:text-purple-100'>
                  Цікаві факти
                </h4>
                <div className='flex flex-col sm:flex-row justify-between sm:items-center'>
                  <span className='text-purple-700 dark:text-purple-300'>👑 Ваша "королівська" звичка:</span>
                  {bestHabit ? (
                    <span className='font-bold text-purple-900 dark:text-purple-100 text-left sm:text-right'>
                      {bestHabit.name} ({bestHabit.bestStreak} {bestHabit.bestStreak === 1 ? 'день' : 'днів'})
                    </span>
                  ) : (
                    <span className='font-bold text-purple-900 dark:text-purple-100 text-left sm:text-right'>Ще попереду!</span>
                  )}
                </div>
                <div className='border-t border-purple-200 dark:border-purple-700/50'></div>
                <div className='flex justify-between items-center'>
                  <span className='text-purple-700 dark:text-purple-300'>✅ Загальна кількість виконань:</span>
                  <span className='font-bold text-purple-900 dark:text-purple-100'>{totalCompletions}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Модальне вікно додавання звички */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/50 backdrop-blur-md grid place-items-center z-50 p-8'
            onClick={() => setShowAddForm(false)}
        >
          <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className='glass-strong rounded-2xl p-6 max-w-md w-full max-h-full overflow-y-auto shadow-glow'
          >
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-2xl font-bold text-purple-900 dark:text-purple-100'>Нова звичка</h3>
            <button
            onClick={() => setShowAddForm(false)}
            className='text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200'
            >
            <X size={24} />
            </button>
          </div>
          <AddHabitForm onAdd={handleAddHabit} onCancel={() => setShowAddForm(false)} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* Модальне вікно редагування звички */}
    <AnimatePresence>
      {editingHabit && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
          className='fixed inset-0 bg-black/50 backdrop-blur-md grid place-items-center z-50 p-8'
        onClick={() => setEditingHabit(null)}
      >
        <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className='glass-strong rounded-2xl p-6 max-w-md w-full max-h-full overflow-y-auto shadow-glow'
        >
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-2xl font-bold text-purple-900 dark:text-purple-100'>Редагувати звичку</h3>
          <button
          onClick={() => setEditingHabit(null)}
          className='text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200'
          >
          <X size={24} />
          </button>
        </div>
        <EditHabitForm 
          habit={editingHabit} 
          onSave={handleEditHabit} 
          onCancel={() => setEditingHabit(null)} 
        />
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>

    {/* Модальне вікно календаря */}
    <AnimatePresence>
      {selectedHabit && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 bg-black/50 backdrop-blur-md grid place-items-center z-50 p-8'
        onClick={() => setSelectedHabit(null)}
      >
        <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className='glass-strong rounded-2xl p-6 max-w-2xl w-full max-h-full overflow-y-auto shadow-glow'
  >
    <div className='flex justify-between items-center mb-4'>
      <h3 className='text-2xl font-bold text-purple-900 dark:text-purple-100'>{selectedHabit.name}</h3>
      <button
        onClick={() => setSelectedHabit(null)}
        className='text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200'
      >
        <X size={24} />
      </button>
      </div>
      <CalendarView habit={selectedHabit} />
    </motion.div>
    </motion.div>
    )}
  </AnimatePresence>
  </div>
  );
};

export default HabitsPage;