import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  Plus, Flame, Star, Check, Droplet, Dumbbell, BookOpen, Zap,
  Target, Trophy, TrendingUp, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import AddHabitForm from '../components/AddHabitForm';
import DailyQuote from '../components/DailyQuote';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';

const categoryConfig = {
  health: { gradient: 'from-emerald-400 to-teal-500', icon: <Droplet className="w-6 h-6" />, bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
  sport: { gradient: 'from-amber-400 to-orange-500', icon: <Dumbbell className="w-6 h-6" />, bg: 'bg-amber-50 dark:bg-amber-950/20' },
  study: { gradient: 'from-violet-400 to-purple-500', icon: <BookOpen className="w-6 h-6" />, bg: 'bg-violet-50 dark:bg-violet-950/20' },
  personal: { gradient: 'from-pink-400 to-rose-500', icon: <Zap className="w-6 h-6" />, bg: 'bg-pink-50 dark:bg-pink-950/20' },
  work: { gradient: 'from-blue-400 to-cyan-500', icon: <Target className="w-6 h-6" />, bg: 'bg-blue-50 dark:bg-blue-950/20' },
  other: { gradient: 'from-gray-400 to-slate-500', icon: <Zap className="w-6 h-6" />, bg: 'bg-gray-50 dark:bg-gray-950/20' },
};

export default function MainPage() {
  const [habits, setHabits] = useLocalStorage('habits', []);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [prefillHabit, setPrefillHabit] = useState(null);
  const navigate = useNavigate();
  const scrollRef = useRef(null);

  const today = new Date().toISOString().split('T')[0];
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const VISIBLE_CARDS = 3;
  const CARD_WIDTH = 320;

  // === 3D-паралакс ===
  useEffect(() => {
    const handleMouseMove = (e) => {
      const rect = document.getElementById('hero-card')?.getBoundingClientRect();
      if (rect) {
        mouseX.set(e.clientX - rect.left - rect.width / 2);
        mouseY.set(e.clientY - rect.top - rect.height / 2);
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // === Стрік ===
  const getCurrentStreak = (completedDays) => {
    if (!completedDays?.length) return 0;
    const sorted = [...completedDays].sort();
    let streak = 0;
    const now = new Date(today);
    for (let i = sorted.length - 1; i >= 0; i--) {
      const diff = Math.floor((now.getTime() - new Date(sorted[i]).getTime()) / 86400000);
      if (diff === streak) streak++;
      else break;
    }
    return streak;
  };

  // === Додавання / виконання ===
  const handleAddHabit = (habit) => {
    const newHabit = {
      ...habit,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      completedDays: [],
    };
    setHabits([...habits, newHabit]);
    setShowQuickAdd(false);
    setPrefillHabit(null);
  };

  const handleToggleComplete = (habitId) => {
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const isDone = h.completedDays.includes(today);
        const newDays = isDone
          ? h.completedDays.filter(d => d !== today)
          : [...h.completedDays, today].sort();
        return { ...h, completedDays: newDays };
      }
      return h;
    }));
  };

  // === Гортання по колу ===
  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        left: index * CARD_WIDTH,
        behavior: 'smooth'
      });
    }
  };

  const scrollPrev = () => {
    const first = scrollRef.current.scrollLeft;
    const currentIndex = Math.round(first / CARD_WIDTH);
    const newIndex = (currentIndex - 1 + habits.length) % habits.length;
    scrollToIndex(newIndex);
  };

  const scrollNext = () => {
    const first = scrollRef.current.scrollLeft;
    const currentIndex = Math.round(first / CARD_WIDTH);
    const newIndex = (currentIndex + 1) % habits.length;
    scrollToIndex(newIndex);
  };

  // === Статистика ===
  const stats = {
    total: habits.length,
    completedToday: habits.filter(h => h.completedDays.includes(today)).length,
    avgStreak: habits.length
      ? habits.reduce((s, h) => s + getCurrentStreak(h.completedDays), 0) / habits.length
      : 0,
    bestStreak: Math.max(...habits.map(h => getCurrentStreak(h.completedDays)), 0),
  };

  const pieData = [
    { name: 'Виконано', value: stats.completedToday },
    { name: 'Залишилось', value: Math.max(0, stats.total - stats.completedToday) },
  ];

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dateStr = date.toISOString().split('T')[0];
    const completed = habits.filter(h => h.completedDays.includes(dateStr)).length;
    return { date: date.toLocaleDateString('uk-UA', { weekday: 'short' }), completed };
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-950 dark:to-black text-gray-900 dark:text-white overflow-x-hidden">

      {/* Floating Particles */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-orange-400 to-rose-400 rounded-full opacity-20"
            initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
            animate={{ y: [null, -100], x: [null, Math.random() * 100 - 50] }}
            transition={{ duration: 10 + Math.random() * 10, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-orange-100/20 to-amber-100/20 dark:from-pink-900/10 dark:via-orange-900/10 dark:to-amber-900/10" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-orange-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
                Звички, що змінюють життя
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                Кожен день — це нова можливість. Ми допомагаємо тобі її не пропустити.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <motion.button
                  whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => setShowQuickAdd(true)}
                  className="group relative overflow-hidden bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold px-8 py-4 rounded-2xl shadow-xl"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    <Plus className="group-hover:rotate-90 transition-transform" />
                    Створити звичку
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-rose-600 translate-y-full group-hover:translate-y-0 transition-transform" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => navigate('/habits')}
                  className="px-8 py-4 rounded-2xl font-semibold backdrop-blur-xl bg-white/50 dark:bg-white/10 border border-white/20"
                >
                  Переглянути всі
                </motion.button>
              </div>

              <div className="flex gap-8 text-sm">
                {[
                  { icon: <Trophy className="text-amber-500" />, text: 'Досягнення' },
                  { icon: <TrendingUp className="text-emerald-500" />, text: 'Прогрес' },
                  { icon: <Zap className="text-violet-500" />, text: 'Мотивація' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-2"
                  >
                    {item.icon}
                    <span className="text-gray-600 dark:text-gray-400">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div id="hero-card" style={{ rotateX, rotateY, transformStyle: "preserve-3d" }} className="relative perspective-1000">
              <div className="relative p-8 rounded-3xl backdrop-blur-2xl bg-gradient-to-br from-white/80 via-white/60 to-white/40 dark:from-gray-800/80 dark:via-gray-900/60 dark:to-gray-800/40 border border-white/50 shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-rose-400/20 rounded-3xl" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-2xl font-bold mb-1">Твій прогрес</h3>
                      <p className="text-gray-600 dark:text-gray-400">Сьогодні</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                        {stats.completedToday}/{stats.total}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">виконано</p>
                    </div>
                  </div>

                  <div className="h-40 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" stroke="none">
                          {pieData.map((_, idx) => (
                            <Cell key={`cell-${idx}`} fill={idx === 0 ? '#10b981' : '#ef4444'} />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20">
                      <Flame className="w-5 h-5 mx-auto mb-1 text-orange-500" />
                      <div className="text-lg font-bold">{Math.round(stats.avgStreak)}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">середній стрік</div>
                    </div>
                    <div className="text-center p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20">
                      <Trophy className="w-5 h-5 mx-auto mb-1 text-amber-500" />
                      <div className="text-lg font-bold">{stats.bestStreak}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">найкращий</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* СЬОГОДНІШНІ ЗВИЧКИ */}
      {habits.length > 0 && (
        <section className="py-1 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <div className="relative mb-8 text-center">
              <h2 className="inline-block text-5xl md:text-6xl font-black bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                Сьогоднішні звички
              </h2>
              <div className="mx-auto w-36 h-1 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full mt-2" />
            </div>

            <div className="relative">
              {habits.length > VISIBLE_CARDS && (
                <>
                  <button
                    onClick={scrollPrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl flex items-center justify-center hover:scale-110 hover:shadow-orange-500/50 transition-all duration-300 group border border-white/30"
                  >
                    <ChevronLeft className="w-7 h-7 text-orange-600 dark:text-orange-400 group-hover:text-rose-600 transition-colors" />
                  </button>

                  <button
                    onClick={scrollNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl shadow-2xl flex items-center justify-center hover:scale-110 hover:shadow-rose-500/50 transition-all duration-300 group border border-white/30"
                  >
                    <ChevronRight className="w-7 h-7 text-rose-600 dark:text-rose-400 group-hover:text-orange-600 transition-colors" />
                  </button>
                </>
              )}

              <div
                ref={scrollRef}
                className="flex gap-5 overflow-x-hidden snap-x snap-mandatory"
                style={{
                  scrollSnapType: 'x mandatory',
                  scrollBehavior: 'smooth',
                }}
              >
                {[...habits, ...habits.slice(0, VISIBLE_CARDS)].map((habit, idx) => {
                  if (idx >= habits.length + VISIBLE_CARDS) return null;
                  const realHabit = habits[idx % habits.length];
                  const isDone = realHabit.completedDays.includes(today);
                  const streak = getCurrentStreak(realHabit.completedDays);
                  const cfg = categoryConfig[realHabit.category] || categoryConfig.other;

                  return (
                    <motion.div
                      key={`${realHabit.id}-${idx}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (idx % habits.length) * 0.05 }}
                      whileHover={{ y: -8, scale: 1.03 }}
                      className={`flex-shrink-0 w-80 snap-center relative overflow-hidden rounded-3xl p-6 backdrop-blur-xl ${cfg.bg} border border-white/30 shadow-xl`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl" />
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 rounded-2xl bg-white/60 dark:bg-white/20 backdrop-blur">
                            <div className="w-6 h-6 text-gray-700 dark:text-gray-300">{cfg.icon}</div>
                          </div>
                          <button
                            onClick={() => handleToggleComplete(realHabit.id)}
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
                              isDone
                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 shadow-lg'
                                : 'bg-white/60 dark:bg-white/20 border border-white/30'
                            }`}
                          >
                            {isDone && <Check className="w-6 h-6 text-white" />}
                          </button>
                        </div>

                        <h3 className="text-xl font-bold mb-2">{realHabit.name}</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <Flame className="w-4 h-4 text-orange-500" />
                          <span className="font-semibold">{streak} днів</span>
                          {streak > 6 && <Star className="w-4 h-4 text-amber-500 ml-1" />}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {habits.length > 0 && (
        <section className="pt-24 pb-16">
          <div className="max-w-7xl mx-auto px-6">

            <motion.div
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              className="relative p-10 md:p-12 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-orange-100/50 via-pink-100/50 to-amber-100/50 dark:from-orange-900/20 dark:via-pink-900/20 dark:to-amber-900/20 border border-white/30 shadow-2xl mb-12"
            >
              <div className="max-w-4xl mx-auto"><DailyQuote /></div>
            </motion.div>


            <div className="relative mb-4 text-right">
              <h2 className="inline-block text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Прогрес за тиждень
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mt-1 ml-auto" />
            </div>

            {/* Прогрес */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="relative p-6 rounded-3xl backdrop-blur-xl bg-gradient-to-br from-emerald-50/80 via-teal-50/80 to-cyan-50/80 dark:from-emerald-950/50 dark:via-teal-950/50 dark:to-cyan-950/50 border border-white/40 shadow-xl overflow-hidden"
              style={{ boxShadow: '0 12px 32px rgba(52, 211, 153, 0.15)' }}
            >
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={last7Days} margin={{ top: 20, right: 30, left: 10, bottom: 10 }}>
                    <defs>
                      <linearGradient id="progressLine" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#06b6d4" />
                      </linearGradient>
                      <filter id="softGlow">
                        <feGaussianBlur stdDeviation="3" result="blur"/>
                        <feMerge>
                          <feMergeNode in="blur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: '#1f2937', fontSize: 13, fontWeight: 600 }}
                      axisLine={false}
                    />
                    <YAxis
                      tick={{ fill: '#1f2937', fontSize: 13 }}
                      axisLine={false}
                      domain={[0, 'dataMax + 1']}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(255,255,255,0.97)',
                        border: '1px solid #d1fae5',
                        borderRadius: '14px',
                        fontSize: '14px',
                        color: '#065f46'
                      }}
                      itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="url(#progressLine)"
                      strokeWidth={4}
                      dot={{ fill: '#10b981', r: 6, stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{ r: 8, stroke: '#fff', strokeWidth: 3 }}
                      filter="url(#softGlow)"
                      animationDuration={1800}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="flex justify-around mt-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                <div className="text-center">
                  <div className="text-2xl font-bold text-emerald-600">{stats.completedToday}</div>
                  <div>сьогодні</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-teal-600">{Math.round(stats.avgStreak)}</div>
                  <div>середній стрік</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-cyan-600">{stats.bestStreak}</div>
                  <div>рекорд</div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* MODAL */}
      <AnimatePresence>
        {showQuickAdd && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xl flex items-center justify-center z-50 p-4"
            onClick={() => setShowQuickAdd(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={e => e.stopPropagation()}
              className="relative w-full max-w-md"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-rose-400 to-red-400 rounded-3xl blur-xl opacity-50" />
              <div className="relative backdrop-blur-2xl bg-white/90 dark:bg-gray-900/90 rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-3xl font-black bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
                    Нова звичка
                  </h3>
                  <button onClick={() => setShowQuickAdd(false)} className="p-2 rounded-xl hover:bg-white/20 transition-colors">
                    <Plus className="w-6 h-6 rotate-45" />
                  </button>
                </div>
                <AddHabitForm onAdd={handleAddHabit} onCancel={() => setShowQuickAdd(false)} initialValues={prefillHabit} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}