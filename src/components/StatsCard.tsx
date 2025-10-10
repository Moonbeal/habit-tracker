// components/StatsCard.tsx - Картка статистики (не використовується)
import React from 'react';

const StatsCard: React.FC<{ totalHabits: number; completed: number; bestStreak: number }> = ({ totalHabits, completed, bestStreak }) => {
  return (
    <div className='bg-purple-300 p-4 rounded-lg shadow-md'>
      <h3 className='text-lg font-bold'>Statistics</h3>
      <p>Total Habits: {totalHabits}</p>
      <p>Completed: {completed}</p>
      <p>Best Streak: {bestStreak} days</p>
    </div>
  );
};

export default StatsCard;
