// Zustand 전역 상태 - 로그인 유저 정보 및 식습관 설정
import { create } from "zustand";

const useUserStore = create((set) => ({
  user: null, // 로그인한 사용자 정보
  dietaryPreferences: null, // 식습관 설정
  isLoggined: false, // 로그인 여부

  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null, isLoggined: false }), // 로그아웃 함수
  setIsLoggined: (isLoggined) => set({ isLoggined }),

  setDietaryPreferences: (preferences) =>
    set({ dietaryPreferences: preferences }),
}));

export { useUserStore };
