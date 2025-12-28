import { useState, useEffect } from "react";
import { recipeAPI } from "../../api/recipe";
import RecipeSwiper from "../../components/RecipeSwiper";
import RecipeGrid from "../../components/RecipeGrid";

// 랜덤 키워드 목록 (컴포넌트 외부로 이동)
const keywords = [
  "김치찌개",
  "파스타",
  "볶음밥",
  "샐러드",
  "스테이크",
  "치킨",
  "피자",
  "라면",
  "떡볶이",
  "비빔밥",
];

const Home = () => {
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [randomRecipes, setRandomRecipes] = useState([]);
  const [isLoadingLiked, setIsLoadingLiked] = useState(true);
  const [isLoadingRandom, setIsLoadingRandom] = useState(true);

  // 찜 기반 추천 레시피 가져오기
  useEffect(() => {
    const fetchLikedRecipes = async () => {
      try {
        setIsLoadingLiked(true);
        const response = await recipeAPI.getLikedRecommendations();
        // 실제 응답 형식: { isSuccess, code, message, result: [...] } 또는 배열 직접 반환
        const recipesData = Array.isArray(response.data)
          ? response.data
          : response.data?.result || [];
        setLikedRecipes(recipesData);
      } catch (error) {
        console.error("찜 기반 추천 레시피 로드 실패:", error);
        setLikedRecipes([]);
      } finally {
        setIsLoadingLiked(false);
      }
    };

    fetchLikedRecipes();
  }, []);

  // 랜덤 키워드로 레시피 검색
  useEffect(() => {
    const fetchRandomRecipes = async () => {
      try {
        setIsLoadingRandom(true);
        // 랜덤 키워드 선택
        const randomKeyword =
          keywords[Math.floor(Math.random() * keywords.length)];
        const response = await recipeAPI.searchRecipes(randomKeyword);
        // 실제 응답 형식: { isSuccess, code, message, result: [...] } 또는 배열 직접 반환
        const recipesData = Array.isArray(response.data)
          ? response.data
          : response.data?.result || [];
        setRandomRecipes(recipesData);
      } catch (error) {
        console.error("랜덤 레시피 로드 실패:", error);
        setRandomRecipes([]);
      } finally {
        setIsLoadingRandom(false);
      }
    };

    fetchRandomRecipes();
  }, []);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 오늘의 추천메뉴 섹션 */}
      <section className="px-4 pt-8 pb-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1.5 tracking-tight">
            오늘의 추천메뉴
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            당신의 취향에 맞는 레시피를 추천해드려요
          </p>
        </div>
        <RecipeSwiper recipes={likedRecipes} isLoading={isLoadingLiked} />
      </section>

      {/* 이런 요리는 어때요? 섹션 */}
      <section className="px-4 pt-6 pb-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-1.5 tracking-tight">
            이런 요리는 어때요?
          </h2>
          <p className="text-sm text-gray-500 font-medium">
            다양한 레시피를 둘러보세요
          </p>
        </div>
        <RecipeGrid recipes={randomRecipes} isLoading={isLoadingRandom} />
      </section>
    </div>
  );
};

export default Home;
