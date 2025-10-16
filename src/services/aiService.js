// aiService.js - Сервіс для роботи з Gemini AI
import { GoogleGenerativeAI } from '@google/generative-ai';

class AIService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.chat = null;
  }

  // Ініціалізація AI з API ключем
  initialize(apiKey) {
    if (!apiKey) {
      throw new Error('API ключ не надано');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ 
      model: 'gemini-2.0-flash-exp',
      generationConfig: {
        temperature: 0.9,
        topP: 1,
        maxOutputTokens: 2048,
      }
    });
  }

  // Перевірка чи ініціалізовано
  isInitialized() {
    return this.genAI !== null && this.model !== null;
  }

  // Початок нової чат-сесії
  startChat(history = []) {
    if (!this.isInitialized()) {
      throw new Error('AI не ініціалізовано. Спочатку викличте initialize()');
    }

    this.chat = this.model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });
  }

  // Відправка повідомлення в чат
  async sendMessage(message) {
    if (!this.chat) {
      this.startChat();
    }

    try {
      const result = await this.chat.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Помилка при відправці повідомлення:', error);
      throw error;
    }
  }

  // Генерація тексту без контексту чату
  async generateText(prompt) {
    if (!this.isInitialized()) {
      throw new Error('AI не ініціалізовано');
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Помилка при генерації тексту:', error);
      throw error;
    }
  }

  // Аналіз звичок користувача
  async analyzeHabits(habits) {
    const habitsData = habits.map(h => ({
      name: h.name,
      category: h.category,
      currentStreak: h.currentStreak || 0,
      bestStreak: h.bestStreak || 0,
      completions: h.completions?.length || 0
    }));

    const prompt = `
Ти - персональний асистент для формування звичок. Проаналізуй звички користувача та дай короткі поради українською мовою.

Звички користувача:
${JSON.stringify(habitsData, null, 2)}

Дай:
1. Загальну оцінку прогресу (2-3 речення)
2. Що йде добре (1-2 речення)
3. Над чим попрацювати (1-2 речення)
4. Одну конкретну пораду на сьогодні

Відповідай коротко, по суті, дружнім тоном.
`;

    return await this.generateText(prompt);
  }

  // Рекомендації нових звичок
  async recommendHabits(existingHabits, userGoals = '') {
    const categories = existingHabits.map(h => h.category);
    
    const prompt = `
Ти - експерт з формування звичок. Порекомендуй 3 нові звички користувачу українською мовою.

Поточні звички користувача: ${existingHabits.map(h => h.name).join(', ')}
Категорії: ${categories.join(', ')}
${userGoals ? `Цілі користувача: ${userGoals}` : ''}

Запропонуй 3 нові звички у форматі:
1. **Назва звички** - коротке пояснення чому це корисно (1 речення)
2. **Назва звички** - коротке пояснення чому це корисно (1 речення)
3. **Назва звички** - коротке пояснення чому це корисно (1 речення)

Звички мають бути реалістичними та доповнювати існуючі.
`;

    return await this.generateText(prompt);
  }

  // Мотиваційне повідомлення
  async generateMotivation(habitName, streak) {
    const prompt = `
Створи коротке мотиваційне повідомлення українською для користувача, який виконує звичку "${habitName}".
Поточна серія: ${streak} днів.

Повідомлення має бути:
- Коротким (1-2 речення)
- Позитивним та енергійним
- З емодзі
- Персоналізованим під цю звичку

Просто напиши повідомлення без додаткових пояснень.
`;

    return await this.generateText(prompt);
  }

  // Аналіз статистики
  async analyzeStats(stats) {
    const prompt = `
Проаналізуй статистику звичок користувача та дай інсайти українською мовою.

Статистика:
- Всього звичок: ${stats.totalHabits}
- Всього виконань: ${stats.totalCompletions}
- Найкраща серія: ${stats.bestStreak} днів
- Виконання за останній тиждень: ${stats.weeklyCompletions || 'немає даних'}

Дай:
1. Головний інсайт (що найбільше впадає в очі)
2. Тренд (покращення чи погіршення)
3. Конкретну рекомендацію

Відповідай коротко, 3-4 речення загалом.
`;

    return await this.generateText(prompt);
  }

  // Відповідь на довільне питання про звички
  async askQuestion(question, context = {}) {
    const contextStr = Object.keys(context).length > 0 
      ? `\n\nКонтекст:\n${JSON.stringify(context, null, 2)}`
      : '';

    const prompt = `
Ти - персональний асистент для формування звичок. Відповідай українською мовою.
${contextStr}

Питання користувача: ${question}

Дай корисну, конкретну відповідь. Будь дружнім та підтримуючим.
`;

    return await this.generateText(prompt);
  }
}

// Експортуємо єдиний екземпляр (singleton)
export const aiService = new AIService();
