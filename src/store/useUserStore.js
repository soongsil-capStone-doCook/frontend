// Zustand 전역 상태 - 로그인 유저 정보 및 식습관 설정
import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: null,
  dietaryPreferences: null,

  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),

  setDietaryPreferences: (preferences) =>
    set({ dietaryPreferences: preferences }),
}));

export { useUserStore };

