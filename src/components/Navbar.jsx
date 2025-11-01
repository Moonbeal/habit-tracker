// components/Navbar.jsx 
import React, { useState, useEffect, useRef } from 'react'; 
import { Link, useLocation } from 'react-router-dom';
// +++ ОНОВЛЕНО: 'Trophy' замінено на 'Gamepad2' +++
import { Home, ListChecks, Gamepad2, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SettingsModal from './SettingsModal';

const navVariants = {
  visible: { y: 0, opacity: 1 },
  hidden: { y: "100%", opacity: 0 }
};

const Navbar = () => {
  const location = useLocation();
  const [hidden, setHidden] = useState(false);
  const lastScrollY = useRef(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDirection = currentScrollY - lastScrollY.current;
      const threshold = 5; 

      if (scrollDirection > threshold && currentScrollY > 50) { 
        setHidden(true);
      } 
      else if (scrollDirection < -threshold) {
        setHidden(false);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); 

  const navItems = [
    { path: '/', icon: Home, label: 'Головна' },
    { path: '/habits', icon: ListChecks, label: 'Звички' },
    // +++ ОНОВЛЕНО: іконка та шлях (якщо треба) +++
    { path: '/achievements', icon: Gamepad2, label: 'Мій персонаж' },
  ];

  return (
    <>
    <motion.nav 
      variants={navVariants}
      animate={hidden ? "hidden" : "visible"} 
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className='fixed bottom-0 left-0 right-0 glass-strong backdrop-blur-md shadow-purple z-50'
    >
      <div className='container mx-auto px-4'>
        {/* +++ ОНОВЛЕНО: Вся структура кнопок змінена +++ */}
        {/* Тепер це один flex-контейнер з 'justify-around' */}
        <div className='flex justify-around items-center py-2'>
          
          {/* --- Кнопка Налаштувань --- */}
          <button
            onClick={() => setIsModalOpen(true)}
            // --- ОНОВЛЕНО: 'flex-col' та 'gap-1' прибрано, 'p-3' додано ---
            className='relative p-3 group transition-all rounded-xl'
            aria-label="Налаштування"
          >
            <Settings 
              // --- ОНОВЛЕНО: Розмір іконки ---
              size={26} 
              className='text-purple-400 dark:text-purple-500 group-hover:text-purple-600 dark:group-hover:text-purple-300'
            />
            {/* --- 'span' з текстом "Налаш." видалено --- */}
          </button>
          
          {/* --- Основні кнопки навігації --- */}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                // +++ ОНОВЛЕНО: 'flex-col' і 'gap-1' прибрано, 'p-3' додано +++
                className='relative p-3 group transition-all rounded-xl'
                aria-label={item.label} // +++ Додано для доступності
              >
                <AnimatePresence>
                  {isActive && (
                  <motion.div
                    layoutId='activeTab'
                    // --- ОНОВЛЕНО: 'inset-0' тепер коректно працює з 'p-3' ---
                    className='absolute inset-0 rounded-xl bg-purple-100 dark:bg-purple-800/50 -z-10'
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                </AnimatePresence>
                
                <Icon 
                  // +++ ОНОВЛЕНО: Розмір іконки +++
                  size={26} 
                  className={`transition-colors ${
                    isActive
                      ? 'text-purple-600 dark:text-purple-200'
                      : 'text-purple-400 dark:text-purple-500 group-hover:text-purple-600 dark:group-hover:text-purple-300'
                  }`}
                />
                
    </Link>
            );
          })}
          </div>
      </div>
    </motion.nav>

    {/* Модальне вікно залишається без змін */}
    <AnimatePresence mode="wait">
      {isModalOpen && <SettingsModal onClose={() => setIsModalOpen(false)} />}
    </AnimatePresence>
  </>
  );
};

export default Navbar;