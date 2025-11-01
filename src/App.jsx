// App.jsx 
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/MainPage';
import HabitsPage from './pages/HabitsPage';
import AchievementsPage from './pages/ProgressPage'; 
import Navbar from './components/Navbar';
import useLocalStorage from './hooks/useLocalStorage';
import { ThemeProvider } from './contexts/ThemeContext';
import FloatingElements from './components/FloatingElements';
import AIChat from './components/AIChat';
const App = () => {

  const [habits, setHabits] = useLocalStorage('habits', []);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen transition-colors relative">
          <FloatingElements />
          
          <div className="container mx-auto px-4 pb-20 relative z-10">
            <Routes>
              <Route path="/" element={<HomePage habits={habits} setHabits={setHabits} />} />
              <Route path="/habits" element={<HabitsPage habits={habits} setHabits={setHabits} />} />
              <Route path="/achievements" element={<AchievementsPage habits={habits} setHabits={setHabits} />} />
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