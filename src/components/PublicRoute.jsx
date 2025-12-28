// 공개 라우트 가드 컴포넌트 (로그인한 사용자는 접근 불가)
import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";

const PublicRoute = ({ children }) => {
  const { isLoggined } = useUserStore();
  const accessToken = localStorage.getItem("accessToken");

  // accessToken이 있으면 로그인된 것으로 간주
  const isAuthenticated = isLoggined || !!accessToken;

  if (isAuthenticated) {
    // 로그인한 경우 홈으로 리다이렉트
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;

