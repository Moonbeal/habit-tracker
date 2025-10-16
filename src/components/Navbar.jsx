// components/Navbar.jsx - Навігаційна панель
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ListChecks, BarChart3, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Головна' },
    { path: '/habits', icon: ListChecks, label: 'Звички' },
    { path: '/stats', icon: BarChart3, label: 'Статистика' },
    { path: '/achievements', icon: Trophy, label: 'Досягнення' },
  ];

  return (
    <nav className='fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-purple-200 shadow-lg z-50'>
      <div className='container mx-auto px-4'>
        <div className='flex justify-around items-center py-3'>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className='relative flex flex-col items-center gap-1 group'
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-xl transition-colors ${
                    isActive
                      ? 'bg-purple-500 text-white'
                      : 'text-purple-600 hover:bg-purple-100'
                  }`}
                >
                  <Icon size={24} />
                </motion.div>
                <span
                  className={`text-xs font-medium transition-colors ${
                    isActive ? 'text-purple-700' : 'text-purple-500'
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId='activeTab'
                    className='absolute -bottom-3 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-500 rounded-full'
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
