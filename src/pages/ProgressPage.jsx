// pages/ProgressPage.jsx — RPG ТРЕКЕР З ЕМОДЗІ-МОНСТРОМ
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, Flame, Zap, Plus, X, Star, Calendar, Target, Sparkles, ChevronLeft, ChevronRight,
  Heart, Skull, Sword, Shield, Crown, Cookie, Apple, Fish, Gem, Package, ShoppingBag
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import useLocalStorage from '../hooks/useLocalStorage';
import AddHabitForm from '../components/AddHabitForm';

// === ЕМОДЗІ-МОНСТРИ (ЕВОЛЮЦІЯ) ===
const monsterEvolutions = [
  { level: 0, name: 'Яйце', emoji: '🥚', size: 80, bg: 'from-amber-200 to-yellow-300', glow: 'shadow-amber-500/50' },
  { level: 1, name: 'Малюк', emoji: '🐣', size: 100, bg: 'from-pink-300 to-rose-400', glow: 'shadow-pink-500/50' },
  { level: 5, name: 'Підліток', emoji: '🦎', size: 120, bg: 'from-purple-400 to-indigo-500', glow: 'shadow-purple-500/50' },
  { level: 10, name: 'Воїн', emoji: '🦸', size: 140, bg: 'from-red-500 to-orange-600', glow: 'shadow-red-500/50' },
  { level: 20, name: 'Легенда', emoji: '👑', size: 160, bg: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/50' },
];

// === ЇЖА (емоції + ефекти) ===
const foodItems = [
  { id: 'apple', name: 'Яблуко', price: 50, energy: 30, emoji: '🍎', effect: '+30 HP' },
  { id: 'carrot', name: 'Морква', price: 80, energy: 50, emoji: '🥕', effect: '+50 Енергії' },
  { id: 'fish', name: 'Риба', price: 150, energy: 100, emoji: '🐟', effect: '+100 Сили' },
  { id: 'cookie', name: 'Печиво', price: 200, energy: 150, emoji: '🍪', effect: '+150 Щастя' },
];

// === МАГІЧНІ ПРЕДМЕТИ ===
const magicItems = [
  { id: 'shield', name: 'Щит Воїна', price: 300, emoji: '🛡️', stat: 'defense', value: 5 },
  { id: 'sword', name: 'Меч Сили', price: 500, emoji: '⚔️', stat: 'attack', value: 10 },
  { id: 'crown', name: 'Корона Легенди', price: 1000, emoji: '👑', type: 'cosmetic' },
];

export default function ProgressPage() {
  const [habits, setHabits] = useLocalStorage('habits', []);
  const [points, setPoints] = useLocalStorage('userPoints', 0);
  const [monsterEnergy, setMonsterEnergy] = useLocalStorage('monsterEnergy', 100);
  const [monsterHunger, setMonsterHunger] = useLocalStorage('monsterHunger', 0);
  const [equipped, setEquipped] = useLocalStorage('equippedItems', {});
  const [purchased, setPurchased] = useLocalStorage('purchasedItems', []);
  const [bossHp, setBossHp] = useLocalStorage('bossHp', 500);
  const [lastBossDefeat, setLastBossDefeat] = useLocalStorage('lastBossDefeat', null);

  const [selectedHabit, setSelectedHabit] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showShop, setShowShop] = useState(false);
  const [showBattle, setShowBattle] = useState(false);
  const [showEvolution, setShowEvolution] = useState(false);
  const [feeding, setFeeding] = useState(null);
  const [achievement, setAchievement] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const scrollRef = useRef(null);

  const today = new Date().toISOString().split('T')[0];
  const isSunday = new Date().getDay() === 0;

  // === СТРІК ===
  const calculateStreak = (days) => {
    if (!days?.length) return { current: 0, best: 0 };
    const sorted = [...days].sort().reverse();
    let current = 0;
    let check = new Date(today);
    while (sorted.includes(check.toISOString().split('T')[0])) {
      current++;
      check.setDate(check.getDate() - 1);
    }
    let best = current;
    let temp = 1;
    for (let i = 1; i < sorted.length; i++) {
      const diff = (new Date(sorted[i-1]) - new Date(sorted[i])) / 86400000;
      if (diff === 1) temp++;
      else { best = Math.max(best, temp); temp = 1; }
    }
    best = Math.max(best, temp);
    return { current, best };
  };

  const habitsWithStreaks = useMemo(() => {
    return (Array.isArray(habits) ? habits : []).map(h => {
      const { current, best } = calculateStreak(h.completedDays);
      return { ...h, currentStreak: current, bestStreak: Math.max(best, h.bestStreak || 0) };
    });
  }, [habits, today]);

  // === СТАТИСТИКА + EXP ===
  const stats = useMemo(() => {
    const totalDone = habitsWithStreaks.reduce((s, h) => s + h.completedDays.length, 0);
    const totalPoints = habitsWithStreaks.reduce((s, h) => s + h.currentStreak * 10 + h.completedDays.length * 5, 0);
    const currentLevel = Math.floor(totalPoints / 100) + 1;
    const expInLevel = totalPoints % 100;
    const expNeeded = 100;

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = habitsWithStreaks.filter(h => h.completedDays.includes(dateStr)).length;
      return { date: d.toLocaleDateString('uk-UA', { weekday: 'short' }), value: count };
    }).reverse();

    return { totalDone, totalPoints, currentLevel, expInLevel, expNeeded, last7Days };
  }, [habitsWithStreaks]);

  // === МОНСТР ===
  const currentMonster = monsterEvolutions.reduce((prev, curr) => 
    (stats.currentLevel >= curr.level ? curr : prev), monsterEvolutions[0]);

  // === ЕВОЛЮЦІЯ ===
  const [prevLevel, setPrevLevel] = useState(stats.currentLevel);
  useEffect(() => {
    if (stats.currentLevel > prevLevel) {
      setShowEvolution(true);
      setPrevLevel(stats.currentLevel);
      setTimeout(() => setShowEvolution(false), 3500);
    }
  }, [stats.currentLevel, prevLevel]);

  // === ГОЛОД (кожні 2 хв +5%) ===
  useEffect(() => {
    const interval = setInterval(() => {
      setMonsterHunger(h => Math.min(100, h + 5));
    }, 120000);
    return () => clearInterval(interval);
  }, []);

  // === БОСС (щонеділі) ===
  useEffect(() => {
    if (isSunday && lastBossDefeat !== today) {
      setBossHp(500);
      setShowBattle(true);
    }
  }, [isSunday, lastBossDefeat, today]);

  const attackBoss = () => {
    const damage = 60 + (equipped.sword ? 20 : 0);
    setBossHp(hp => {
      const newHp = hp - damage;
      if (newHp <= 0) {
        setPoints(p => p + 250);
        setMonsterEnergy(e => Math.min(100, e + 80));
        setLastBossDefeat(today);
        setShowBattle(false);
        return 0;
      }
      return newHp;
    });
  };

  // === ДОДАТИ ЗВИЧКУ ===
  const handleAddHabit = (newHabit) => {
    const habit = { ...newHabit, id: Date.now().toString(), createdAt: today, completedDays: [] };
    setHabits(prev => [...prev, habit]);
    setPoints(p => p + 30);
    setMonsterEnergy(e => Math.min(100, e + 15));
    setShowAddModal(false);
  };

  // === КУПИТИ + НАГОДУВАТИ ===
  const buyAndFeed = (item) => {
    if (points >= item.price && !purchased.includes(item.id)) {
      setPurchased(prev => [...prev, item.id]);
      setPoints(p => p - item.price);
      setMonsterEnergy(e => Math.min(100, e + item.energy));
      setMonsterHunger(h => Math.max(0, h - 25));
      setFeeding(item);
      setTimeout(() => setFeeding(null), 2000);
    }
  };

  const equipItem = (item) => {
    setEquipped(prev => ({ ...prev, [item.stat]: item.id }));
  };

  const scrollLeft = () => scrollRef.current?.scrollBy({ left: -300, behavior: 'smooth' });
  const scrollRight = () => scrollRef.current?.scrollBy({ left: 300, behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-950 dark:to-black text-gray-900 dark:text-white overflow-x-hidden">

      {/* ЧАСТКИ НА ФОНІ */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-64 h-64 rounded-full blur-3xl opacity-15"
            style={{ background: `radial-gradient(circle, hsl(${i * 60}, 80%, 60%), transparent 70%)` }}
            animate={{
              x: [0, 150, 0],
              y: [0, -150, 0],
              scale: [1, 1.6, 1],
            }}
            transition={{ duration: 12 + i * 3, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* МОНСТР + СТАТИСТИКА */}
      <motion.header initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 text-center pt-12 pb-8">
        <div className="flex flex-col items-center gap-6">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="relative"
          >
            <div className={`w-${currentMonster.size/4} h-${currentMonster.size/4} rounded-full bg-gradient-to-br ${currentMonster.bg} flex items-center justify-center text-6xl shadow-2xl ${currentMonster.glow}`}>
              {currentMonster.emoji}
            </div>
            {showEvolution && (
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: [1, 2.5, 1], rotate: [0, 180, 360] }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sparkles className="w-24 h-24 text-yellow-400" />
                <div className="absolute text-3xl font-black text-white">ЕВОЛЮЦІЯ!</div>
              </motion.div>
            )}
          </motion.div>

          <div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-orange-600 via-rose-600 to-red-600 bg-clip-text text-transparent">
              {currentMonster.name}
            </h1>
            <p className="mt-1 text-lg">Рівень {stats.currentLevel} • EXP: {stats.expInLevel}/{stats.expNeeded}</p>

            {/* HP БАР */}
            <div className="flex justify-center items-center gap-3 mt-3">
              <Heart className="w-6 h-6 text-red-500 animate-pulse" />
              <div className="w-48 bg-gray-300 rounded-full h-5 overflow-hidden border border-gray-400">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${monsterEnergy}%` }}
                  className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                />
              </div>
              <span className="text-sm font-bold">{monsterEnergy}%</span>
            </div>

            {/* ГОЛОД */}
            <div className="flex justify-center items-center gap-2 mt-2 text-sm">
              <span>Голод:</span>
              <div className="w-32 bg-gray-300 rounded-full h-3 overflow-hidden">
                <motion.div
                  animate={{ width: `${monsterHunger}%` }}
                  className="h-full bg-gradient-to-r from-yellow-400 to-red-600"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.header>

      {/* СТАТИСТИКА КАРТКИ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mb-12">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {[
            { label: 'Сьогодні', value: habitsWithStreaks.filter(h => h.completedDays.includes(today)).length, icon: Calendar, color: 'emerald' },
            { label: 'Стрік', value: Math.max(...habitsWithStreaks.map(h => h.currentStreak), 0), icon: Flame, color: 'rose' },
            { label: 'Очки', value: points, icon: Star, color: 'yellow' },
            { label: 'Босс', value: '👹', onClick: () => setShowBattle(true) },
            { label: 'Їжа', value: '🍎', onClick: () => setShowShop(true) },
            { label: 'Магазин', value: <ShoppingBag className="w-5 h-5" />, onClick: () => setShowShop(true) },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={stat.onClick}
              className={`p-4 rounded-2xl backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 border border-white/30 shadow-lg text-center ${stat.onClick ? 'cursor-pointer hover:scale-105 transition' : ''}`}
            >
              {stat.icon && <stat.icon className={`w-5 h-5 mx-auto mb-1 text-${stat.color}-600`} />}
              <div className="text-2xl font-black">{stat.value}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* КАРУСЕЛЬ КВЕСТІВ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-black bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">Квести</h2>
          <div className="flex gap-2">
            <button onClick={scrollLeft} className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 transition"><ChevronLeft className="w-5 h-5" /></button>
            <button onClick={scrollRight} className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 transition"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>

        <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4">
          {habitsWithStreaks.length === 0 ? (
            <div className="flex items-center justify-center w-full py-16">
              <div className="p-8 rounded-3xl bg-white/50 dark:bg-gray-800/50 border-2 border-dashed border-orange-400/50 text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">Твій монстр чекає на квест!</p>
                <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowAddModal(true)} className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold">
                  Почати пригоду
                </motion.button>
              </div>
            </div>
          ) : (
            habitsWithStreaks.map((h, i) => {
              const isHot = h.currentStreak >= 7;
              return (
                <motion.div
                  key={h.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedHabit(h)}
                  className="flex-shrink-0 w-72 cursor-pointer"
                >
                  <div className={`relative p-6 rounded-3xl backdrop-blur-xl border-2 transition-all
                    ${isHot ? `border-rose-500 shadow-lg ${currentMonster.glow}` : 'border-white/30'}
                    bg-white/70 dark:bg-gray-800/70 overflow-hidden`}>
                    <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-rose-400 to-orange-600" />
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-3xl">{h.currentStreak >= 7 ? '🔥' : '🎯'}</div>
                        {isHot && <Flame className="w-6 h-6 text-orange-500 animate-pulse" />}
                      </div>
                      <h3 className="font-bold text-lg mb-2">{h.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Стрік: {h.currentStreak} днів</p>
                      <div className="w-full bg-gray-300 rounded-full h-3">
                        <div className="bg-gradient-to-r from-rose-500 to-orange-500 h-full rounded-full transition-all" style={{ width: `${Math.min(h.currentStreak * 4, 100)}%` }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </section>

      {/* ГРАФІК + БОСС */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mb-20 grid lg:grid-cols-2 gap-12">
        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} className="p-8 rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-white/30 shadow-2xl">
          <h3 className="text-2xl font-black mb-6 bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">Прогрес</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={stats.last7Days}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#888" />
              <YAxis stroke="#888" />
              <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', borderRadius: '12px', border: 'none' }} />
              <Area type="monotone" dataKey="value" stroke="#f97316" fill="#f97316" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} className="p-8 rounded-3xl backdrop-blur-xl bg-red-500/10 dark:bg-red-900/20 border border-red-500/50 shadow-2xl">
          <h3 className="text-2xl font-black mb-6 bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">Босс тижня</h3>
          <div className="text-center">
            <div className="text-7xl mb-3">👹</div>
            <p className="font-bold text-lg">Лінивий Дракон</p>
            <div className="w-full bg-gray-700 rounded-full h-6 mt-4 overflow-hidden">
              <motion.div
                animate={{ width: `${(bossHp / 500) * 100}%` }}
                className="h-full bg-gradient-to-r from-red-600 to-rose-600"
              />
            </div>
            <p className="text-sm mt-2">{bossHp} / 500 HP</p>
            <button onClick={attackBoss} className="mt-4 px-6 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition flex items-center gap-2 mx-auto">
              <Sword className="w-5 h-5" /> Атакувати
            </button>
          </div>
        </motion.div>
      </section>

      {/* МАГАЗИН */}
      <AnimatePresence>
        {showShop && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-6" onClick={() => setShowShop(false)}>
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} className="max-w-4xl w-full max-h-[80vh] overflow-y-auto p-8 rounded-3xl backdrop-blur-2xl bg-white/90 dark:bg-gray-900/90 border border-white/20 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Магічний ринок</h3>
                <button onClick={() => setShowShop(false)} className="p-2 rounded-xl hover:bg-white/20"><X className="w-6 h-6" /></button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...foodItems, ...magicItems].map(item => {
                  const owned = purchased.includes(item.id);
                  return (
                    <motion.div
                      key={item.id}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => !owned && setSelectedItem(item)}
                      className={`p-5 rounded-2xl backdrop-blur-xl border-2 text-center transition-all ${owned ? 'border-green-500 bg-green-500/10' : 'border-white/30 bg-white/50 dark:bg-gray-800/50'} ${!owned && 'cursor-pointer'}`}
                    >
                      <div className="text-5xl mb-2">{item.emoji}</div>
                      <p className="font-bold text-sm">{item.name}</p>
                      <p className="text-xs text-gray-600">{item.price} очок</p>
                      {item.effect && <p className="text-xs text-emerald-600">{item.effect}</p>}
                      <p className="text-xs mt-1">{owned ? 'Придбано' : 'Купити'}</p>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* КУПИТИ ПРЕДМЕТ */}
      <AnimatePresence>
        {selectedItem && !purchased.includes(selectedItem.id) && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-6" onClick={() => setSelectedItem(null)}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="max-w-md w-full p-8 rounded-3xl backdrop-blur-2xl bg-white/90 dark:bg-gray-900/90 border border-white/20 shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="text-center">
                <div className="text-6xl mb-4">{selectedItem.emoji}</div>
                <h3 className="text-2xl font-black mb-2">{selectedItem.name}</h3>
                <p className="text-gray-600 mb-4">Вартість: {selectedItem.price} очок</p>
                {selectedItem.effect && <p className="text-emerald-600 text-sm mb-4">{selectedItem.effect}</p>}
                <div className="flex gap-3">
                  <button onClick={() => { buyAndFeed(selectedItem); setSelectedItem(null); }} disabled={points < selectedItem.price} className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold disabled:opacity-50">
                    {selectedItem.energy ? 'Купити та нагодувати' : 'Купити'}
                  </button>
                  <button onClick={() => setSelectedItem(null)} className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold">
                    Скасувати
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ГОДУВАННЯ */}
      <AnimatePresence>
        {feeding && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <motion.div
              animate={{ y: [0, -120, 0], rotate: [0, 360, 720] }}
              transition={{ duration: 1.5 }}
              className="text-9xl"
            >
              {feeding.emoji}
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute text-6xl font-black text-yellow-400 drop-shadow-lg"
            >
              YUMMY!
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ДОДАТИ КВЕСТ */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} onClick={e => e.stopPropagation()} className="relative w-full max-w-md">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-rose-400 to-red-400 rounded-3xl blur-xl opacity-50" />
              <div className="relative backdrop-blur-2xl bg-white/90 dark:bg-gray-900/90 rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-3xl font-black bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">Новий квест</h3>
                  <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl hover:bg-white/20"><Plus className="w-6 h-6 rotate-45" /></button>
                </div>
                <AddHabitForm onAdd={handleAddHabit} onCancel={() => setShowAddModal(false)} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}