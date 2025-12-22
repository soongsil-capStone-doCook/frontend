// Zustand 전역 상태 - 로그인 유저 정보 및 식습관 설정
import { create } from "zustand";

// 앱 초기화 시 localStorage에서 authorization code 확인
const checkAuthStatus = () => {
  const authorizationCode = localStorage.getItem("authorizationCode");
  return !!authorizationCode; // authorization code가 있으면 true, 없으면 false
};

const useUserStore = create((set) => ({
  user: null, // 로그인한 사용자 정보
  dietaryPreferences: null, // 식습관 설정
  isLoggined: checkAuthStatus(), // 앱 시작 시 토큰 확인

  setUser: (user) => set({ user }),
  clearUser: () => {
    localStorage.removeItem("authorizationCode");
    set({ user: null, isLoggined: false });
  }, // 로그아웃 함수
  setIsLoggined: (isLoggined) => set({ isLoggined }),

  setDietaryPreferences: (preferences) =>
    set({ dietaryPreferences: preferences }),
}));

export { useUserStore };
