// pages/StatsPage.jsx - Сторінка статистики
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Target, Flame, Award } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';

const getCategoryName = (category) => {
  const names = {
    health: 'Здоров\'я',
    sport: 'Спорт',
    study: 'Навчання',
    work: 'Робота',
    personal: 'Особисте',
    other: 'Інше'
  };
  return names[category] || category;
};

const StatsPage = () => {
  const [habits] = useLocalStorage('habits', []);

  // Загальна статистика
  const stats = useMemo(() => {
    const totalHabits = habits.length;
    const totalCompletions = habits.reduce((sum, habit) => sum + habit.completedDays.length, 0);
    const bestStreak = Math.max(...habits.map(habit => habit.bestStreak), 0);
    const currentStreaks = habits.reduce((sum, habit) => sum + habit.currentStreak, 0);

    // Виконання за останні 7 днів
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    const completionsLast7Days = last7Days.map(day => {
      const count = habits.filter(habit => habit.completedDays.includes(day)).length;
      const dayName = new Date(day).toLocaleDateString('uk-UA', { weekday: 'short' });
      return { day: dayName, count };
    });

    // Статистика по категоріях
    const categoryStats = {};
    habits.forEach(habit => {
      categoryStats[habit.category] = (categoryStats[habit.category] || 0) + 1;
    });

    const categoryData = Object.entries(categoryStats).map(([category, count]) => ({
      name: getCategoryName(category),
      value: count
    }));

    return {
      totalHabits,
      totalCompletions,
      bestStreak,
      currentStreaks,
      completionsLast7Days,
      categoryData
    };
  }, [habits]);

  const COLORS = ['#a855f7', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#ef4444'];

  return (
    <div className='py-6'>
      <h2 className='text-3xl font-bold text-purple-900 mb-6'>Статистика</h2>

      {/* Основні показники */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 mb-8'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className='bg-white rounded-2xl p-5 shadow-md border border-purple-100'
        >
          <div className='flex items-center gap-3 mb-2'>
            <div className='p-2 bg-purple-100 rounded-lg'>
              <Target className='text-purple-600' size={24} />
            </div>
            <div>
              <p className='text-2xl font-bold text-purple-900'>{stats.totalHabits}</p>
              <p className='text-sm text-purple-600'>Звичок</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className='bg-white rounded-2xl p-5 shadow-md border border-purple-100'
        >
          <div className='flex items-center gap-3 mb-2'>
            <div className='p-2 bg-green-100 rounded-lg'>
              <TrendingUp className='text-green-600' size={24} />
            </div>
            <div>
              <p className='text-2xl font-bold text-purple-900'>{stats.totalCompletions}</p>
              <p className='text-sm text-purple-600'>Виконань</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className='bg-white rounded-2xl p-5 shadow-md border border-purple-100'
        >
          <div className='flex items-center gap-3 mb-2'>
            <div className='p-2 bg-orange-100 rounded-lg'>
              <Flame className='text-orange-600' size={24} />
            </div>
            <div>
              <p className='text-2xl font-bold text-purple-900'>{stats.bestStreak}</p>
              <p className='text-sm text-purple-600'>Найкраща серія</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className='bg-white rounded-2xl p-5 shadow-md border border-purple-100'
        >
          <div className='flex items-center gap-3 mb-2'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <Award className='text-blue-600' size={24} />
            </div>
            <div>
              <p className='text-2xl font-bold text-purple-900'>{stats.currentStreaks}</p>
              <p className='text-sm text-purple-600'>Активні серії</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Графік виконань за 7 днів */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className='bg-white rounded-2xl p-6 shadow-md border border-purple-100 mb-8'
      >
        <h3 className='text-xl font-bold text-purple-900 mb-4'>Виконання за останні 7 днів</h3>
        <ResponsiveContainer width='100%' height={250}>
          <BarChart data={stats.completionsLast7Days}>
            <CartesianGrid strokeDasharray='3 3' stroke='#e9d5ff' />
            <XAxis dataKey='day' stroke='#7e22ce' />
            <YAxis stroke='#7e22ce' />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e9d5ff',
                borderRadius: '8px'
              }}
            />
            <Bar dataKey='count' fill='#a855f7' radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Розподіл по категоріях */}
      {stats.categoryData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className='bg-white rounded-2xl p-6 shadow-md border border-purple-100'
        >
          <h3 className='text-xl font-bold text-purple-900 mb-4'>Розподіл по категоріях</h3>
          <div className='flex flex-col md:flex-row items-center gap-6'>
            <ResponsiveContainer width='100%' height={250}>
              <PieChart>
                <Pie
                  data={stats.categoryData}
                  cx='50%'
                  cy='50%'
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill='#8884d8'
                  dataKey='value'
                >
                  {stats.categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className='flex flex-col gap-2'>
              {stats.categoryData.map((item, index) => (
                <div key={index} className='flex items-center gap-2'>
                  <div
                    className='w-4 h-4 rounded'
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className='text-sm text-gray-700'>
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Список звичок з найкращими серіями */}
      {habits.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className='bg-white rounded-2xl p-6 shadow-md border border-purple-100 mt-8'
        >
          <h3 className='text-xl font-bold text-purple-900 mb-4'>Топ звичок за серіями</h3>
          <div className='space-y-3'>
            {[...habits]
              .sort((a, b) => b.bestStreak - a.bestStreak)
              .slice(0, 5)
              .map((habit, index) => (
                <div
                  key={habit.id}
                  className='flex items-center justify-between p-3 bg-purple-50 rounded-lg'
                >
                  <div className='flex items-center gap-3'>
                    <span className='text-2xl font-bold text-purple-400'>#{index + 1}</span>
                    <div>
                      <p className='font-semibold text-purple-900'>{habit.name}</p>
                      <p className='text-sm text-purple-600'>
                        Поточна серія: {habit.currentStreak} днів
                      </p>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='text-2xl font-bold text-purple-900'>{habit.bestStreak}</p>
                    <p className='text-xs text-purple-600'>днів</p>
                  </div>
                </div>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StatsPage;
