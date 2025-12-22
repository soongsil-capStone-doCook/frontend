// Axios 기본 설정 (BaseURL, Header 등)
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4010",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    // authorization code가 있으면 사용, 없으면 더미 코드 사용 (임시 조치)
    const authorizationCode =
      localStorage.getItem("authorizationCode") || "dummy-code-for-dev";
    config.headers.Authorization = `Bearer ${authorizationCode}`;
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
  (error) => {
    // 401 에러 시 authorization code 제거 (자동 리다이렉트 제거)
    if (error.response?.status === 401) {
      localStorage.removeItem("authorizationCode");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
