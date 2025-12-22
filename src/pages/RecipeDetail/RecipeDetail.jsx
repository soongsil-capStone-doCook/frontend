// 서주원: 레시피 상세 페이지
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { recipeAPI } from "../../api/recipe";
import LikeButton from "../../components/LikeButton";
import {
  HiArrowLeft,
  HiClock,
  HiCheckCircle,
  HiExclamationCircle,
} from "react-icons/hi";
import { MdLocalFireDepartment } from "react-icons/md";
import { mockRecipes } from "../../mockRecipeData"; // [임시] Mock 데이터

const RecipeDetail = () => {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchRecipeDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("🔍 레시피 ID:", recipeId);

        // [임시] Mock API가 동적 파라미터 처리 못함 - localStorage 캐시 + API 병합
        // TODO: 백엔드 API 완성 후 제거
        const recipeCache = localStorage.getItem("recipeCache");
        let cachedData = null;

        if (recipeCache) {
          const recipesMap = JSON.parse(recipeCache);
          cachedData = recipesMap[recipeId];
          if (cachedData) {
            console.log("💾 캐시 데이터 발견:", cachedData.title);
          }
        }

        // [임시] 캐시 없으면 mockRecipes 사용 (개발용)
        const mockData = mockRecipes[recipeId];
        if (!cachedData && mockData) {
          console.log("🎭 Mock 데이터 사용:", mockData.title);
        }

        // API 호출하여 steps와 isScrapped 가져오기
        const response = await recipeAPI.getRecipeDetail(recipeId);
        console.log("✅ API 응답:", response.data);

        // 병합 우선순위: 캐시(검색결과) > Mock(개발용) > API(기본)
        const mergedRecipe = {
          ...response.data, // 기본: API 데이터
          ...(mockData || {}), // Mock 덮어쓰기 (없으면 스킵)
          ...(cachedData || {}), // 캐시 덮어쓰기 (최우선)
        };

        console.log(
          "🎉 최종 데이터:",
          mergedRecipe.title,
          "steps:",
          mergedRecipe.steps?.length
        );
        setRecipe(mergedRecipe);
      } catch (err) {
        console.error("❌ 레시피 상세 정보 로드 실패:", err);
        console.error("❌ 에러 상세:", err.response?.data || err.message);
        setError("레시피 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (recipeId) {
      fetchRecipeDetail();
    } else {
      console.log("⚠️ recipeId가 없습니다");
    }
  }, [recipeId]);

  // 기본 이미지
  const defaultImage =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23e5e7eb' width='300' height='200'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dominant-baseline='middle'%3E이미지 없음%3C/text%3E%3C/svg%3E";

  const imageUrl =
    !imageError && recipe?.thumbnail ? recipe.thumbnail : defaultImage;

  // 난이도 색상
  const getDifficultyColor = (difficulty) => {
    const colors = {
      초급: "text-green-600 bg-green-50",
      중급: "text-orange-600 bg-orange-50",
      고급: "text-red-600 bg-red-50",
    };
    return colors[difficulty] || "text-gray-600 bg-gray-50";
  };

  // 적합도 색상
  const getMatchRateColor = (rate) => {
    if (rate >= 90) return "text-emerald-600 bg-emerald-50";
    if (rate >= 70) return "text-blue-600 bg-blue-50";
    if (rate >= 50) return "text-amber-600 bg-amber-50";
    return "text-gray-600 bg-gray-50";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-700"></div>
      </div>
    );
  }

  if (error || !recipe) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
        <HiExclamationCircle className="text-gray-400 mb-4" size={48} />
        <p className="text-gray-600 mb-6">
          {error || "레시피를 찾을 수 없습니다."}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="px-6 py-3 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 헤더 이미지 */}
      <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200">
        <img
          src={imageUrl}
          alt={recipe.title}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />

        {/* 그라데이션 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* 뒤로가기 버튼 */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg"
        >
          <HiArrowLeft size={24} className="text-gray-900" />
        </button>

        {/* 찜하기 버튼 */}
        <div className="absolute top-4 right-4">
          <div className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg">
            <LikeButton
              recipeId={recipe.recipeId}
              initialLiked={recipe.isScrapped}
            />
          </div>
        </div>

        {/* 하단 정보 */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-center gap-2 mb-3">
            {recipe.matchRate && (
              <span
                className={`px-3 py-1.5 rounded-full text-sm font-bold ${getMatchRateColor(
                  recipe.matchRate
                )}`}
              >
                적합도 {Math.floor(recipe.matchRate)}%
              </span>
            )}
            <span
              className={`px-3 py-1.5 rounded-full text-sm font-bold ${getDifficultyColor(
                recipe.difficulty
              )}`}
            >
              {recipe.difficulty || "중급"}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">
            {recipe.title}
          </h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* 요약 정보 */}
        <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <HiClock className="text-slate-600" size={20} />
            <div>
              <p className="text-xs text-gray-500">조리시간</p>
              <p className="text-sm font-bold text-gray-900">
                {recipe.cookTime || "30분"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MdLocalFireDepartment className="text-orange-500" size={20} />
            <div>
              <p className="text-xs text-gray-500">칼로리</p>
              <p className="text-sm font-bold text-gray-900">
                {recipe.calories || "미정"}kcal
              </p>
            </div>
          </div>
          {recipe.servings && (
            <div className="flex items-center gap-2">
              <HiCheckCircle className="text-green-500" size={20} />
              <div>
                <p className="text-xs text-gray-500">인분</p>
                <p className="text-sm font-bold text-gray-900">
                  {recipe.servings}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 재료 섹션 */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-slate-700 rounded-full"></span>
              필요한 재료
            </h2>
            <div className="bg-gray-50 rounded-xl p-5">
              <div className="grid grid-cols-1 gap-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
                  >
                    <span className="text-gray-900 font-medium">
                      {typeof ingredient === "string"
                        ? ingredient
                        : ingredient.name || ingredient}
                    </span>
                    {typeof ingredient === "object" && ingredient.amount && (
                      <span className="text-gray-600 text-sm">
                        {ingredient.amount}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 조리 과정 섹션 */}
        {recipe.steps && recipe.steps.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-slate-700 rounded-full"></span>
              조리 과정
            </h2>
            <div className="space-y-4">
              {recipe.steps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-slate-700 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {step.order || index + 1}
                  </div>
                  <div className="flex-1 pt-1">
                    <p className="text-gray-800 leading-relaxed">
                      {step.content || step.description || step}
                    </p>
                    {step.imageUrl && (
                      <img
                        src={step.imageUrl}
                        alt={`조리 단계 ${step.order || index + 1}`}
                        className="mt-3 rounded-lg w-full max-w-md"
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 영양 정보 섹션 */}
        {recipe.nutrition && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-slate-700 rounded-full"></span>
              영양 정보
            </h2>
            <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-xl p-5">
              <div className="grid grid-cols-2 gap-4">
                {recipe.nutrition.protein && (
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">단백질</p>
                    <p className="text-lg font-bold text-gray-900">
                      {recipe.nutrition.protein}g
                    </p>
                  </div>
                )}
                {recipe.nutrition.carbs && (
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">탄수화물</p>
                    <p className="text-lg font-bold text-gray-900">
                      {recipe.nutrition.carbs}g
                    </p>
                  </div>
                )}
                {recipe.nutrition.fat && (
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">지방</p>
                    <p className="text-lg font-bold text-gray-900">
                      {recipe.nutrition.fat}g
                    </p>
                  </div>
                )}
                {recipe.nutrition.sodium && (
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">나트륨</p>
                    <p className="text-lg font-bold text-gray-900">
                      {recipe.nutrition.sodium}mg
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 주의사항 */}
        {recipe.warnings && recipe.warnings.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-red-500 rounded-full"></span>
              주의사항
            </h2>
            <div className="bg-red-50 border border-red-200 rounded-xl p-5">
              <div className="space-y-2">
                {recipe.warnings.map((warning, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <HiExclamationCircle
                      className="text-red-500 flex-shrink-0 mt-0.5"
                      size={18}
                    />
                    <p className="text-sm text-red-800">{warning}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default RecipeDetail;
