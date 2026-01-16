// components/AddHabitForm.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Edit3, Loader2, ArrowLeft } from "lucide-react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const categories = [
  { id: "health", name: "Здоров'я", emoji: "🏥" },
  { id: "sport", name: "Спорт", emoji: "⚽" },
  { id: "study", name: "Навчання", emoji: "📚" },
  { id: "work", name: "Робота", emoji: "💼" },
  { id: "personal", name: "Особисте", emoji: "🌟" },
  { id: "other", name: "Інше", emoji: "📌" },
];

const listVariants = {
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  hidden: { opacity: 0 },
};
const itemVariants = {
  visible: { opacity: 1, y: 0, scale: 1 },
  hidden: { opacity: 0, y: 10, scale: 0.95 },
};

const AddHabitForm = ({ onAdd, onCancel }) => {
  const [mode, setMode] = useState("choose"); 
  const [name, setName] = useState("");
  const [category, setCategory] = useState(""); 
  const [description, setDescription] = useState("");
  const [aiQuery, setAiQuery] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showManualAfterAI, setShowManualAfterAI] = useState(false);

  const generateAIHabits = async () => {
    if (!aiQuery.trim()) return;
    setAiLoading(true);
    setAiSuggestions([]);
    setShowManualAfterAI(false);

    const apiKey = localStorage.getItem('gemini_api_key');

    if (!apiKey) {
      console.error("API ключ не знайдено в localStorage!");
      alert("API ключ не знайдено. Будь ласка, додайте ваш API ключ у Налаштуваннях.");
      setAiLoading(false);
      return; 
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey); 
      const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

      const prompt = `
        Користувач хоче створити звичку на тему: "${aiQuery}".
        Згенеруй 4 унікальні назви та короткі описи для кожної звички українською мовою.
        Відповідь має містити ТІЛЬКИ 4 рядки у форматі "Назва: Опис".
        Без нумерації, без привітань, без зайвого тексту.
      `;

      const result = await model.generateContent(prompt); 
      const text = await result.response.text();

      const habits = text
        .split(/\n/)
        .map((line) => line.trim())
        .filter((line) => line.includes(":"))
        .map((line) => line.replace(/^[0-9]\.\s*/, '').replace(/^\* \s*/, ''))
        .slice(0, 4)
        .map((line) => {
          const parts = line.split(":");
          const title = parts[0].trim();
          const desc = parts.slice(1).join(":").trim();
          return { title, desc };
        });

      setAiSuggestions(habits);
      setShowManualAfterAI(true);
      if (habits[0]) {
        setName(habits[0].title);
        setDescription(habits[0].desc);
      }
    } catch (err) {
      console.error("AI error:", err);
      alert("Помилка генерації. Можливо, ваш API ключ недійсний або закінчився. Перевірте його в Налаштуваннях.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleSelectAIHabit = (habit) => {
    setName(habit.title);
    setDescription(habit.desc);
    setShowManualAfterAI(true);
    setMode("ai");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !category) {
    	alert("Будь ласка, введіть назву та оберіть категорію.");
    	return;
    }

    onAdd({
      id: Date.now().toString(), 
      name,
      category,
      description,
      startDate: new Date().toISOString().split("T")[0],
      completedDays: [], 
    });
  };
  
  const renderManualForm = (key = "manual") => (
    <motion.form
      onSubmit={handleSubmit}
      key={key}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`space-y-3 ${key === 'manualInsideAI' ? 'pt-3 border-t border-white/30 mt-3' : ''}`}
    >
      {key === 'manualInsideAI' && (
      	<h4 className="font-semibold text-gray-800 dark:text-gray-100">Налаштуй звичку під себе</h4>
      )}

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Назва звички"
        className="w-full p-2.5 rounded-xl border border-white/30 focus:ring-2 focus:ring-violet-400 outline-none text-sm bg-white/70 backdrop-blur-sm placeholder:text-gray-500 text-gray-900"
        required
      />

      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <motion.button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={`px-3 py-1.5 rounded-xl border text-sm transition-all ${
              category === cat.id
                ? "bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-md border-transparent"
                : "bg-white/70 text-gray-600 border-gray-300/50 hover:bg-white"
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {cat.emoji} {cat.name}
          </motion.button>
        ))}
      </div>

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Короткий опис або мета (необов’язково)"
        className="w-full p-2.5 rounded-xl border border-white/30 focus:ring-2 focus:ring-fuchsia-400 outline-none resize-none h-20 text-sm bg-white/70 backdrop-blur-sm placeholder:text-gray-500 text-gray-900"
      />

      <div className="flex gap-2 justify-end pt-1">
        <motion.button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-xl border border-gray-300/70 text-gray-600 hover:bg-gray-100/50 text-sm bg-white/70"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Скасувати
        </motion.button>
        <motion.button
          type="submit"
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-md hover:shadow-pink-400/40 transition-all text-sm"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Створити
        </motion.button>
      </div>
    </motion.form>
  );

  return (
    <motion.div
      className="w-full max-w-lg mx-auto bg-gradient-to-br from-violet-500/15 to-pink-500/15 backdrop-blur-xl rounded-2xl shadow-glow p-4 space-y-3 border border-white/20"
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.28 }}
  >
      <AnimatePresence mode="wait">
        {mode === "choose" && (
          <motion.div
            key="choose"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-3"
          >
            <h2 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-100">
              Як хочеш створити звичку?
            </h2>

            <div className="flex gap-3 w-full justify-center">
            <button
                onClick={() => setMode("ai")}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-fuchsia-400/40 hover:scale-[1.03] transition-all border border-white/30 text-sm"
              >
                <Sparkles className="w-4 h-4" /> За допомогою ШІ
              </button>

              <button
                onClick={() => setMode("manual")}
            	   className="flex items-center justify-center gap-2 bg-white/90 backdrop-blur-sm border border-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-white hover:shadow-md transition-all text-sm"
              >
                <Edit3 className="w-4 h-4" /> Вручну
              </button>
            </div>
          </motion.div>
        )}

        {mode === "ai" && (
          <motion.div
            key="ai"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-sm sm:text-md font-semibold text-gray-800 dark:text-gray-100">Генерація ідей звичок</h3>
      	       <button onClick={() => { setMode("choose"); setShowManualAfterAI(false); setAiSuggestions([]); }} className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1">
      	         <ArrowLeft className="w-3 h-3" /> Назад
              </button>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={aiQuery}
                onChange={(e) => setAiQuery(e.target.value)}
                placeholder="Опиши, яку звичку хочеш створити..."
  	             className="flex-grow p-2.5 rounded-xl border border-white/30 focus:ring-2 focus:ring-fuchsia-400 outline-none bg-white/70 backdrop-blur-sm text-sm placeholder:text-gray-500 text-gray-900"
              />
              <button
                onClick={generateAIHabits}
                disabled={aiLoading} 
                className="bg-gradient-to-r from-pink-500 to-fuchsia-600 text-white px-4 py-2 rounded-xl shadow-sm hover:shadow-pink-400/40 hover:scale-[1.03] transition-all text-sm disabled:opacity-50"
              >
                {aiLoading ? <Loader2 className="animate-spin w-4 h-4" /> : "✨"}
              </button>
            </div>

            {aiSuggestions.length > 0 && (
              <motion.div 
            	   className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2"
            	   variants={listVariants}
            	   initial="hidden"
            	   animate="visible"
              >
                {aiSuggestions.map((habit, i) => (
                  <motion.button
                    key={i}
                    onClick={() => handleSelectAIHabit(habit)}
                    className="py-2 px-3 rounded-xl text-left text-white bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-md border border-white/20 hover:shadow-violet-400/40 transition-all text-sm"
                    variants={itemVariants}
            	       whileHover={{ scale: 1.04 }}
            	       whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-semibold">{habit.title}</span>
                    <span className="block text-xs opacity-80">{habit.desc}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}

            <AnimatePresence>{showManualAfterAI && renderManualForm("manualInsideAI")}</AnimatePresence>
          </motion.div>
        )}

        {mode === "manual" && renderManualForm("manual")}
      </AnimatePresence>
    </motion.div>
  );
};

export default AddHabitForm;