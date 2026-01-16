// components/SettingsModal.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { 
  X, 
  KeyRound, 
  Check, 
  HelpCircle, 
  ChevronDown,
  Loader2,
  CheckCircle,
  XCircle,
  Database,
  Download,
  Upload
} from 'lucide-react';
import ThemeToggle from './ThemeToggle'; 

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: "-20px" },
  visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
  exit: { opacity: 0, scale: 0.9, y: "-20px", transition: { duration: 0.2 } },
};

const validateKey = async (keyToTest) => {
  if (!keyToTest?.trim()) return false;

  try {
    const genAI = new GoogleGenerativeAI(keyToTest.trim());
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    await model.generateContent("Test");
    return true;
  } catch (error) {
    console.error("Помилка валідації:", error);
    return false;
  }
};

const BACKUP_KEYS = [
  'tasksSinceLastBoss',
  'theme',
  'userAttack',
  'userCoins',
  'userDefense',
  'userEnergy',
  'userHP',
  'userLevel',
  'userMaxEnergy',
  'userMaxHP',
  'userPoints',
  'userXP',
  'maxHP',
  'monsterEnergy',
  'monsterHunger',
  'monsterName',
  'monsterSatiety',
  'monsterStamina',
  'playerHP',
  'playerHealth',
  'playerStrength',
  'playerXP',
  'points',
  'purchased',
  'ach_1',
  'ach_2',
  'ach_first',
  'bossDefeatCount',
  'bossDefeatedToday',
  'bossHp',
  'bossLevel',
  'bossMaxHP',
  'bossVictories',
  'bossWave',
  'characterName',
  'dailyFeedStreak',
  'purchasedCosmetics',
  'purchasedItems',
  'stamina',
  'starkQuest',
  'starkQuests',
  'darkness',
  'equipmentStats',
  'equipped',
  'equippedItems',
  'feedingDays',
  'firstVisit',
  'gameOver',
  'gemini_api_key',
  'habits',
  'lastBossDefeat',
  'lastBossFight',
  'lastPointsDate',
  'lastStarkCheck'
];


const SettingsModal = ({ onClose }) => {
  const [apiKey, setApiKey] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [validationStatus, setValidationStatus] = useState('idle'); 

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      (async () => {
        setValidationStatus('checking');
        const isValid = await validateKey(storedKey);
        setValidationStatus(isValid ? 'valid' : 'invalid');
      })();
    } else {
      setValidationStatus('idle'); 
    }
  }, []);

  const handleSave = async () => {
    setIsSaved(false); 
    setValidationStatus('checking'); 
    
    localStorage.setItem('gemini_api_key', apiKey);
    
    const isValid = await validateKey(apiKey);

    if (isValid) {
      setValidationStatus('valid');
      setIsSaved(true); 
      setTimeout(() => {
        setIsSaved(false);
      }, 2000); 
    } else {
      setValidationStatus('invalid');
    }
  };

  const renderFeedback = () => {
    switch (validationStatus) {
      case 'checking':
        return (
          <div className="flex items-center gap-2 text-xs text-yellow-600 dark:text-yellow-400 mt-2">
            <Loader2 size={14} className="animate-spin" />
            Перевірка ключа...
          </div>
        );
      case 'valid':
        return (
          <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 mt-2">
            <CheckCircle size={14} />
            Ключ активний та збережений.
          </div>
        );
      case 'invalid':
        return (
          <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400 mt-2">
            <XCircle size={14} />
            Ключ недійсний або сталася помилка.
          </div>
        );
      case 'idle':
      default:
        return (
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-2">
            Вставте ключ та натисніть "Зберегти" для перевірки.
          </p>
        );
    }
  };

  const handleExport = () => {
    try {
      const backupData = {};
      
      BACKUP_KEYS.forEach(key => {
        const value = localStorage.getItem(key);
        if (value !== null) { 
          backupData[key] = value;
        }
      });

      if (Object.keys(backupData).length === 0) {
        alert("Немає даних для експорту.");
        return;
      }

      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const today = new Date().toISOString().slice(0, 10);
      a.download = `app-backup-${today}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error("Помилка під час експорту:", error);
      alert("Не вдалося створити бекап.");
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/json') {
      alert("Будь ласка, виберіть коректний .json файл.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonString = e.target.result;
        const backupData = JSON.parse(jsonString);

        if (typeof backupData !== 'object' || backupData === null) {
          throw new Error("Файл бекапу має некоректний формат.");
        }

        const isConfirmed = confirm(
          "Ви впевнені, що хочете імпортувати дані?\n\nЦе перезапише всі поточні налаштування та дані (включаючи API ключ та тему)."
        );

        if (isConfirmed) {
          let importedKeys = 0;
          Object.keys(backupData).forEach(key => {
            const value = backupData[key];
            if (typeof value === 'string') {
              localStorage.setItem(key, value);
              importedKeys++;
            }
          });

          alert(`Імпорт завершено! \nВідновлено ${importedKeys} елементів. \n\nСторінку буде перезавантажено для застосування змін.`);
          location.reload();
        }

      } catch (error) {
        console.error("Помилка під час імпорту:", error);
        alert(`Не вдалося прочитати файл бекапу: ${error.message}`);
      } finally {
        event.target.value = null;
      }
    };
    reader.readAsText(file);
  };


  return (
    <motion.div
      className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm z-[60] flex justify-center items-center p-4"
      variants={backdropVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={onClose} 
    >
      <motion.div
        className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-200 dark:border-slate-800"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit" 
        onClick={(e) => e.stopPropagation()} 
      >
        {/* === Заголовок === */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Налаштування
          </h2>
          <button
            onClick={onClose}
            aria-label="Закрити модальне вікно"
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* === Перемикач теми === */}
        <div className="flex justify-between items-center mb-6 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
          <span className="font-medium text-slate-700 dark:text-slate-200">
            Темна тема
          </span>
          <ThemeToggle />
        </div>

        {/* === Поле API ключа ===  */}
        <div>
          <label
            htmlFor="api-key"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Ваш Gemini API Ключ
          </label>
          <div className="relative">
            <KeyRound
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            />
            <input
              type="password"
              id="api-key"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value);
                setValidationStatus('idle'); 
                setIsSaved(false);
              }}
              placeholder="Вставте ваш API ключ..."
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          
          {renderFeedback()}
          
        </div>

        {/* === Інструкція  === */}
        <details className="mt-5 group">
          <summary className="flex justify-between items-center list-none cursor-pointer p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-2">
              <HelpCircle size={18} className="text-purple-600 dark:text-purple-400" />
              <span className="font-medium text-slate-700 dark:text-slate-200">
                Де взяти API ключ?
              </span>
            </div>
            <ChevronDown size={20} className="text-slate-500 group-open:rotate-180 transition-transform" />
          </summary>
          <div className="mt-3 px-3 pb-1 text-sm text-slate-600 dark:text-slate-400 space-y-2">
            <p>
              Ми використовуємо Google AI Studio для роботи ШІ. Ваш ключ потрібен, щоб надсилати запити.
            </p>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>Перейдіть на сайт{' '}
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-600 dark:text-purple-400 font-medium hover:underline"
                >
                  Google AI Studio
                </a>.
              </li>
              <li>Увійдіть у свій Google-акаунт.</li>
              <li>Натисніть "Create API key in new project".</li>
              <li>Скопіюйте згенерований ключ і вставте його у поле вище.</li>
            </ol>
          </div>
        </details>

        {/* --- БЛОК: Керування даними (Імпорт/Експорт) --- */}
        <details className="mt-5 group">
          <summary className="flex justify-between items-center list-none cursor-pointer p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg group-hover:bg-slate-100 dark:group-hover:bg-slate-800 transition-colors">
            <div className="flex items-center gap-2">
              <Database size={18} className="text-purple-600 dark:text-purple-400" />
              <span className="font-medium text-slate-700 dark:text-slate-200">
                Керування даними (Бекап)
              </span>
            </div>
            <ChevronDown size={20} className="text-slate-500 group-open:rotate-180 transition-transform" />
          </summary>
          <div className="mt-3 px-3 pb-1 text-sm text-slate-600 dark:text-slate-400 space-y-3">
            <p>
              Ви можете зберегти всі свої дані (API ключ, налаштування теми, історію чатів) в один .json файл або відновити їх з бекапу.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Кнопка Експорту */}
              <button
                onClick={handleExport}
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <Download size={18} />
                Експорт
              </button>
              
              {/* Кнопка Імпорту (стилізований label) */}
              <label
                htmlFor="import-file-input"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor:pointer"
              >
                <Upload size={18} />
                Імпорт
              </label>
              <input
                type="file"
                id="import-file-input"
                className="hidden"
                accept=".json,application/json"
                onChange={handleImport}
              />
            </div>
          </div>
        </details>


        {/* Кнопка Зберегти */}
        <button
          onClick={handleSave}
          disabled={validationStatus === 'checking'} 
          className={`w-full mt-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 flex items-center justify-center gap-2 ${
            isSaved 
              ? 'bg-green-500' 
              : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900'
          } ${
            validationStatus === 'checking' ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isSaved ? (
            <>
              <Check size={20} /> Збережено!
            </>
          ) : validationStatus === 'checking' ? (
            <>
              <Loader2 size={20} className="animate-spin" /> Перевірка...
            </>
          ) : (
            'Зберегти та перевірити'
          )}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default SettingsModal;