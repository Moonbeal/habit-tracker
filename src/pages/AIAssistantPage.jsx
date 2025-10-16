// AIAssistantPage.jsx - Сторінка AI асистента
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Key, 
  Save, 
  Trash2, 
  TrendingUp, 
  Lightbulb,
  BarChart3,
  Loader2,
  ExternalLink,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { useAI } from '../hooks/useAI';
import useLocalStorage from '../hooks/useLocalStorage';

const AIAssistantPage = () => {
  const [habits] = useLocalStorage('habits', []);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [analysis, setAnalysis] = useState('');
  const [recommendations, setRecommendations] = useState('');
  const [statsInsights, setStatsInsights] = useState('');

  const {
    isInitialized,
    apiKey,
    loading,
    error,
    saveApiKey,
    removeApiKey,
    analyzeHabits,
    recommendHabits,
    analyzeStats,
  } = useAI();

  // Показуємо форму для API ключа при першому відкритті
  useEffect(() => {
    if (!isInitialized) {
      setShowApiKey(true);
    }
  }, [isInitialized]);

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      const success = saveApiKey(apiKeyInput.trim());
      if (success) {
        setApiKeyInput('');
        setShowApiKey(false);
      }
    }
  };

  const handleRemoveApiKey = () => {
    if (window.confirm('Ви впевнені, що хочете видалити API ключ?')) {
      removeApiKey();
      setShowApiKey(true);
      setAnalysis('');
      setRecommendations('');
      setStatsInsights('');
    }
  };

  const handleAnalyzeHabits = async () => {
    if (habits.length === 0) {
      alert('Додайте спочатку звички!');
      return;
    }
    const result = await analyzeHabits(habits);
    if (result) setAnalysis(result);
  };

  const handleRecommendHabits = async () => {
    const result = await recommendHabits(habits);
    if (result) setRecommendations(result);
  };

  const handleAnalyzeStats = async () => {
    if (habits.length === 0) {
      alert('Додайте спочатку звички!');
      return;
    }

    const stats = {
      totalHabits: habits.length,
      totalCompletions: habits.reduce((sum, h) => sum + (h.completions?.length || 0), 0),
      bestStreak: Math.max(...habits.map(h => h.bestStreak || 0), 0),
      weeklyCompletions: habits.reduce((sum, h) => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const recentCompletions = (h.completions || []).filter(
          date => new Date(date) >= weekAgo
        );
        return sum + recentCompletions.length;
      }, 0),
    };

    const result = await analyzeStats(stats);
    if (result) setStatsInsights(result);
  };

  return (
    <div className="min-h-screen py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Заголовок */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="text-purple-600" size={32} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              AI Асистент
            </h1>
          </div>
          <p className="text-gray-600">
            Персональний помічник для формування звичок на базі Gemini AI
          </p>
        </div>

        {/* Налаштування API ключа */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Key className="text-purple-600" size={24} />
              <h2 className="text-xl font-semibold">Налаштування API</h2>
            </div>
            {isInitialized && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="text-green-500" size={20} />
                <span className="text-sm text-green-600 font-medium">Підключено</span>
              </div>
            )}
          </div>

          {!isInitialized || showApiKey ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gemini API ключ
                </label>
                <input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="Введіть ваш API ключ..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSaveApiKey}
                  disabled={!apiKeyInput.trim()}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Save size={18} />
                  Зберегти
                </button>
                {isInitialized && (
                  <button
                    onClick={() => setShowApiKey(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Скасувати
                  </button>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800 mb-2">
                  <strong>Як отримати API ключ:</strong>
                </p>
                <ol className="text-sm text-blue-700 space-y-1 ml-4 list-decimal">
                  <li>Перейдіть на <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline font-medium inline-flex items-center gap-1">
                    Google AI Studio <ExternalLink size={12} />
                  </a></li>
                  <li>Увійдіть з вашим Google акаунтом</li>
                  <li>Натисніть "Create API key"</li>
                  <li>Скопіюйте ключ та вставте сюди</li>
                </ol>
                <p className="text-xs text-blue-600 mt-2">
                  💡 Безкоштовно: 15 запитів/хвилину
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  API ключ збережено
                </div>
                <span className="text-xs text-gray-500">
                  {apiKey.substring(0, 10)}...
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowApiKey(true)}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Змінити
                </button>
                <button
                  onClick={handleRemoveApiKey}
                  className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  <Trash2 size={14} />
                  Видалити
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <XCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </motion.div>

        {/* AI Функції */}
        {isInitialized && (
          <>
            {/* Аналіз звичок */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="text-purple-600" size={24} />
                <h2 className="text-xl font-semibold">Аналіз звичок</h2>
              </div>
              
              <button
                onClick={handleAnalyzeHabits}
                disabled={loading || habits.length === 0}
                className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Аналізую...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    Проаналізувати мої звички
                  </>
                )}
              </button>

              {analysis && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-purple-50 border border-purple-200 rounded-lg p-4"
                >
                  <p className="text-gray-700 whitespace-pre-wrap">{analysis}</p>
                </motion.div>
              )}
            </motion.div>

            {/* Рекомендації */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-6 mb-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="text-purple-600" size={24} />
                <h2 className="text-xl font-semibold">Рекомендації нових звичок</h2>
              </div>
              
              <button
                onClick={handleRecommendHabits}
                disabled={loading}
                className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Генерую...
                  </>
                ) : (
                  <>
                    <Lightbulb size={20} />
                    Отримати рекомендації
                  </>
                )}
              </button>

              {recommendations && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-purple-50 border border-purple-200 rounded-lg p-4"
                >
                  <p className="text-gray-700 whitespace-pre-wrap">{recommendations}</p>
                </motion.div>
              )}
            </motion.div>

            {/* Інсайти статистики */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-lg p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="text-purple-600" size={24} />
                <h2 className="text-xl font-semibold">AI Інсайти статистики</h2>
              </div>
              
              <button
                onClick={handleAnalyzeStats}
                disabled={loading || habits.length === 0}
                className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Аналізую...
                  </>
                ) : (
                  <>
                    <BarChart3 size={20} />
                    Отримати інсайти
                  </>
                )}
              </button>

              {statsInsights && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="bg-purple-50 border border-purple-200 rounded-lg p-4"
                >
                  <p className="text-gray-700 whitespace-pre-wrap">{statsInsights}</p>
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AIAssistantPage;
