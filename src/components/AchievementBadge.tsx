// components/AchievementBadge.tsx - Бейдж досягнення (не використовується)
import React from 'react';

const AchievementBadge: React.FC<{ title: string; description: string; date: string }> = ({ title, description, date }) => {
  return (
    <div className='bg-purple-200 p-2 rounded-lg shadow-md'>
      <h4 className='font-bold'>{title}</h4>
      <p>{description}</p>
      <span>{date}</span>
    </div>
  );
};

export default AchievementBadge;
