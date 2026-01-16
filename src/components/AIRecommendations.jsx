// AIRecommendations.jsx - Компонент AI рекомендацій для головної сторінки
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Lightbulb, RefreshCw, X } from 'lucide-react';
import { useAI } from '../hooks/useAI';

const AIRecommendations = ({ habits }) => {
  const [recommendations, setRecommendations] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const { isInitialized, loading, recommendHabits } = useAI();

  useEffect(() => {
    if (isInitialized && habits.length > 0 && !recommendations) {
      loadRecommendations();
    }
  }, [isInitialized, habits]);

  const loadRecommendations = async () => {
    const result = await recommendHabits(habits);
    if (result) {
      setRecommendations(result);
    }
  };

  if (!isInitialized || !isVisible) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full max-w-4xl mx-auto px-4 mb-8"
      >
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg p-6 border border-purple-200">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="text-purple-600" size={24} />
              <h3 className="text-lg font-semibold text-purple-900">
                AI Рекомендації
              </h3>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-purple-400 hover:text-purple-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="animate-spin text-purple-600" size={32} />
            </div>
          ) : recommendations ? (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
                {recommendations}
              </div>
              <button
                onClick={loadRecommendations}
                disabled={loading}
                className="flex items-center gap-2 text-sm text-purple-600 hover:text-purple-700 font-medium disabled:text-purple-300"
              >
                <RefreshCw size={16} />
                Оновити рекомендації
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <Lightbulb className="mx-auto mb-3 text-purple-400" size={48} />
              <p className="text-purple-600 mb-4">
                {habits.length > 0
                  ? 'Отримайте персональні рекомендації від AI'
                  : 'Додайте звички, щоб отримати рекомендації'}
              </p>
              {habits.length > 0 && (
                <button
                  onClick={loadRecommendations}
                  disabled={loading}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-purple-300 transition-colors"
                >
                  Отримати рекомендації
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIRecommendations;
