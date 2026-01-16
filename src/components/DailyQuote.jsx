// components/DailyQuote.jsx - Мотиваційна цитата дня
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Quote, Sparkles } from 'lucide-react';

const DailyQuote = () => {
  const quotes = [
    {
      text: "Ми є те, що робимо постійно. Досконалість — це не дія, а звичка.",
      author: "Арістотель",
      color: "from-purple-400 to-pink-400"
    },
    {
      text: "Мотивація — це те, що змушує вас почати. Звичка — це те, що змушує вас продовжувати.",
      author: "Джим Рюн",
      color: "from-blue-400 to-cyan-400"
    },
    {
      text: "Ви ніколи не зміните своє життя, поки не зміните щось, що робите щодня.",
      author: "Майк Мердок",
      color: "from-green-400 to-emerald-400"
    },
    {
      text: "Успіх — це сума маленьких зусиль, що повторюються день за днем.",
      author: "Роберт Кольє",
      color: "from-orange-400 to-red-400"
    },
    {
      text: "Перші 30 днів ви формуєте звички. Наступні 30 днів звички формують вас.",
      author: "Невідомий",
      color: "from-pink-400 to-rose-400"
    },
    {
      text: "Не чекайте. Час ніколи не буде ідеальним. Почніть звідки ви є.",
      author: "Наполеон Хілл",
      color: "from-indigo-400 to-purple-400"
    },
    {
      text: "Маленькі щоденні покращення — ключ до приголомшливих довгострокових результатів.",
      author: "Робін Шарма",
      color: "from-teal-400 to-cyan-400"
    },
    {
      text: "Ваше майбутнє створюється тим, що ви робите сьогодні, а не завтра.",
      author: "Роберт Кійосакі",
      color: "from-amber-400 to-orange-400"
    },
    {
      text: "Дисципліна — це міст між цілями та досягненнями.",
      author: "Джим Рюн",
      color: "from-violet-400 to-purple-400"
    },
    {
      text: "Не рахуйте дні, робіть дні значущими.",
      author: "Мухаммед Алі",
      color: "from-rose-400 to-pink-400"
    }
  ];

  const dayOfYear = useMemo(() => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay);
  }, []);

  const todayQuote = quotes[dayOfYear % quotes.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className='w-full max-w-4xl glass-card rounded-2xl p-6 shadow-md relative overflow-hidden group cursor-pointer'
    >
      {/* Декоративний градієнт */}
      <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${todayQuote.color} opacity-10 blur-3xl rounded-full group-hover:opacity-20 transition-opacity`} />
      
      <div className='relative z-10'>
        <div className='flex items-start gap-4'>
          {/* Іконка цитати */}
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 5 }}
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${todayQuote.color} flex items-center justify-center flex-shrink-0`}
          >
            <Quote className='text-white' size={24} />
          </motion.div>

          <div className='flex-1'>
            {/* Мітка */}
            <div className='flex items-center gap-2 mb-3'>
              <Sparkles className='text-purple-500' size={16} />
              <span className='text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider'>
                Цитата дня
              </span>
            </div>

            {/* Текст цитати */}
            <p className='text-lg font-medium text-purple-900 dark:text-purple-100 mb-3 leading-relaxed'>
              "{todayQuote.text}"
            </p>

            {/* Автор */}
            <p className='text-sm text-purple-600 dark:text-purple-400 font-medium'>
              — {todayQuote.author}
            </p>
          </div>
        </div>

        {/* Декоративні елементи */}
        <div className='absolute bottom-2 right-2 opacity-5 dark:opacity-10'>
          <Quote size={80} className='text-purple-900' />
        </div>
      </div>
    </motion.div>
  );
};

export default DailyQuote;
