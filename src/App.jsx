// App.jsx - Головний компонент застосунку
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/MainPage.jsx';
import HabitsPage from './pages/HabitsPage';
import StatsPage from './pages/StatsPage';
import AchievementsPage from './pages/AchievementsPage';
import AIAssistantPage from './pages/AIAssistantPage';
import Navbar from './components/Navbar';
import AIChat from './components/AIChat';
import useLocalStorage from './hooks/useLocalStorage';
import { ThemeProvider } from './contexts/ThemeContext';
import FloatingElements from './components/FloatingElements';

const App = () => {
  const [habits] = useLocalStorage('habits', []);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen transition-colors relative">
          <FloatingElements />
          <div className="container mx-auto px-4 pb-20 relative z-10">
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
    </ThemeProvider>
  );
};

export default App;
