// AIChat.jsx - Компонент чату з AI асистентом
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Sparkles, Loader2, TrendingUp, Lightbulb, Zap, BarChart3, Target, Calendar } from 'lucide-react';
import { useAI } from '../hooks/useAI';
import { useLocation } from 'react-router-dom';

const AIChat = ({ habits = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);
  const location = useLocation();
  const { isInitialized, loading, sendMessage, startChat } = useAI();

  // Швидкі кнопки
  const quickActions = [
    { icon: Zap, text: 'Мотивуй мене!', emoji: '🔥' },
    { icon: TrendingUp, text: 'Як мій прогрес?', emoji: '📈' },
    { icon: Lightbulb, text: 'Дай пораду по звичках', emoji: '💡' },
    { icon: BarChart3, text: 'Покажи статистику', emoji: '📊' },
    { icon: Target, text: 'Які цілі мені поставити?', emoji: '🎯' },
    { icon: Calendar, text: 'Що робити сьогодні?', emoji: '📅' },
  ];

  // Ініціалізація чату при відкритті
  useEffect(() => {
    if (isOpen && isInitialized && messages.length === 0) {
      // Початкове повідомлення від AI
      const welcomeMessage = {
        role: 'assistant',
        content: '👋 Привіт! Я твій персональний асистент для формування звичок. Можу допомогти з мотивацією, порадами та аналізом твоїх звичок. Про що хочеш поговорити?',
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
      startChat([]);
    }
  }, [isOpen, isInitialized]);

  // Автоскрол до останнього повідомлення
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Створюємо повний контекст про користувача
  const getFullContext = (userMessage) => {
    const stats = {
      totalHabits: habits.length,
      totalCompletions: habits.reduce((sum, h) => sum + (h.completedDays?.length || 0), 0),
      bestStreak: Math.max(...habits.map(h => h.bestStreak || 0), 0),
      currentPage: location.pathname,
    };

    const habitsList = habits.map(h => ({
      name: h.name,
      category: h.category,
      currentStreak: h.currentStreak || 0,
      completions: h.completedDays?.length || 0,
      lastCompleted: h.completedDays?.length > 0 ? h.completedDays[h.completedDays.length - 1] : null,
    }));

    const context = `
Ти - персональний асистент для формування звичок. Відповідай українською мовою, коротко та по суті.

КОНТЕКСТ КОРИСТУВАЧА:
- Всього звичок: ${stats.totalHabits}
- Всього виконань: ${stats.totalCompletions}
- Найкраща серія: ${stats.bestStreak} днів
- Поточна сторінка: ${stats.currentPage}

${habitsList.length > 0 ? `ЗВИЧКИ КОРИСТУВАЧА:\n${habitsList.map(h => `- ${h.name} (${h.category}): ${h.currentStreak} днів підряд, ${h.completions} разів виконано${h.lastCompleted ? `, остання відмітка: ${h.lastCompleted}` : ''}`).join('\n')}` : 'У користувача ще немає звичок.'}

ПИТАННЯ КОРИСТУВАЧА: ${userMessage}
`;

    return context;
  };

  const handleSendMessage = async (messageText = null) => {
    const textToSend = messageText || inputMessage;
    if (!textToSend.trim() || loading || !isInitialized) return;

    const userMessage = {
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');

    // Відправляємо з повним контекстом
    const contextMessage = getFullContext(textToSend);
    const response = await sendMessage(contextMessage);

    if (response) {
      const aiMessage = {
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }
  };

  // Обробник швидких кнопок
  const handleQuickAction = (actionText) => {
    handleSendMessage(actionText);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isInitialized) {
    return null; // Не показуємо чат якщо AI не налаштовано
  }

  return (
    <>
      {/* Кнопка відкриття чату */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 right-6 z-40 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow"
          >
            <MessageCircle size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Вікно чату */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Заголовок */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={20} />
                <h3 className="font-semibold">AI Асистент</h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-1 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Повідомлення */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-purple-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-purple-200' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString('uk-UA', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm">
                    <Loader2 className="animate-spin text-purple-600" size={20} />
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Швидкі кнопки */}
            {messages.length <= 1 && (
              <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Швидкі дії:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action.text)}
                      disabled={loading}
                      className="flex items-center gap-1.5 px-2.5 py-2 bg-white border border-purple-200 text-purple-700 rounded-lg text-xs hover:bg-purple-50 hover:border-purple-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="text-base">{action.emoji}</span>
                      <span className="text-left flex-1">{action.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Поле вводу */}
            <div className="p-4 bg-white border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Напишіть повідомлення..."
                  disabled={loading}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-100"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={loading || !inputMessage.trim()}
                  className="bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChat;
