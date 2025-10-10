// types/Habit.ts
export interface Habit {
  id: string;
  name: string;
  description?: string;
  color: string;
  category: 'health' | 'sport' | 'study' | 'work' | 'personal' | 'other';
  startDate: string;
  completedDays: string[];
  currentStreak: number;
  bestStreak: number;
  notes?: Record<string, string>; // день -> нотатка
}
