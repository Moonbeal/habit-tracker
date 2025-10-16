// pages/AchievementsPage.jsx - Сторінка досягнень
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Target, Flame, Star, Award, Zap, CheckCircle } from 'lucide-react';
import useLocalStorage from '../hooks/useLocalStorage';

const AchievementsPage = () => {
  const [habits] = useLocalStorage('habits', []);

  const achievements = useMemo(() => {
    const totalHabits = habits.length;
    const totalCompletions = habits.reduce((sum, habit) => sum + habit.completedDays.length, 0);
    const maxStreak = Math.max(...habits.map(h => h.bestStreak), 0);
    const has7DayStreak = habits.some(h => h.bestStreak >= 7);
    const has30DayStreak = habits.some(h => h.bestStreak >= 30);
    const has100Completions = totalCompletions >= 100;

    // Перевірка ідеального тижня (всі звички виконані кожен день тижня)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });
    
    const isPerfectWeek = habits.length > 0 && last7Days.every(day =>
      habits.every(habit => habit.completedDays.includes(day))
    );

    return [
      {
        id: 'first-habit',
        title: '🎯 Перша звичка',
        description: 'Створіть свою першу звичку',
        icon: Target,
        unlocked: totalHabits >= 1,
        progress: Math.min(totalHabits, 1),
        maxProgress: 1
      },
      {
        id: '5-habits',
        title: '⭐ Колекціонер звичок',
        description: 'Створіть 5 звичок',
        icon: Star,
        unlocked: totalHabits >= 5,
        progress: Math.min(totalHabits, 5),
        maxProgress: 5
      },
      {
        id: '7-day-streak',
        title: '🔥 Тиждень стабільності',
        description: 'Досягніть серії в 7 днів',
        icon: Flame,
        unlocked: has7DayStreak,
        progress: Math.min(maxStreak, 7),
        maxProgress: 7
      },
      {
        id: '30-day-streak',
        title: '🌟 Місяць дисципліни',
        description: 'Досягніть серії в 30 днів',
        icon: Award,
        unlocked: has30DayStreak,
        progress: Math.min(maxStreak, 30),
        maxProgress: 30
      },
      {
        id: 'perfect-week',
        title: '🏅 Ідеальний тиждень',
        description: 'Виконайте всі звички протягом тижня',
        icon: Trophy,
        unlocked: isPerfectWeek
      },
      {
        id: '100-completions',
        title: '💪 Сотня виконань',
        description: 'Виконайте звички 100 разів',
        icon: Zap,
        unlocked: has100Completions,
        progress: Math.min(totalCompletions, 100),
        maxProgress: 100
      },
      {
        id: '10-habits',
        title: '🎨 Майстер звичок',
        description: 'Створіть 10 різних звичок',
        icon: CheckCircle,
        unlocked: totalHabits >= 10,
        progress: Math.min(totalHabits, 10),
        maxProgress: 10
      }
    ];
  }, [habits]);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  return (
    <div className='py-6'>
      <div className='mb-6'>
        <h2 className='text-3xl font-bold text-purple-900 mb-2'>Досягнення</h2>
        <div className='flex items-center gap-3'>
          <div className='flex-1 bg-gray-200 rounded-full h-3'>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
              className='bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full'
            />
          </div>
          <span className='text-sm font-semibold text-purple-700'>
            {unlockedCount} / {totalCount}
          </span>
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden rounded-2xl p-6 shadow-md border-2 transition-all ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-300'
                  : 'bg-gray-50 border-gray-200 opacity-60'
              }`}
            >
              {achievement.unlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className='absolute top-4 right-4'
                >
                  <div className='bg-green-500 text-white rounded-full p-2'>
                    <CheckCircle size={20} />
                  </div>
                </motion.div>
              )}

              <div className='flex items-start gap-4'>
                <div
                  className={`p-4 rounded-xl ${
                    achievement.unlocked ? 'bg-purple-200' : 'bg-gray-200'
                  }`}
                >
                  <Icon
                    size={32}
                    className={achievement.unlocked ? 'text-purple-700' : 'text-gray-400'}
                  />
                </div>

                <div className='flex-1'>
                  <h3
                    className={`text-xl font-bold mb-2 ${
                      achievement.unlocked ? 'text-purple-900' : 'text-gray-600'
                    }`}
                  >
                    {achievement.title}
                  </h3>
                  <p
                    className={`text-sm mb-3 ${
                      achievement.unlocked ? 'text-purple-700' : 'text-gray-500'
                    }`}
                  >
                    {achievement.description}
                  </p>

                  {achievement.maxProgress && (
                    <div>
                      <div className='flex justify-between text-xs mb-1'>
                        <span className='text-purple-600'>Прогрес</span>
                        <span className='text-purple-600 font-semibold'>
                          {achievement.progress} / {achievement.maxProgress}
                        </span>
                      </div>
                      <div className='w-full bg-gray-200 rounded-full h-2'>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${((achievement.progress || 0) / achievement.maxProgress) * 100}%`
                          }}
                          className={`h-2 rounded-full ${
                            achievement.unlocked
                              ? 'bg-gradient-to-r from-green-400 to-green-500'
                              : 'bg-gradient-to-r from-purple-400 to-purple-500'
                          }`}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {unlockedCount === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='text-center py-12'
        >
          <Trophy size={64} className='text-purple-300 mx-auto mb-4' />
          <p className='text-purple-600 text-lg'>
            Почніть виконувати звички, щоб розблокувати досягнення!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default AchievementsPage;
