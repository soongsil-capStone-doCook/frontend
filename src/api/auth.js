// 이태건: 로그인, 카카오 API 관련
import axiosInstance from "./axiosInstance";
import axios from "axios";

// refreshToken 호출용 별도 인스턴스 (인터셉터 없이 직접 호출)
const refreshAxiosInstance = axios.create({
  baseURL: "/api", // 프록시 사용 (CORS 우회)
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const authAPI = {
  // 카카오 로그인 (인증 코드로 로그인)
  kakaoLogin: (code, redirectUri) => {
    return axiosInstance.post("/auth/login/kakao", {
      code: code,
      redirectUri: redirectUri,
    });
  },

  // 로그인
  login: (email, password) => {
    return axiosInstance.post("/auth/login", { email, password });
  },

  // 로그아웃
  logout: () => {
    return axiosInstance.post("/auth/logout");
  },

  // 토큰 갱신 (인터셉터를 거치지 않도록 별도 인스턴스 사용)
  refreshToken: () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      return Promise.reject(new Error("Refresh token이 없습니다."));
    }

    // refreshToken을 Authorization 헤더에 Bearer로 보냄
    return refreshAxiosInstance.post(
      "/auth/refresh",
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );
  },
};
