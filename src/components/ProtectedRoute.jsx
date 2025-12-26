// 로그인 가드 컴포넌트
import { Navigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";

const ProtectedRoute = ({ children }) => {
  const { isLoggined } = useUserStore();
  const accessToken = localStorage.getItem("accessToken");

  // accessToken이 있으면 로그인된 것으로 간주
  const isAuthenticated = isLoggined || !!accessToken;

  if (!isAuthenticated) {
    // 로그인하지 않은 경우 로그인 페이지로 리다이렉트
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

