import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home/Home";
import Fridge from "./pages/Fridge/Fridge";
import Receipt from "./pages/Receipt/Receipt";
import Search from "./pages/Search/Search";
import MyPage from "./pages/MyPage/MyPage";
import RecipeDetail from "./pages/RecipeDetail/RecipeDetail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="fridge" element={<Fridge />} />
        <Route path="receipt" element={<Receipt />} />
        <Route path="search" element={<Search />} />
        <Route path="recipe/:recipeId" element={<RecipeDetail />} />
        <Route path="mypage" element={<MyPage />} />
      </Route>
    </Routes>
  );
}

export default App;
