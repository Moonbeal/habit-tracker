// config/images.js - Конфігурація зображень
export const images = {
  // Hero фото
  hero: {
    main: 'https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=2000&auto=format&fit=crop',
    alt: 'Японський храм з червоними кленами на фоні гір'
  },

  // Showcase фото
  showcase: {
    running: {
      url: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=800&auto=format&fit=crop',
      alt: 'Ранкова пробіжка в горах'
    },
    meditation: {
      url: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=800&auto=format&fit=crop',
      alt: 'Медитація на природі'
    },
    reading: {
      url: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=800&auto=format&fit=crop',
      alt: 'Читання книжок'
    },
    water: {
      url: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=800&auto=format&fit=crop',
      alt: 'Свіжа вода'
    },
    gratitude: {
      url: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=800&auto=format&fit=crop',
      alt: 'Вдячність'
    }
  },

  // Додаткові фото для features
  features: {
    tracking: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800&auto=format&fit=crop',
    stats: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
    calendar: 'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=800&auto=format&fit=crop',
    achievements: 'https://images.unsplash.com/photo-1569163139394-de4798aa62b6?q=80&w=800&auto=format&fit=crop',
    ai: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop',
    analytics: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop'
  },

  // Фонові текстури
  backgrounds: {
    autumn: 'https://images.unsplash.com/photo-1507371341162-763b5e419408?q=80&w=2000&auto=format&fit=crop',
    gradient: 'https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop'
  }
};

// Fallback зображення
export const fallbackImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3EЗавантаження...%3C/text%3E%3C/svg%3E';
