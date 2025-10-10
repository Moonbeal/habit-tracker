// App.tsx - Головний компонент застосунку
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import HabitsPage from './pages/HabitsPage';
import StatsPage from './pages/StatsPage';
import AchievementsPage from './pages/AchievementsPage';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-lavender-50 to-purple-100">
        <div className="container mx-auto px-4 pb-20">
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/habits' element={<HabitsPage />} />
            <Route path='/stats' element={<StatsPage />} />
            <Route path='/achievements' element={<AchievementsPage />} />
          </Routes>
        </div>
        <Navbar />
      </div>
    </Router>
  );
};

export default App;
