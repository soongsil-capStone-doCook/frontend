// 전역 커스텀 훅 - 인증 관련
import { useState, useEffect } from 'react';
import { useUserStore } from '../store/useUserStore';

export const useAuth = () => {
  const { user, setUser, clearUser } = useUserStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 토큰 확인 및 사용자 정보 로드
    const token = localStorage.getItem('token');
    if (token) {
      // 사용자 정보 로드 로직
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    // 로그인 로직
  };

  const logout = () => {
    localStorage.removeItem('token');
    clearUser();
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };
};

