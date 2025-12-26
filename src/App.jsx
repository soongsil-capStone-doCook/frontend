import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import Home from "./pages/Home/Home";
import Refrigerator from "./pages/Fridge/MyRefrigerator";
import Receipt from "./pages/Receipt/Receipt";
import Search from "./pages/Search/Search";
import MyPage from "./pages/MyPage/MyPage";
import Login from "./pages/Login/Login";
import KakaoCallback from "./pages/Login/kakaoCallback";
import Onboarding from "./pages/Login/Onboarding";
import RecipeDetail from "./pages/RecipeDetail/RecipeDetail";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* 로그인 필요 페이지 */}
        <Route
          index
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="search"
          element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          }
        />
        <Route
          path="recipe/:recipeId"
          element={
            <ProtectedRoute>
              <RecipeDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="refrigerator"
          element={
            <ProtectedRoute>
              <Refrigerator />
            </ProtectedRoute>
          }
        />
        <Route
          path="receipt"
          element={
            <ProtectedRoute>
              <Receipt />
            </ProtectedRoute>
          }
        />
        <Route
          path="mypage"
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />
        
        {/* 로그인한 사용자는 접근 불가 페이지 */}
        <Route
          path="login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="login/kakao/callback" element={<KakaoCallback />} />
      </Route>
    </Routes>
  );
}

export default App;
