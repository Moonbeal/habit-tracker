// pages/ProgressPage.jsx
import React, { useMemo, useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Flame, Zap, Plus, X, Star, Calendar, Sparkles, ChevronLeft, ChevronRight,
  Heart, Skull, Sword, Shield, Crown, Cookie, Apple, Fish, Gem, Package, ShoppingBag, User,
  CheckCircle, AlertTriangle, Info, ShieldCheck, Axe, HelpCircle, Briefcase, UtensilsCrossed,
  FlaskConical, Key, Edit, Loader2
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import useLocalStorage from '../hooks/useLocalStorage';
import AddHabitForm from '../components/AddHabitForm';
import { GoogleGenerativeAI } from '@google/generative-ai';

const monsterEvolutions = [
  { xpThreshold: 0,    name: 'Яйце',    emoji: '🥚', size: 100, bg: 'from-amber-200 to-yellow-300', glow: 'shadow-amber-500/50' },
  { xpThreshold: 100,  name: 'Малюк',   emoji: '🐣', size: 120, bg: 'from-pink-300 to-rose-400', glow: 'shadow-pink-500/50' },
  { xpThreshold: 500,  name: 'Підліток', emoji: '🦎', size: 140, bg: 'from-purple-400 to-indigo-500', glow: 'shadow-purple-500/50' },
  { xpThreshold: 1500, name: 'Воїн',    emoji: '🦸', size: 160, bg: 'from-red-500 to-orange-600', glow: 'shadow-red-500/50' },
  { xpThreshold: 3000, name: 'Легенда',  emoji: '🦁', size: 180, bg: 'from-emerald-500 to-teal-600', glow: 'shadow-emerald-500/50' },
  { xpThreshold: 6000, name: 'Майстер', emoji: '🧙', size: 200, bg: 'from-cyan-400 to-sky-500', glow: 'shadow-cyan-500/50' },
  { xpThreshold: 10000,name: 'Володар', emoji: '🧞', size: 220, bg: 'from-rose-500 to-fuchsia-600', glow: 'shadow-rose-500/50' },
  { xpThreshold: 20000,name: 'Божество',emoji: '✨', size: 240, bg: 'from-yellow-300 via-amber-400 to-orange-500', glow: 'shadow-yellow-400/60' },
];

const foodItems = [
  { id: 'bread', name: 'Хліб', price: 30, stamina: 15, satiety: 15, xp: 15, emoji: '🍞', effect: '+15 XP, +15 Витр, +15 Сит.' }, 
  { id: 'apple', name: 'Яблуко', price: 50, stamina: 30, satiety: 25, xp: 30, emoji: '🍎', effect: '+30 XP, +30 Витр, +25 Сит.' }, 
  { id: 'cookie', name: 'Печиво', price: 80, stamina: 50, satiety: 10, xp: 50, emoji: '🍪', effect: '+50 XP, +50 Витр, +10 Сит.' }, 
  { id: 'fish', name: 'Риба', price: 100, stamina: 65, satiety: 50, xp: 100, emoji: '🐟', effect: '+100 XP, +65 Витр, +50 Сит.' }, 
  { id: 'chicken', name: 'Курка', price: 120, stamina: 70, satiety: 70, xp: 150, emoji: '🍗', effect: '+150 XP, +70 Витр, +70 Сит.' }, 
  { id: 'steak', name: 'Стейк', price: 150, stamina: 80, satiety: 90, xp: 250, emoji: '🥩', effect: '+250 XP, +80 Витр, +90 Сит.' }, 
  { id: 'sushi', name: 'Суші-сет', price: 200, stamina: 90, satiety: 60, xp: 350, emoji: '🍣', effect: '+350 XP, +90 Витр, +60 Сит.' }, 
  { id: 'cake', name: 'Святковий Торт', price: 300, stamina: 100, satiety: 50, xp: 400, emoji: '🎂', effect: '+400 XP, +100 Витр, +50 Сит.' }, 
  { id: 'gem', name: 'Магічний Кристал', price: 250, stamina: 100, satiety: 20, xp: 300, emoji: '💎', effect: '+300 XP, Повна Витр, +20 Сит.' }, 
  { id: 'magic_nectar', name: 'Магічний Нектар', price: 400, stamina: 100, satiety: 20, xp: 500, emoji: '🍹', effect: '+500 XP, +100 Витр, +20 Сит.' }, 
  { id: 'golden_apple', name: 'Золоте Яблуко', price: 1000, stamina: 100, satiety: 100, xp: 1000, emoji: '🌟', effect: '+1000 XP, Повна Витр, Повна Сит.!' }, 
];

const equipmentItems = [
  { id: 'dagger_upgrade', name: 'Покращення Кинджалом', price: 200, emoji: '🗡️', stat: 'attack', value: 20, effect: '+20 Сила' },  
  { id: 'sword_upgrade', name: 'Покращення Мечем', price: 350, emoji: '⚔️', stat: 'attack', value: 40, effect: '+40 Сила' },  
  { id: 'axe_upgrade', name: 'Покращення Сокирою', price: 600, emoji: '🪓', stat: 'attack', value: 80, effect: '+80 Сила' }, 
  { id: 'greatsword_upgrade', name: 'Покращення Великим Мечем', price: 1000, emoji: '🗡️✨', stat: 'attack', value: 150, effect: '+150 Сила' }, 
  { id: 'stamina_charm', name: 'Амулет Економії', price: 1500, emoji: '📿', stat: 'efficiency', value: 5, effect: '-5 Витрата Витр.' }, 
  { id: 'relic_of_focus', name: 'Реліквія Фокусу', price: 3500, emoji: '👁️', stat: 'efficiency', value: 15, effect: '-15 Витрата Витр.' }, 
  { id: 'potion_strength', name: 'Зілля Сили', price: 100, emoji: '🧪', type: 'potion', effect: '+20 Сили на 1 бій (майбутнє)' },
  { id: 'crown', name: 'Корона Легенди', price: 7500, emoji: '👑', type: 'cosmetic', effect: '2x очок за квести!' }, 
  { id: 'golden_key', name: 'Золотий Ключ', price: 15000, emoji: '🔑', type: 'artifact', effect: 'Відкриває таємниці?' }, 
];

const todayISO = () => new Date().toISOString().split('T')[0];
const calculateStreak = (days) => { if (!Array.isArray(days)||days.length===0)return{current:0,best:0}; const s=[...new Set(days)].sort((a,b)=>new Date(b)-new Date(a)); let c=0; let k=new Date(todayISO()); while(s.includes(k.toISOString().split('T')[0])){c++;k.setDate(k.getDate()-1);} let b=0; let t=1; for(let i=1;i<s.length;i++){const d=(new Date(s[i-1])-new Date(s[i]))/864e5; if(d===1)t++;else{b=Math.max(b,t);t=1;}} b=Math.max(b,t,c); return{current:c,best:b}; };

function MonsterDisplay({ monster, showEvolution, size }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="relative">
        <div style={{ width: size, height: size }} className={`rounded-full bg-gradient-to-br ${monster?.bg || 'from-gray-400 to-gray-500'} flex items-center justify-center text-center text-[${Math.min(96, Math.round(size / 1.5))}px] shadow-lg ${monster?.glow || ''}`}>
          <div style={{ fontSize: Math.min(96, Math.round(size / 1.5)) }}>{monster?.emoji || '❓'}</div>
        </div>
        {showEvolution && ( <motion.div initial={{ scale: 0 }} animate={{ scale: [1, 1.8, 1] }} transition={{ duration: 1.2 }} className="absolute inset-0 flex items-center justify-center pointer-events-none"> <Sparkles className="w-16 h-16 text-yellow-400" /> <div className="absolute text-xl font-extrabold text-white drop-shadow-lg">ЕВОЛЮЦІЯ!</div> </motion.div> )}
      </motion.div>
    </div>
  );
}

function BossBattleModal({ open, onClose, bossHp, maxBossHp, onAttack, playerStamina, attackCost, canAttack, onAutoAttack, rewardText, isBossHit }) {
  return (
    <AnimatePresence> {open && ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6"> <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="max-w-3xl w-full rounded-3xl bg-gradient-to-br from-gray-800 to-gray-900 text-white p-6 border border-red-500/30 shadow-2xl"> 
        <div className="flex justify-between items-start"> 
          <h3 className="text-2xl font-black text-red-500 tracking-tight">Битва з Босом</h3> 
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-white/10"><X className="w-5 h-5" /></button> 
        </div> 
        <div className="mt-6 grid grid-cols-2 gap-4 items-center"> <div className="text-center"> <motion.div animate={isBossHit ? { scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] } : { scale: 1, rotate: 0 }} transition={{ duration: 0.3 }} className="text-6xl mb-2">👹</motion.div> <p className="font-bold">Лінивий Дракон</p> <p className="text-xs text-gray-400">(Рівень {Math.floor((maxBossHp - 500) / 100) + 1})</p> </div> <div> <p className="text-sm text-gray-400">HP Боса</p> <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden mt-1"> <div style={{ width: `${(bossHp / maxBossHp) * 100}%` }} className="h-full bg-gradient-to-r from-red-600 to-rose-600 transition-all" /> </div> <p className="text-sm mt-2 font-semibold">{bossHp} / {maxBossHp}</p> <div className="mt-4"> <p className="text-sm text-gray-400">Ваша Витривалість</p> <div className="flex items-center gap-2 mt-2"> <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden"> <div style={{ width: `${(playerStamina / 100) * 100}%` }} className="h-full bg-gradient-to-r from-indigo-400 to-purple-500" /> </div> <span className="text-sm font-semibold">{playerStamina}%</span> </div> <p className="text-xs text-gray-500 mt-2">Атака коштує {attackCost} витривалості.</p> </div> </div> </div> <div className="mt-6 flex flex-col items-center gap-3 justify-center"> <button onClick={onAttack} disabled={!canAttack} className="px-6 py-3 rounded-xl bg-red-600 text-white font-bold disabled:opacity-40 flex items-center gap-2"> <Sword className="w-5 h-5" /> Атакувати </button> <button onClick={onAutoAttack} disabled={!canAttack} className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold disabled:opacity-40">Авто-удар (x3)</button> </div> <p className="text-center text-sm text-gray-300 mt-4">{rewardText}</p> </motion.div> </motion.div> )} </AnimatePresence>
  );
}

function OnboardingModal({ open, onClose }) {
  const steps = [ { title: '👋 Привіт!', text: 'Це твій монстр! Дай йому ім\'я та годуй його, щоб він ріс та ставав сильнішим.' }, { title: '🍎 Годування та XP', text: 'Купуй їжу в магазині 🛒. Їжа дає XP (досвід ✨) для еволюції монстра, а також відновлює твою Витривалість ⚡️ та Ситість 🍪.' }, { title: '🔥 Стрік Годування', text: 'Годуй монстра *щодня*, щоб підтримувати "вогник" стріку! Чим довший стрік, тим краще!' }, { title: '🎯 Квести та Очки', text: 'Виконуй щоденні квести (звички), щоб заробити Очки 🌟 (валюту) та відновити Витривалість ⚡️.' }, { title: '🤖 Дошка Старка', text: 'АІ-асистент "Старк" буде аналізувати твій прогрес та створювати унікальні квести на "Дошці Доручень". Виконуй їх для супер-нагород!' }, { title: '👹 Боси!', text: 'Кожні 5 квестів з\'являється Бос! Ти витрачаєш витривалість на кожну атаку. Бій закінчується, коли витривалість = 0 (або бос переможений)!' }, { title: '🏆 Винагороди', text: 'Перемога над босом дає очки + XP, рівні його HP, та відновлює всю витривалість!'}, { title: '⚔️ Магазин', text: 'За Очки 🌟 купуй їжу (для XP/Витривалості/Ситості) або покращення Cили (🗡️) та Ефективності (📿). Корона 👑 дає 2x очок за квести!' }, ]; const [index, setIndex] = useState(0); useEffect(() => { if (!open) setIndex(0); }, [open]); const next = () => setIndex(i => Math.min(i + 1, steps.length - 1)); const prev = () => setIndex(i => Math.max(i - 1, 0)); const isLastStep = index === steps.length - 1; return ( <AnimatePresence> {open && ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-6"> <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="max-w-md w-full rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-2xl"> 
        <h3 className="text-2xl font-bold tracking-tight">{steps[index].title}</h3> 
        <p className="text-base text-gray-600 dark:text-gray-300 mt-3">{steps[index].text}</p> 
        <div className="mt-6 flex justify-between items-center"> <div> <button onClick={prev} disabled={index === 0} className="px-3 py-2 rounded-xl bg-gray-100 dark:bg-gray-700 disabled:opacity-40">Назад</button> </div> <div className="flex items-center gap-2 relative h-10"> <AnimatePresence initial={false} mode='wait'> {!isLastStep && ( <motion.div key="next-skip" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }} className="flex items-center gap-2"> <button onClick={next} className="px-3 py-2 rounded-xl bg-orange-500 text-white">Далі</button> <button onClick={onClose} className="px-3 py-2 rounded-xl bg-gray-200 dark:bg-gray-600">Пропустити</button> </motion.div> )} {isLastStep && ( <motion.div key="done" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}> <button onClick={onClose} className="px-3 py-2 rounded-xl bg-emerald-500 text-white">Готово</button> </motion.div> )} </AnimatePresence> </div> </div> </motion.div> </motion.div> )} </AnimatePresence> );
}


export default function ProgressPage() {
  const [habits, setHabits] = useLocalStorage('habits', []);
  const [points, setPoints] = useLocalStorage('userPoints', 0);
  const [playerXP, setPlayerXP] = useLocalStorage('playerXP', 0);
  const [stamina, setStamina] = useLocalStorage('monsterStamina', 100);
  const [satiety, setSatiety] = useLocalStorage('monsterSatiety', 100); 
  const [purchasedCosmetics, setPurchasedCosmetics] = useLocalStorage('purchasedCosmetics', []);
  const [equipmentStats, setEquipmentStats] = useLocalStorage('equipmentStats', { attack: 0, efficiency: 0 }); 
  const [bossHp, setBossHp] = useLocalStorage('bossHp', 500);
  const [bossDefeatCount, setBossDefeatCount] = useLocalStorage('bossDefeatCount', 0);
  const [firstVisit, setFirstVisit] = useLocalStorage('firstVisit', true);
  const [characterName, setCharacterName] = useLocalStorage('characterName', 'Мій Монстр');
  const [dailyFeedStreak, setDailyFeedStreak] = useLocalStorage('dailyFeedStreak', { count: 0, lastFed: null });
  const [tasksSinceLastBoss, setTasksSinceLastBoss] = useLocalStorage('tasksSinceLastBoss', 0);
  const [tempName, setTempName] = useState(characterName);

  const [starkQuests, setStarkQuests] = useLocalStorage('starkQuests', []); 
  const [lastStarkCheck, setLastStarkCheck] = useLocalStorage('lastStarkCheck', null); 
  const [coachMessage, setCoachMessage] = useState(null);
  const [isCoachLoading, setIsCoachLoading] = useState(false); 
  const [genAIModel, setGenAIModel] = useState(null); 
  const [shopAdvice, setShopAdvice] = useState(null);
  const [isShopAdviceLoading, setIsShopAdviceLoading] = useState(false);
  
  const [selectedItem, setSelectedItem] = useState(null);
  const [showShop, setShowShop] = useState(false);
  const [showBattle, setShowBattle] = useState(false);
  const [showEvolution, setShowEvolution] = useState(false);
  const [feeding, setFeeding] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(firstVisit);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [toast, setToast] = useState(null);
  const [isBossHit, setIsBossHit] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [shopTab, setShopTab] = useState('food'); 

  const scrollRef = useRef(null);
  const today = todayISO();
  const currentMaxBossHp = useMemo(() => 500 + bossDefeatCount * 100, [bossDefeatCount]);

  const habitsWithStreaks = useMemo(() => (Array.isArray(habits) ? habits : []).map(h => ({ ...h, ...calculateStreak(h.completedDays || []), isCompletedToday: (h.completedDays || []).includes(todayISO()) })), [habits]);
  const stats = useMemo(() => ({
    last7Days: Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const count = habitsWithStreaks.filter(h => (h.completedDays || []).includes(dateStr)).length;
      return { 
        date: d.toLocaleDateString('uk-UA', { weekday: 'short' }), 
        value: count 
      };
    }).reverse()
  }), [habitsWithStreaks]);
  const { currentMonsterData, currentLevel, xpForNextLevel, xpInCurrentLevel } = useMemo(() => { if (!monsterEvolutions?.length) return { currentMonsterData: { name: 'Монстр', emoji: '❓', size: 100, bg: 'from-gray-400 to-gray-500', glow: '' }, currentLevel: 1, xpForNextLevel: 100, xpInCurrentLevel: 0 }; const currentEvo = monsterEvolutions.reduce((p, c) => (playerXP >= c.xpThreshold ? c : p), monsterEvolutions[0]); if (!currentEvo) return { currentMonsterData: monsterEvolutions[0], currentLevel: 1, xpForNextLevel: monsterEvolutions[1]?.xpThreshold || 100, xpInCurrentLevel: playerXP || 0 }; const idx = monsterEvolutions.indexOf(currentEvo); const nextEvo = monsterEvolutions[idx + 1]; const xpInLvl = playerXP - currentEvo.xpThreshold; const nextThresh = nextEvo ? nextEvo.xpThreshold : currentEvo.xpThreshold; const needed = nextEvo ? (nextThresh - currentEvo.xpThreshold) : (xpInLvl > 0 ? xpInLvl : 1); return { currentMonsterData: { ...currentEvo }, currentLevel: idx + 1, xpForNextLevel: Math.max(1, needed), xpInCurrentLevel: Math.max(0, xpInLvl) }; }, [playerXP]);
  
  const isCrownOwned = useMemo(() => purchasedCosmetics.includes('crown'), [purchasedCosmetics]);
  const currentMonster = useMemo(() => ({
    ...currentMonsterData,
    level: currentLevel,
    emoji: currentMonsterData.emoji
  }), [currentMonsterData, currentLevel]);

  const monsterDisplaySize = useMemo(() => { 
    const baseSize = currentMonsterData?.size || 120; 
    if (windowWidth < 640) return Math.max(80, baseSize * 0.7); 
    if (windowWidth < 768) return baseSize * 0.85; 
    if (windowWidth < 1024) return baseSize * 1.0; 
    if (windowWidth < 1280) return baseSize * 1.1; 
    return baseSize * 1.2; 
  }, [currentMonsterData?.size, windowWidth]);
  
  const currentAttackBonus = equipmentStats?.attack || 0;
  const currentStaminaReduction = equipmentStats?.efficiency || 0;
  
  const currentAttackCost = useMemo(() => {
    const baseCost = 20 + bossDefeatCount * 2;
    return Math.max(5, baseCost - currentStaminaReduction);
  }, [bossDefeatCount, currentStaminaReduction]);
  
  const canAttack = stamina >= currentAttackCost;
  const baseDamage = 60; 

  useEffect(() => {
    const initAI = () => {
      const storedKey = localStorage.getItem('gemini_api_key');
      if (storedKey) {
        try {
          const genAI = new GoogleGenerativeAI(storedKey);
          const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash" 
          });
          setGenAIModel(model); 
          console.log("Stark AI (Gemini 2.5) initialized (Simplified Mode).");
        } catch (error) {
          console.error("Failed to initialize Gemini:", error);
          setCoachMessage("Помилка АІ: Не вдалося завантажити модель 2.5-flash.");
        }
      } else {
        setCoachMessage("АІ 'Старк' не налаштовано. Додай API ключ у налаштуваннях.");
      }
    };
    initAI();
  }, []);

  const [prevLevel, setPrevLevel] = useState(currentLevel); 
  useEffect(() => { 
    if (currentLevel > prevLevel) { 
      setShowEvolution(true); 
      setPrevLevel(currentLevel); 
      setTimeout(() => setShowEvolution(false), 3500); 
      setToast({ text: `Рівень ${currentLevel}! ${currentMonsterData?.name || ''}!`, type: 'success' }); 
      setCoachMessage(`Вау! ${characterName}, ми еволюціонували у ${currentMonsterData?.name}! Так тримати!`);
    } 
  }, [currentLevel, prevLevel, currentMonsterData?.name, setToast, characterName]);

  useEffect(() => {
    const i = setInterval(() => {
      setSatiety(s => Math.max(0, s - 2)); 
    }, 120000); 
    return () => clearInterval(i);
  }, [setSatiety]);
  
  useEffect(() => { if (tasksSinceLastBoss >= 5 && bossHp <= 0) { setBossHp(currentMaxBossHp); setShowBattle(true); setTasksSinceLastBoss(0); setToast({ text: `👹 З\'явився Бос Рівня ${bossDefeatCount + 1}! Час до бою!`, type: 'warning' }); } }, [tasksSinceLastBoss, bossHp, currentMaxBossHp, bossDefeatCount, setBossHp, setShowBattle, setTasksSinceLastBoss, setToast]);
  
  useEffect(() => {
    if (stamina <= 0 && showBattle) {
      const xpLost = Math.floor(xpInCurrentLevel / 3);
      setPlayerXP(xp => Math.max(currentMonsterData.xpThreshold || 0, xp - xpLost));
      setToast({text:`💀 Поразка! Ви втратили ${xpLost} XP! Відпочиньте та поїжте.`,type:'error'});
      setShowBattle(false);
      setStamina(10);
      setTimeout(() => callStarkGenerator(), 1500);
    }
  }, [stamina, showBattle, xpInCurrentLevel, currentMonsterData?.threshold, setPlayerXP, setStamina, setToast, setShowBattle]);

  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 3000); return () => clearTimeout(t); }, [toast, setToast]);
  useEffect(() => { setTempName(characterName); }, [characterName]);
  useEffect(() => { const handleResize = () => setWindowWidth(window.innerWidth); window.addEventListener('resize', handleResize); return () => window.removeEventListener('resize', handleResize); }, []);

  useEffect(() => {
    if (genAIModel) { 
      const timer = setTimeout(() => {
        requestStarkAnalysis(); 
      }, 1500); 
      return () => clearTimeout(timer);
    }
  }, [genAIModel]); 

  const createStarkPrompt = () => {
    const playerState = {
      characterName: characterName,
      points: points,
      stamina: stamina,
      satiety: satiety, 
      playerXP: playerXP,
      currentMonster: currentMonster.name,
      currentLevel: currentLevel,
      bossIsActive: bossHp > 0,
      bossDefeatCount: bossDefeatCount,
      equipmentStats: equipmentStats,
      habits: habitsWithStreaks.map(h => ({
        id: h.id,
        name: h.name,
        currentStreak: h.currentStreak,
        bestStreak: h.bestStreak,
        isCompletedToday: h.isCompletedToday
      }))
    };
    
    const baseRewardPoints = 100 + (currentLevel * 20) + (bossDefeatCount * 50);
    const baseRewardXP = 75 + (currentLevel * 15) + (bossDefeatCount * 40);
    const challengeRewardPoints = Math.floor(baseRewardPoints * 1.5);
    const challengeRewardXP = Math.floor(baseRewardXP * 1.5);

    return `
      Ти "Старк", АІ-асистент та Гейм-Майстер.
      Твоє завдання - згенерувати "Дошку Доручень" (3 квести) на основі стану гравця.
      
      СТАН ГРАВЦЯ: ${JSON.stringify(playerState)}
      
      ПРАВИЛА ГЕНЕРАЦІЇ:
      1. Квести мають бути ТВОРЧИМИ, КОРОТКИМИ та базуватися на стані гравця.
      2. "description": Творчий, тематичний опис (як у книзі).
      3. "objective": ДУЖЕ КОРОТКА, чітка ігрова ціль. 
         - Якщо habitIdToTrack = 'any': "Виконайте X будь-яких квестів"
         - Якщо habitIdToTrack = [id]: "Виконайте квест '[Назва Звички]' X разів"
         - (Якщо тип RECOVERY): "Відновіть ситість" або "Відновіть витривалість" (тоді habitIdToTrack = 'feed' або 'any')
      4. "habitIdToTrack": Використовуй "any" для загальних квестів, або ID конкретної звички.
      5. "type": (RECOVERY, CHALLENGE, GRIND, GROWTH)
      6. "reward": ВИКОРИСТОВУЙ ЦІ ДИНАМІЧНІ НАГОРОДИ:
        - Для "RECOVERY" або "GRIND": { "points": ${baseRewardPoints}, "xp": ${baseRewardXP} }
        - Для "CHALLENGE" або "GROWTH" (складніші): { "points": ${challengeRewardPoints}, "xp": ${challengeRewardXP} }

      ТВОЯ ВІДПОВІДЬ МАЄ БУТИ ТІЛЬКИ JSON-ОБ'ЄКТОМ.
      ЖОДНОГО тексту, жодних markdown \`\`\`json.
      
      Формат JSON:
      {
        "quests": [
          { 
            "id": "stark_q1", 
            "title": "Назва квесту", 
            "description": "Творчий опис для ${characterName}...", 
            "objective": "Чітка ігрова ціль (напр. 'Виконайте 3 будь-яких квести')", 
            "habitIdToTrack": "any", 
            "targetCount": 3, 
            "currentCount": 0, 
            "reward": { "points": ${baseRewardPoints}, "xp": ${baseRewardXP} }, 
            "type": "GRIND" 
          },
          { 
            "id": "stark_q2", 
            "title": "...", 
            "description": "...", 
            "objective": "Чітка ігрова ціль",
            "habitIdToTrack": "...", 
            "targetCount": ..., 
            "currentCount": 0, 
            "reward": { "points": ${challengeRewardPoints}, "xp": ${challengeRewardXP} }, 
            "type": "CHALLENGE" 
          },
          { 
            "id": "stark_q3", 
            "title": "...", 
            "description": "...", 
            "objective": "Чітка ігрова ціль",
            "habitIdToTrack": "...", 
            "targetCount": ..., 
            "currentCount": 0, 
            "reward": { "points": ${baseRewardPoints}, "xp": ${baseRewardXP} }, 
            "type": "RECOVERY" 
          }
        ]
      }
    `;
  };
  
  const callStarkGenerator = async () => {
    if (!genAIModel) { 
      setCoachMessage("Помилка: АІ (JSON) модель не завантажена. Перевір ключ API.");
      return;
    }
    const prompt = createStarkPrompt();
  
    setIsCoachLoading(true);
    setCoachMessage('Аналізую твій прогрес... Генерую нові доручення...');
    
    try {
      const result = await genAIModel.generateContent(prompt);
      const response = result.response;
      const jsonText = response.text();
      
      const newQuestsData = JSON.parse(jsonText); 
  
      if (newQuestsData && newQuestsData.quests && Array.isArray(newQuestsData.quests)) {
        const questsWithIds = newQuestsData.quests.map((q, i) => ({
          ...q,
          id: q.id || `stark_${new Date().getTime() + i}`,
          currentCount: q.currentCount || 0 
        }));
        setStarkQuests(questsWithIds); 
        setCoachMessage(`Я оновив "Дошку Доручень"! У тебе ${questsWithIds.length} нових виклики.`);
      } else {
        throw new Error("Invalid JSON structure from AI.");
      }
      
    } catch (error) {
      console.error("Помилка генерації квесту Gemini (Чистий Запит):", error);
      setCoachMessage('Ой, щось пішло не так з моїм мозком... Спробуй пізніше.');
    } finally {
      setIsCoachLoading(false);
    }
  };

  const requestStarkAnalysis = () => {
    if (isCoachLoading) return; 

    const todayStr = todayISO(); 
    const isNewDay = lastStarkCheck !== todayStr;
  
    if (isNewDay) {
      setCoachMessage('Новий день! Оновлюю дошку доручень...');
      setLastStarkCheck(todayStr); 
      callStarkGenerator(); 
      return;
    }

    if (starkQuests.length === 0) {
      setCoachMessage('Підшукую нові доручення...');
      setLastStarkCheck(todayStr); 
      callStarkGenerator();
      return;
    }
    
    setCoachMessage(firstVisit ? 'Ласкаво просимо!' : `У тебе ще є ${starkQuests.length} ${starkQuests.length === 1 ? 'активний квест' : 'активних квести'} від мене. Не розслабляйся!`);
  };


  const createStarkShopPrompt = () => {
    return `
      Ти "Старк", АІ-асистент та коуч. Ти дотепний і розумний.
      Твоє завдання - дати КОРОТКУ (2-3 речення) ТА КОНКРЕТНУ пораду для магазину.
      
      СТАН ГРАВЦЯ:
      - Ім'я: ${characterName}
      - Очки: ${points}
      - Витривалість: ${stamina}%
      - Ситість: ${satiety}% (100=ситий, <20=штраф)
      - Бос: ${bossHp > 0 ? `Активний (${bossHp}/${currentMaxBossHp} HP)` : 'Переможений'}
      - Сила атаки: ${baseDamage + currentAttackBonus}
      - Корона: ${isCrownOwned ? 'Так' : 'Ні'}
      
      Ціни в магазині: 
      - Дешева їжа (Хліб, Яблуко): 30-50 очок (відновлює ситість)
      - Елітна їжа (Стейк, Золоте Яблуко): 150-1000 очок (багато XP + ситість)
      - Покращення Атаки (Мечі): 200-1000 очок
      - Покращення Ефективності (Амулети): 1500-3500 очок
      - Корона Легенди (x2 очки): 7500 очок

      Яка моя НАЙКРАЩА стратегія прямо зараз? На чому зосередитись?
      (Якщо ситість < 30, ПОРАДЬ КУПИТИ ЇЖУ).
      (Якщо бос активний і витривалість < 50, ПОРАДЬ ЇЖУ для витривалості).
      (Якщо очок > 8000 і корони нема, НАГАДАЙ про корону).
      
      ВІДПОВІДАЙ ТІЛЬКИ ТЕКСТОМ ПОРАДИ. 
      ЖОДНИХ ПРИВІТАНЬ чи "Старк каже:". Просто порада.
    `;
  };

  const getStarkShopAdvice = async () => {
    if (!genAIModel) { 
      setShopAdvice("Помилка: АІ-чат не завантажено.");
      return;
    }
    
    const prompt = createStarkShopPrompt();
    
    setIsShopAdviceLoading(true);
    setShopAdvice("Старк аналізує твої кишені (Чистий Запит)..."); 
    
    try {
      const result = await genAIModel.generateContent(prompt);
      const text = result.response.text();
      setShopAdvice(text);
    } catch (error) {
      console.error("Помилка поради від Старка (Чистий Запит):", error);
      setShopAdvice("Ой, у мене заблокувалися сенсори. Просто купуй те, що блищить!");
    } finally {
      setIsShopAdviceLoading(false);
    }
  };


  
  const handleCompleteHabit = (habitId) => { 
    const habit=habitsWithStreaks.find(h=>h.id===habitId); 
    if(!habit||habit.isCompletedToday){setToast({text:'Цей квест вже виконано сьогодні!',type:'info'});return;} 
    
    const isStarving = satiety < 20; 
    const sB=habit.currentStreak*2; 
    const bP=10; 
    const bS=15; 
    const pM=isStarving ? 0.5 : 1; 
    const crownBonus=isCrownOwned?2:1; 
    const pR=Math.floor((bP+sB)*pM)*crownBonus; 
    const sR=Math.floor(bS*pM); 
    
    setPoints(p=>p+pR); 
    setStamina(s=>Math.min(100,s+sR)); 
    const newTasksCount=tasksSinceLastBoss+1; 
    setTasksSinceLastBoss(newTasksCount); 
    const uH=habits.map(h=>h.id===habitId?{...h,completedDays:[...(h.completedDays||[]),today]}:h); 
    setHabits(uH); 
    const nBC=5-newTasksCount; 
    const toastText=`Квест! +${pR} очок${crownBonus>1?'(x2 👑)':''}, +${sR} витр. 🔥. До боса: ${nBC>=0?nBC:'Готовий!'}`; 
    
    if(isStarving){setToast({text:`Квест! +${pR} очок${crownBonus>1?'(x2 👑)':''} (штраф 😥). До боса: ${nBC>=0?nBC:'Готовий!'}`,type:'warning'});}else{setToast({text:toastText,type:'success'});}
    
    if (starkQuests.length > 0) {
      let completedQuest = null;
      let questProgressMessage = null; 
      
      let newQuestList = starkQuests.map(quest => {
        if (quest.currentCount >= quest.targetCount) return quest; 
        let questProgress = false;
        
        if (quest.habitIdToTrack === 'any' || quest.habitIdToTrack === habitId) {
          if (quest.type === 'CHALLENGE') {
            const updatedHabit = uH.find(h => h.id === habitId);
            const newStreak = calculateStreak(updatedHabit.completedDays).current;
            if (newStreak > quest.currentCount) {
              quest.currentCount = newStreak;
              questProgress = true;
            }
          } else {
            quest.currentCount += 1;
            questProgress = true;
          }
        }

        if (quest.currentCount >= quest.targetCount) {
          completedQuest = quest;
        } else if (questProgress) {
          questProgressMessage = `Так! Ти просунувся у моєму квесті "${quest.title}"! (${quest.currentCount}/${quest.targetCount})`;
        }
        
        return quest;
      });

      if (completedQuest) {
        const finalPoints = completedQuest.reward.points * crownBonus; 
        const finalXP = completedQuest.reward.xp;
        
        setPoints(p => p + finalPoints);
        setPlayerXP(xp => xp + finalXP);
        
        const rewardMsg = `НЕЙМОВІРНО! Ти виконав мій квест "${completedQuest.title}"! Нагорода: ${finalPoints} 🌟${crownBonus > 1 ? '(x2 👑)' : ''} та ${finalXP} ✨!`;
        
        newQuestList = newQuestList.filter(q => q.id !== completedQuest.id);
        
        if (newQuestList.length === 0) {
          setCoachMessage(rewardMsg + " ... Дошка доручень порожня. Я скоро підготую нові виклики!");
          setTimeout(() => requestStarkAnalysis(), 3000); 
        } else {
          setCoachMessage(rewardMsg); 
        }
        
      } else if (questProgressMessage) {
        setCoachMessage(questProgressMessage);
      }
      
      setStarkQuests(newQuestList);
    }
  };
  
  const attackBoss=(isAuto=false)=>{
    if(!canAttack||isBossHit||bossHp<=0)return; 
    const dmg=baseDamage+currentAttackBonus+(isAuto?10:0); 
    const pFD=Math.floor(dmg/4); 
    let bJD=false; 
    setIsBossHit(true); 
    setTimeout(()=>setIsBossHit(false),300); 
    setStamina(s=>Math.max(0, s-currentAttackCost)); 
    setBossHp(hp=>{
      const nH=Math.max(0,hp-dmg); 
      if(nH<=0&&hp>0){
        bJD=true; 
        const reward=currentMaxBossHp; 
        setPoints(p=>p+reward); 
        setPlayerXP(xp=>xp+reward); 
        setStamina(100); 
        setBossDefeatCount(c=>c+1); 
        setToast({text:`Перемога! +${reward} очок, +${reward} XP! Витривалість відновлено!`,type:'success'});
        setTimeout(() => callStarkGenerator(), 1500); 
      } 
      return nH;
    }); 
    setPoints(p=>p+pFD); 
    if(!bJD)setToast({text:`Удар! -${currentAttackCost} витр. Завдано ${dmg} шкоди.`,type:'info'}); 
    if(bJD){setTimeout(()=>setShowBattle(false),400);return;}
  };

  const autoAttack=()=>{if(!canAttack){setToast({text:'Не вистачає витривалості!',type:'error'});return;} let att=0; const tH=()=>{if(att>=3||stamina<currentAttackCost||bossHp<=0)return; att++; attackBoss(true); setTimeout(()=>{if(bossHp>0&&stamina>=currentAttackCost&&att<3)setTimeout(tH,500);},500);}; tH();};
  const handleAddHabit=(newHabit)=>{const h={...newHabit,id:Date.now().toString(),createdAt:today,completedDays:[]}; setHabits(p=>[...p,h]); setPoints(p=>p+30); setPlayerXP(x=>x+50); setShowAddModal(false); setToast({text:'Квест додано! +30 очок, +50 XP',type:'success'});};
  const buyAndFeed=(item)=>{if(points<item.price){setToast({text:'Не вистачає очок!',type:'error'});return;} if(item.stat){setPoints(p=>p-item.price); setEquipmentStats(p=>({...p,[item.stat]:(p[item.stat]||0)+item.value})); setToast({text:`Куплено ${item.name}! ${item.effect}`,type:'success'});return;} if(item.type==='cosmetic'||item.type==='artifact'||item.type==='potion'){if(purchasedCosmetics.includes(item.id)){setToast({text:'Вже придбано',type:'info'});return;} setPurchasedCosmetics(p=>[...p,item.id]); setPoints(p=>p-item.price); setToast({text:`Куплено: ${item.name}!`,type:'success'});return;} setPoints(p=>p-item.price); if(item.stamina)setStamina(s=>Math.min(100,s+item.stamina)); if(item.satiety!==undefined)setSatiety(s=>Math.min(100,s+item.satiety)); if(item.xp)setPlayerXP(x=>x+item.xp); setFeeding(item); setTimeout(()=>setFeeding(null),1800); if(dailyFeedStreak.lastFed!==today){const y=new Date(Date.now()-864e5).toISOString().split('T')[0]; const nC=dailyFeedStreak.lastFed===y?dailyFeedStreak.count+1:1; setToast({text:`Монстр з'їв ${item.name}. ${nC>1?`Стрік годування: ${nC}! 🔥`:'Новий стрік годування!'}`,type:'success'}); setDailyFeedStreak({count:nC,lastFed:today});}else{setToast({text:`Монстр з'їв ${item.name}`,type:'success'});}};

  const scrollLeft=()=>scrollRef.current?.scrollBy({left:-300,behavior:'smooth'}); const scrollRight=()=>scrollRef.current?.scrollBy({left:300,behavior:'smooth'});
  const handleNameSubmit=()=>{ const trimmedName = tempName.trim(); if(trimmedName){setCharacterName(trimmedName); setShowNameModal(false); if(firstVisit){setShowOnboarding(true); setFirstVisit(false);}}};
  const finishOnboarding=()=>{setShowOnboarding(false);};
  const openEditNameModal = () => { setTempName(characterName); setShowNameModal(true); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 dark:from-gray-900 dark:via-gray-950 dark:to-black text-gray-900 dark:text-white overflow-x-hidden pb-20">

      {/* Фонові частки */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10"> {[...Array(6)].map((_, i) => ( <motion.div key={i} className="absolute w-64 h-64 rounded-full blur-3xl opacity-15" style={{ background: `radial-gradient(circle, hsl(${i * 50}, 80%, 60%), transparent 70%)` }} animate={{ x: [0, (i % 2 ? 180 : -120), 0], y: [0, -150 + i * 10, 0], scale: [1, 1.6, 1] }} transition={{ duration: 12 + i * 2, repeat: Infinity, ease: 'easeInOut' }} /> ))} </div>

      {/* Адаптивний Хедер */}
      <header className="relative z-10 pt-12 pb-6 px-3 sm:px-4 md:px-6">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[90rem] mx-auto p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl backdrop-blur-2xl bg-white/60 dark:bg-gray-800/60 border border-white/30 shadow-xl relative">
          <button onClick={() => setShowOnboarding(true)} className="absolute top-3 right-3 z-20 p-1.5 rounded-full bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 transition" aria-label="Показати інструкцію"> <HelpCircle className="w-5 h-5 text-orange-500" /> </button>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-3 sm:gap-4 md:gap-6">
            <div className="md:w-1/3 flex-shrink-0 w-full flex justify-center"> <MonsterDisplay monster={currentMonster} size={monsterDisplaySize} showEvolution={showEvolution} /> </div>
            <div className="md:w-2/3 flex-grow w-full flex flex-col gap-3 sm:gap-4">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 items-start">
                <div className="col-span-1 space-y-2 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold truncate tracking-tight">{characterName} {isCrownOwned && '👑'}</h3>
                      <button onClick={openEditNameModal} className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition"> <Edit className="w-4 h-4 text-gray-500 dark:text-gray-400" /> </button>
                    </div>
                    <div className="flex items-center gap-4 justify-center sm:justify-start -mt-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400">(Рів. {currentLevel})</p>
                        <div className="flex items-center gap-1 text-xs sm:text-sm"> <Sword className="w-4 h-4 text-red-500" /> <span className="font-semibold">Сила: {baseDamage + currentAttackBonus}</span> </div>
                    </div>
                    <div> 
                        <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Досвід (XP)</p> 
                        <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 overflow-hidden mt-0.5"> <div style={{ width: `${(xpInCurrentLevel / xpForNextLevel) * 100}%` }} className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all" /> </div> 
                        <p className="text-xs text-right mt-0.5">{xpInCurrentLevel}/{xpForNextLevel}</p> 
                      </div>
                  </div>
                  <div className="col-span-1 flex flex-col items-center justify-start pt-1"> <Flame className={`w-10 h-10 transition-colors ${dailyFeedStreak.lastFed === today ? 'text-orange-500' : 'text-gray-400 dark:text-gray-600'}`} /> 
                    <span className="text-4xl font-black bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent tracking-tight">{dailyFeedStreak.count}</span> 
                    <p className="text-xs text-gray-600 dark:text-gray-400 text-center leading-tight">Днів стріку годування</p> 
                  </div>
              </div>

              {/* === БЛОК СТАТИСТИКИ === */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                {[
                  { label: 'Сьогодні', value: habitsWithStreaks.filter(h => h.isCompletedToday).length, icon: Calendar, styles: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/30' },
                  { label: 'Стрік', value: Math.max(...(habitsWithStreaks.map(h => h.currentStreak).filter(Boolean)), 0), icon: Flame, styles: 'text-rose-600 bg-rose-500/10 border-rose-500/30' },
                  { label: 'Очки', value: points, icon: Star, styles: 'text-yellow-600 bg-yellow-500/10 border-yellow-500/30' },
                  {
                    label: 'Магазин',
                    value: <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />, 
                    icon: ShoppingBag,
                    onClick: () => {
                      setShowShop(true);
                      setShopTab('food');
                      setShopAdvice(null);
                      getStarkShopAdvice();
                    },
                    styles: 'text-indigo-600 bg-indigo-500/10 border-indigo-500/30'
                  }
                ].map((item) => (
                  <div
                    key={item.label}
                    onClick={item.onClick}
                    className={`flex flex-col items-center justify-center text-center p-2 sm:p-2.5 rounded-lg sm:rounded-xl border ${item.styles} ${item.onClick ? 'cursor-pointer transition hover:bg-white/70 dark:hover:bg-gray-700/70' : ''}`}
                  >
                    {item.label === 'Магазин' ? item.value : <item.icon className="w-4 h-4 sm:w-5 sm:h-5 mb-1" />}
                    
                    {item.label !== 'Магазин' && (
                      <span className="text-lg sm:text-xl font-bold">{item.value}</span>
                    )}

                    <p className="text-xs font-medium mt-0.5 sm:mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            
            </div>
          </div>
        
        {/* БЛОК СТАТУСУ (Витривалість + Ситість) */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-3 sm:mt-4 p-2 sm:p-2.5 rounded-lg sm:rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/20">
          <div className="space-y-1 sm:space-y-1.5"> 
            <div className="flex items-center gap-1.5 sm:gap-2"> 
              <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-400 flex-shrink-0" /> 
              <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-1.5 sm:h-2 overflow-hidden"> 
                <div style={{ width: `${stamina}%` }} className="h-full bg-gradient-to-r from-indigo-400 to-purple-500 transition-all" /> 
              </div> 
              <span className="text-xs font-semibold w-10 sm:w-12 text-right">{stamina}%</span> 
            </div> 
            <div className="flex items-center gap-1.5 sm:gap-2"> 
              <Cookie className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-700 flex-shrink-0" /> 
              <div className="w-full bg-gray-300 dark:bg-gray-600 rounded-full h-1.5 sm:h-2 overflow-hidden"> 
                <div style={{ width: `${satiety}%` }} className="h-full bg-gradient-to-r from-yellow-600 to-orange-500 transition-all" /> 
              </div> 
              <span className="text-xs font-semibold w-10 sm:w-12 text-right">{satiety}%</span> 
            </div> 
          </div> 
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-1 sm:mt-1.5 italic"> 
            {satiety < 20 ? 'Голодує! (штраф)' : stamina < 20 ? 'Втомлений' : satiety < 50 ? 'Хоче їсти' : 'Ситий!'}
          </p>
        </motion.div>
        </motion.div>
      </header>

      {/* === БЛОК: "ДОШКА ДОРУЧЕНЬ" СТАРКА === */}
      <div className="relative max-w-7xl mx-auto px-6 -mt-4 mb-8 z-10">
        
        {/* 1. Хмарка думок Старка (Коментарі) */}
        <AnimatePresence>
          {(coachMessage) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="mb-4"
              onClick={() => setCoachMessage(null)}
            >
              <div className="p-4 rounded-2xl bg-indigo-600 text-white shadow-lg flex items-start gap-3 cursor-pointer">
                <Sparkles className={`w-6 h-6 text-yellow-300 flex-shrink-0 mt-1 ${isCoachLoading ? 'animate-spin' : ''}`} />
                <div className="flex-grow">
                  <h4 className="font-bold">Старк (АІ):</h4>
                  <p className="text-indigo-100 text-sm">{coachMessage}</p>
                </div>
                <X size={18} className="flex-shrink-0 text-indigo-200" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 2. "Дошка Доручень" Старка */}
        {(starkQuests.length > 0) && (
          <motion.section 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-2xl border-2 sm:border-4 border-yellow-300">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h3 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
                  <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-300" />
                  <span className="hidden sm:inline">Дошка Доручень Старка</span>
                  <span className="sm:hidden">Дошка Старка</span>
                </h3>
              </div>
              
              <div className="space-y-4">
                {starkQuests.map((quest) => (
                  <motion.div 
                    key={quest.id} 
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-xl bg-black/20"
                  >
                    <h4 className="text-lg font-bold">{quest.title}</h4>
                    <p className="text-sm text-indigo-100 mb-2 italic">{quest.description}</p>
                    
                    {/* ===  БЛОК ЦІЛІ === */}
                    <div className="mb-3 p-3 rounded-lg bg-black/30">
                      <p className="text-sm font-bold text-yellow-300">🎯 Ціль: {quest.objective || 'Виконуйте квести!'}</p>
                    </div>
                    {/* === КІНЕЦЬ БЛОКУ === */}
                    
                    <p className="text-xs font-bold">Прогрес: {quest.currentCount} / {quest.targetCount}</p>
                    <div className="w-full bg-black/20 rounded-full h-2.5 mt-1 overflow-hidden">
                      <div 
                        style={{ width: `${(quest.currentCount / quest.targetCount) * 100}%` }}
                        className="h-full bg-yellow-300 rounded-full transition-all"
                      />
                    </div>
                    <p className="text-xs mt-2">Нагорода: <Star className="w-3 h-3 inline text-yellow-300" /> {quest.reward.points} очок, ✨ {quest.reward.xp} XP</p>
                  </motion.div>
                ))}
              </div>
              
            </div>
          </motion.section>
        )}
      </div>
      {/* === КІНЕЦЬ БЛОКУ === */}


      {/* Квести (carousel) */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mt-8 mb-10">
         <div className="flex items-center justify-between mb-3 sm:mb-4"> 
          <h2 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent tracking-tight">Квести (Натисни)</h2> 
          <div className="flex gap-2"> <button onClick={scrollLeft} className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 transition"><ChevronLeft className="w-5 h-5" /></button> <button onClick={scrollRight} className="p-2 rounded-xl bg-white/50 dark:bg-gray-800/50 hover:bg-white/70 transition"><ChevronRight className="w-5 h-5" /></button> </div> </div>
         <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"> {habitsWithStreaks.length === 0 ? ( <div className="flex items-center justify-center w-full py-16"> <div className="p-8 rounded-3xl bg-white/50 dark:bg-gray-800/50 border-2 border-dashed border-orange-400/50 text-center"> <Sparkles className="w-10 h-10 mx-auto text-orange-400 mb-3" /> 
               <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">Твій монстр чекає на квест!</p> 
               <motion.button whileHover={{ scale: 1.05 }} onClick={() => setShowAddModal(true)} className="px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-bold"> Почати пригоду </motion.button> </div> </div> ) : ( habitsWithStreaks.map((h, i) => { const isHot = h.currentStreak >= 7; return ( <motion.div key={h.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + i * 0.05 }} whileHover={{ scale: 1.03 }} onClick={() => handleCompleteHabit(h.id)} className={`flex-shrink-0 w-72 cursor-pointer ${h.isCompletedToday ? 'opacity-60' : ''}`}> <div className={`relative p-6 rounded-3xl backdrop-blur-xl border-2 transition-all ${h.isCompletedToday ? 'border-green-500/50 bg-green-500/10' : isHot ? 'border-rose-500 shadow-lg shadow-rose-500/40' : 'border-white/30'} bg-white/70 dark:bg-gray-800/70 overflow-hidden`}> <div className="absolute inset-0 opacity-10 bg-gradient-to-br from-rose-400 to-orange-600" /> <div className="relative z-10"> <div className="flex items-center justify-between mb-4"> <div className="text-3xl">{h.isCompletedToday ? '✅' : isHot ? '🔥' : '🎯'}</div> {isHot && !h.isCompletedToday && <Flame className="w-6 h-6 text-orange-500 animate-pulse" />} </div> 
                   <h3 className={`font-bold text-xl mb-2 ${h.isCompletedToday ? 'line-through' : ''}`}>{h.name}</h3> 
                   <p className="text-base text-gray-600 dark:text-gray-400 mb-3">Стрік: {h.currentStreak} днів</p> 
                   <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3"> <div className="bg-gradient-to-r from-rose-500 to-orange-500 h-full rounded-full transition-all" style={{ width: `${Math.min(h.currentStreak * 4, 100)}%` }} /> </div> </div> </div> </motion.div> ); }) )} </div>
      </section>

      {/* Прогрес + Босс  */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 mb-20 grid lg:grid-cols-2 gap-12">
        <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} transition={{delay: 0.1, duration: 0.5}} viewport={{ once: true, amount: 0.3 }} className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 border border-white/30 shadow-2xl"> 
          <h3 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent tracking-tight">Прогрес (виконані квести)</h3> 
          <ResponsiveContainer width="100%" height={180}> <AreaChart data={stats.last7Days}> <CartesianGrid strokeDasharray="3 3" stroke="rgba(120,120,120,0.2)" /> <XAxis dataKey="date" stroke="#888" /> <YAxis stroke="#888" allowDecimals={false} /> <Tooltip contentStyle={{ background: 'rgba(255,255,255,0.95)', borderRadius: '12px', border: 'none' }} /> <Area type="monotone" dataKey="value" name="Квести" stroke="#f97316" fill="#f97316" fillOpacity={0.6} /> </AreaChart> </ResponsiveContainer> </motion.div>
        <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} transition={{delay: 0.1, duration: 0.5}} viewport={{ once: true, amount: 0.3 }} className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl backdrop-blur-xl bg-red-500/10 dark:bg-red-900/20 border border-red-500/50 shadow-2xl">
          <h3 className="text-xl sm:text-2xl font-black mb-4 sm:mb-6 bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent tracking-tight">Босс (кожні 5 квестів)</h3>
          <div className="text-center">
            <div className="text-5xl sm:text-6xl md:text-7xl mb-2 sm:mb-3">👹</div>
            <p className="font-bold text-base sm:text-lg">Лінивий Дракон (Рів. {bossDefeatCount + 1})</p>
             <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-6 mt-4 overflow-hidden"> <motion.div animate={{ width: `${(bossHp / currentMaxBossHp) * 100}%` }} className="h-full bg-gradient-to-r from-red-600 to-rose-600" /> </div>
             <p className="text-sm mt-2">{bossHp > 0 ? `${bossHp} / ${currentMaxBossHp} HP` : 'Переможений!'}</p>
             {tasksSinceLastBoss < 5 && bossHp <= 0 && ( <p className="text-sm text-yellow-500 mt-2 font-semibold"> Ще {5 - tasksSinceLastBoss} {5 - tasksSinceLastBoss === 1 ? 'квест' : 'квести'} до появи боса! </p> )}
             <div className="mt-4 flex items-center gap-3 justify-center"> <button onClick={() => setShowBattle(true)} className="px-6 py-2 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition flex items-center gap-2" disabled={stamina < currentAttackCost || bossHp <= 0}> {stamina < currentAttackCost ? <Zap className="w-5 h-5"/> : <Sword className="w-5 h-5" />} {stamina < currentAttackCost ? 'Мало витривалості' : bossHp <=0 ? 'Переможений' : 'Атакувати'} </button> <button onClick={() => { setShowShop(true); setShopTab('food'); setShopAdvice(null); getStarkShopAdvice(); }} className="px-4 py-2 rounded-xl bg-black/10 dark:bg-white/10 text-gray-800 dark:text-white font-bold">Магазин</button> </div>
             <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Нагорода за перемогу: {currentMaxBossHp} очок, {currentMaxBossHp} XP та відновлення витривалості!</p>
           </div>
         </motion.div>
      </section>

      {/* --- МОДАЛЬНІ ВІКНА  --- */}
      <AnimatePresence> {showShop && ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-6" onClick={() => setShowShop(false)}> <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 30 }} className="max-w-4xl w-full max-h-[80vh] overflow-y-auto p-6 md:p-8 rounded-3xl backdrop-blur-2xl bg-white/90 dark:bg-gray-900/90 border border-white/20 shadow-2xl" onClick={e => e.stopPropagation()}> 
            <div className="flex justify-between items-center mb-4 sm:mb-6"> <h3 className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">Магічний ринок</h3> <button onClick={() => setShowShop(false)} className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/20"><X className="w-6 h-6" /></button> </div> 

            {/* === БЛОК: ПОРАДА ВІД СТАРКА (МАГАЗИН) === */}
            <div className="mb-6 p-4 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 border border-indigo-300 dark:border-indigo-700">
              <div className="flex items-start gap-3">
                <Sparkles className={`w-6 h-6 text-indigo-500 flex-shrink-0 mt-1 ${isShopAdviceLoading ? 'animate-spin' : ''}`} />
                <div className="flex-grow">
                  <h4 className="font-bold text-indigo-900 dark:text-indigo-200">Старк (АІ) каже:</h4>
                  <p className="text-sm text-indigo-700 dark:text-indigo-300">
                    {isShopAdviceLoading ? 'Аналізую твої кишені (Чистий Запит)...' : shopAdvice || '...'}
                  </p>
                </div>
              </div>
            </div>
            {/* === КІНЕЦЬ БЛОКУ === */}

            <div className="flex gap-2 mb-4 sm:mb-6"> <button onClick={() => setShopTab('food')} className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold transition-all text-sm sm:text-base ${shopTab === 'food' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}> <UtensilsCrossed className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1 sm:mr-1.5 -mt-0.5" /> <span className="hidden sm:inline">Їжа та XP</span><span className="sm:hidden">Їжа</span> </button> <button onClick={() => setShopTab('equipment')} className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl font-bold transition-all text-sm sm:text-base ${shopTab === 'equipment' ? 'bg-indigo-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}`}> <Briefcase className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1 sm:mr-1.5 -mt-0.5" /> <span className="hidden sm:inline">Спорядження</span><span className="sm:hidden">Споряд.</span> </button> </div> <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"> {shopTab === 'food' && foodItems.map(item => { const cA = points < item.price; return ( <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }} whileHover={{ scale: cA ? 1 : 1.02 }} onClick={()=>{if(cA)setToast({text:'Не вистачає очок!',type:'error'});else setSelectedItem(item);}} className={`p-4 rounded-2xl backdrop-blur-xl border-2 text-center transition-all ${cA?'opacity-60 grayscale cursor-not-allowed':'cursor-pointer border-white/30 bg-white/50 dark:bg-gray-800/50'}`}> <div className="text-4xl mb-1">{item.emoji}</div> <p className="font-bold text-sm mb-0.5">{item.name}</p> 
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.price} <Star className="w-3 h-3 inline-block -mt-1 text-yellow-500" /></p> 
                        {item.effect && <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">{item.effect}</p>} 
                      </motion.div> ); })} {shopTab === 'equipment' && equipmentItems.map(item => { const cA=points<item.price; const iC=item.type==='cosmetic'; const iP=item.type==='potion'; const iA=item.type==='artifact'; const cO=(iC||iP||iA)&&purchasedCosmetics.includes(item.id); const Icon=item.stat==='attack'?Sword:Zap; const TypeIcon=iP?FlaskConical:iA?Key:null; return ( <motion.div key={item.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }} whileHover={{ scale: (cA||cO)?1:1.02 }} onClick={()=>{if(cO)setToast({text:'Вже придбано!',type:'info'});else if(cA)setToast({text:'Не вистачає очок!',type:'error'});else setSelectedItem(item);}} className={`p-4 rounded-2xl backdrop-blur-xl border-2 text-center transition-all ${(cA||cO)?'opacity-60 grayscale cursor-not-allowed':'cursor-pointer border-white/30 bg-white/50 dark:bg-gray-800/50'}`}> <div className="text-4xl mb-1">{item.emoji}</div> <p className="font-bold text-sm mb-0.5">{item.name}</p> 
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.price} <Star className="w-3 h-3 inline-block -mt-1 text-yellow-500" /></p>
                        {item.effect&&(<p className={`text-xs mt-1 flex items-center justify-center gap-1 ${item.stat==='attack'?'text-red-600 dark:text-red-400':item.stat==='efficiency'?'text-blue-600 dark:text-blue-400':'text-purple-500'}`}> {item.stat&&<Icon className="w-3 h-3"/>} {TypeIcon&&<TypeIcon className="w-3 h-3"/>} {item.effect} </p>)} <p className="text-xs mt-1.5 font-semibold flex items-center justify-center gap-1.5"> {cO?<><CheckCircle className="w-3 h-3 text-green-600"/> Придбано</>:'Купити'} </p> </motion.div> ); })} </div> </motion.div> </motion.div> )} </AnimatePresence>
      
      <AnimatePresence> {selectedItem && (selectedItem.satiety !== undefined || selectedItem.stat || selectedItem.type === 'potion' || selectedItem.type === 'artifact' || (selectedItem.type === 'cosmetic' && !purchasedCosmetics.includes(selectedItem.id))) && ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-[990] p-6" onClick={() => setSelectedItem(null)}> <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="max-w-md w-full p-8 rounded-3xl backdrop-blur-2xl bg-white/90 dark:bg-gray-900/90 border border-white/20 shadow-2xl" onClick={e => e.stopPropagation()}> <div className="text-center"> <div className="text-6xl mb-4">{selectedItem.emoji}</div> 
            <h3 className="text-2xl font-black mb-2 tracking-tight">{selectedItem.name}</h3> <p className="text-gray-600 dark:text-gray-400 mb-4">Вартість: {selectedItem.price} очок</p> {selectedItem.effect && <p className="text-emerald-600 dark:text-emerald-400 text-sm mb-4">{selectedItem.effect}</p>} <div className="flex gap-3"> <button onClick={() => { buyAndFeed(selectedItem); setSelectedItem(null); }} disabled={points < selectedItem.price} className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold disabled:opacity-50"> {selectedItem.satiety !== undefined ? 'Купити та нагодувати' : 'Купити'} </button> <button onClick={() => setSelectedItem(null)} className="px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold"> Скасувати </button> </div> </div> </motion.div> </motion.div> )} </AnimatePresence>
      
      <AnimatePresence> {feeding && ( <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="fixed inset-0 flex items-center justify-center z-[995] pointer-events-none"> <motion.div animate={{ y: [0, -120, 0], rotate: [0, 360, 720] }} transition={{ duration: 1.6 }} className="text-9xl"> {feeding.emoji} </motion.div> <motion.p initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} className="absolute text-6xl font-black text-yellow-400 drop-shadow-lg">YUMMY!</motion.p> </motion.div> )} </AnimatePresence>
      <AnimatePresence> {showAddModal && ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}> <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} onClick={e => e.stopPropagation()} className="relative w-full max-w-md"> <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-rose-400 to-red-400 rounded-3xl blur-xl opacity-50" /> <div className="relative backdrop-blur-2xl bg-white/90 dark:bg-gray-900/90 rounded-3xl p-8 border border-white/20 shadow-2xl"> 
            <div className="flex justify-between items-center mb-6"> <h3 className="text-3xl font-black bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent tracking-tight">Новий квест</h3> <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl hover:bg-black/10 dark:hover:bg-white/20"><Plus className="w-6 h-6 rotate-45" /></button> </div> 
            <AddHabitForm onAdd={handleAddHabit} onCancel={() => setShowAddModal(false)} /> 
          </div> </motion.div> </motion.div> )} </AnimatePresence>

      <BossBattleModal open={showBattle} onClose={() => setShowBattle(false)} bossHp={bossHp} maxBossHp={currentMaxBossHp} onAttack={() => attackBoss(false)} playerStamina={stamina} attackCost={currentAttackCost} canAttack={canAttack} onAutoAttack={autoAttack} rewardText={`Нагорода за перемогу: ${currentMaxBossHp} очок, ${currentMaxBossHp} XP + повне відновлення!`} isBossHit={isBossHit} />
      
      <AnimatePresence> {showNameModal && ( <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[999] flex items-center justify-center bg-black/60 p-6"> <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="max-w-md w-full rounded-3xl bg-white dark:bg-gray-800 p-6 shadow-2xl" onClick={e => e.stopPropagation()}> 
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 tracking-tight">{firstVisit ? 'Як звати твого монстра?' : 'Змінити ім\'я монстра'}</h3>
            <div className="relative"> <User className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /> <input type="text" value={tempName} onChange={(e) => setTempName(e.target.value)} placeholder="Наприклад, 'Вогник'" className="w-full pl-10 pr-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500" /> </div> <div className="mt-4 flex gap-3"> <button onClick={handleNameSubmit} disabled={!tempName.trim()} className="flex-1 px-6 py-3 rounded-xl bg-orange-500 text-white font-bold disabled:opacity-50 transition"> {firstVisit ? 'Почати пригоду' : 'Зберегти'} </button> {!firstVisit && <button onClick={() => setShowNameModal(false)} className="px-4 py-3 rounded-xl bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold"> Скасувати </button>} </div> </motion.div> </motion.div> )} </AnimatePresence>
      <OnboardingModal open={showOnboarding} onClose={finishOnboarding} />
      <div className="fixed right-6 bottom-6 z-[9999]"> <AnimatePresence> {toast && ( <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg ${toast.type === 'success' ? 'bg-green-600 text-white' : toast.type === 'error' ? 'bg-red-600 text-white' : toast.type === 'warning' ? 'bg-yellow-500 text-black' : 'bg-white/90 dark:bg-gray-800/90 border border-white/20'}`}> {toast.type === 'success' && <CheckCircle className="w-5 h-5" />} {toast.type === 'error' && <AlertTriangle className="w-5 h-5" />} {toast.type === 'warning' && <AlertTriangle className="w-5 h-5" />} {toast.type === 'info' && <Info className="w-5 h-5" />} <div className="text-sm font-semibold">{toast.text}</div> </motion.div> )} </AnimatePresence> </div>

    </div>
  );
}