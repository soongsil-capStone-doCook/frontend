// Axios 기본 설정 (BaseURL, Header 등)
import axios from "axios";
import { authAPI } from "./auth";
import { isTokenExpired } from "../utils/tokenUtils";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4010",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// refreshToken 호출 중 플래그 (무한 루프 방지)
let isRefreshing = false;
// refreshToken 호출 중 대기 중인 요청들
let failedQueue = [];

// 대기 중인 요청들을 처리하는 함수
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  async (config) => {
    // 서버에서 받은 accessToken 사용
    const accessToken = localStorage.getItem("accessToken");
    
    // refreshToken 엔드포인트가 아니고, 토큰이 만료되었거나 없으면 갱신 시도
    if (
      accessToken &&
      !config.url?.includes("/auth/refresh") &&
      isTokenExpired(accessToken)
    ) {
      const refreshToken = localStorage.getItem("refreshToken");
      
      if (refreshToken && !isRefreshing) {
        try {
          isRefreshing = true;
          const response = await authAPI.refreshToken();
          const newAccessToken = response.data?.accessToken || response.data?.result?.accessToken;
          
          if (newAccessToken) {
            localStorage.setItem("accessToken", newAccessToken);
            if (response.data?.expiresIn) {
              const expirationTime = Date.now() + response.data.expiresIn * 1000;
              localStorage.setItem("accessTokenExpiresAt", expirationTime.toString());
            }
            config.headers.Authorization = `Bearer ${newAccessToken}`;
            isRefreshing = false;
            return config;
          } else {
            // newAccessToken이 없으면 기존 토큰으로 진행 (응답 인터셉터에서 처리)
            isRefreshing = false;
            if (accessToken) {
              config.headers.Authorization = `Bearer ${accessToken}`;
            }
            return config;
          }
        } catch (error) {
          // refreshToken 갱신 실패 시 기존 토큰으로 진행 (응답 인터셉터에서 401 처리)
          isRefreshing = false;
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
          return config;
        }
      } else if (isRefreshing) {
        // 이미 갱신 중이면 기존 토큰으로 진행
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      }
    }
    
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // 401 에러이고, refreshToken 엔드포인트가 아닌 경우에만 토큰 갱신 시도
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      // 이미 refreshToken 호출 중이면 대기
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      // refreshToken이 없으면 로그아웃 처리
      if (!refreshToken) {
        isRefreshing = false;
        processQueue(error, null);
        handleLogout();
        return Promise.reject(error);
      }

      try {
        // refreshToken으로 새로운 accessToken 받기
        const response = await authAPI.refreshToken();
        const newAccessToken = response.data?.accessToken || response.data?.result?.accessToken;

        if (newAccessToken) {
          // 새로운 accessToken 저장
          localStorage.setItem("accessToken", newAccessToken);
          
          // expiresIn이 있으면 함께 저장 (선택사항)
          if (response.data?.expiresIn) {
            const expirationTime = Date.now() + response.data.expiresIn * 1000;
            localStorage.setItem("accessTokenExpiresAt", expirationTime.toString());
          }

          // 원래 요청의 Authorization 헤더 업데이트
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

          // 대기 중인 요청들 처리
          processQueue(null, newAccessToken);
          isRefreshing = false;

          // 원래 요청 재시도
          return axiosInstance(originalRequest);
        } else {
          throw new Error("새로운 accessToken을 받지 못했습니다.");
        }
      } catch (refreshError) {
        // refreshToken 갱신 실패 시 로그아웃 처리
        isRefreshing = false;
        processQueue(refreshError, null);
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    // 401 에러이지만 refreshToken 엔드포인트인 경우 또는 다른 에러인 경우
    if (error.response?.status === 401 && originalRequest.url?.includes("/auth/refresh")) {
      // refreshToken도 만료된 경우 로그아웃
      handleLogout();
    }

    return Promise.reject(error);
  }
);

// 로그아웃 처리 함수
const handleLogout = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("accessTokenExpiresAt");
  
  // Zustand store의 clearUser 호출 (순환 참조 방지를 위해 직접 처리)
  // 필요시 window.location.href로 로그인 페이지로 리다이렉트
  if (window.location.pathname !== "/login") {
    window.location.href = "/login";
  }
};

export default axiosInstance;
