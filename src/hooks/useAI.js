// useAI.js - Хук для роботи з AI
import { useState, useEffect } from 'react';
import { aiService } from '../services/aiService';

export const useAI = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Завантаження API ключа з localStorage
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      try {
        aiService.initialize(savedKey);
        setApiKey(savedKey);
        setIsInitialized(true);
      } catch (err) {
        console.error('Помилка ініціалізації AI:', err);
        setError('Помилка ініціалізації AI');
      }
    }
  }, []);

  // Збереження API ключа
  const saveApiKey = (key) => {
    try {
      aiService.initialize(key);
      localStorage.setItem('gemini_api_key', key);
      setApiKey(key);
      setIsInitialized(true);
      setError(null);
      return true;
    } catch (err) {
      setError('Невірний API ключ');
      return false;
    }
  };

  // Видалення API ключа
  const removeApiKey = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setIsInitialized(false);
  };

  // Обгортка для AI запитів з обробкою помилок
  const makeRequest = async (requestFn) => {
    if (!isInitialized) {
      setError('AI не ініціалізовано. Додайте API ключ.');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await requestFn();
      setLoading(false);
      return result;
    } catch (err) {
      console.error('AI помилка:', err);
      setError(err.message || 'Помилка при запиті до AI');
      setLoading(false);
      return null;
    }
  };

  // Методи для роботи з AI
  const analyzeHabits = (habits) => 
    makeRequest(() => aiService.analyzeHabits(habits));

  const recommendHabits = (habits, goals) => 
    makeRequest(() => aiService.recommendHabits(habits, goals));

  const generateMotivation = (habitName, streak) => 
    makeRequest(() => aiService.generateMotivation(habitName, streak));

  const analyzeStats = (stats) => 
    makeRequest(() => aiService.analyzeStats(stats));

  const askQuestion = (question, context) => 
    makeRequest(() => aiService.askQuestion(question, context));

  const sendMessage = (message) => 
    makeRequest(() => aiService.sendMessage(message));

  const startChat = (history) => {
    if (isInitialized) {
      aiService.startChat(history);
    }
  };

  return {
    isInitialized,
    apiKey,
    loading,
    error,
    saveApiKey,
    removeApiKey,
    analyzeHabits,
    recommendHabits,
    generateMotivation,
    analyzeStats,
    askQuestion,
    sendMessage,
    startChat,
  };
};
