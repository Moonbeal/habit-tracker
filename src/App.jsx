// App.jsx - Головний компонент застосунку
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HabitsPage from './pages/HabitsPage';
import StatsPage from './pages/StatsPage';
import AchievementsPage from './pages/AchievementsPage';
import AIAssistantPage from './pages/AIAssistantPage';
import Navbar from './components/Navbar';
import AIChat from './components/AIChat';
import useLocalStorage from './hooks/useLocalStorage';

const App = () => {
  const [habits] = useLocalStorage('habits', []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-lavender-50 to-purple-100">
        <div className="container mx-auto px-4 pb-20">
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/habits' element={<HabitsPage />} />
            <Route path='/stats' element={<StatsPage />} />
            <Route path='/achievements' element={<AchievementsPage />} />
            <Route path='/ai-assistant' element={<AIAssistantPage />} />
          </Routes>
        </div>
        <Navbar />
        <AIChat habits={habits} />
      </div>
    </Router>
  );
};

export default App;
