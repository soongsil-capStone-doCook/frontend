// 이태건: 로그인, 카카오 API 관련
import axiosInstance from './axiosInstance';

export const authAPI = {
  // 카카오 로그인
  kakaoLogin: (code) => {
    return axiosInstance.post('/auth/kakao', { code });
  },

  // 로그인
  login: (email, password) => {
    return axiosInstance.post('/auth/login', { email, password });
  },

  // 로그아웃
  logout: () => {
    return axiosInstance.post('/auth/logout');
  },

  // 토큰 갱신
  refreshToken: () => {
    return axiosInstance.post('/auth/refresh');
  },
};

