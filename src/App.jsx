import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home/Home";
import Refrigerator from "./pages/Fridge/MyRefrigerator";
import Receipt from "./pages/Receipt/Receipt";
import Search from "./pages/Search/Search";
import MyPage from "./pages/MyPage/MyPage";
import Login from "./pages/Login/Login";
import KakaoCallback from "./pages/Login/KakaoCallback";
import Onboarding from "./pages/Login/Onboarding";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="refrigerator" element={<Refrigerator />} />
        <Route path="receipt" element={<Receipt />} />
        <Route path="search" element={<Search />} />
        <Route path="mypage" element={<MyPage />} />
        <Route path="login" element={<Login />} />
        <Route path="login/kakao/callback" element={<KakaoCallback />} />
        <Route path="onboarding" element={<Onboarding />} />
      </Route>
    </Routes>
  );
}

export default App;
