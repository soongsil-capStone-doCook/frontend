// 서주원: 검색 결과 페이지 (현재 Search.jsx에 통합되어 사용되지 않음)
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { recipeAPI } from "../../api/recipe";
import RecipeGrid from "../../components/RecipeGrid";
import { HiArrowLeft } from "react-icons/hi";

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const keyword = searchParams.get("keyword");
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (!keyword) {
        navigate("/search");
        return;
      }

      try {
        setIsLoading(true);
        const response = await recipeAPI.searchRecipes(keyword);
        setRecipes(response.data || []);
      } catch (error) {
        console.error("검색 실패:", error);
        setRecipes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [keyword, navigate]);

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/search")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <HiArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              '{keyword}' 검색 결과
            </h1>
            {!isLoading && (
              <p className="text-sm text-gray-600 mt-1">
                {recipes.length}개의 레시피를 찾았습니다
              </p>
            )}
          </div>
        </div>

        {/* 검색 결과 */}
        <RecipeGrid recipes={recipes} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default SearchResults;
