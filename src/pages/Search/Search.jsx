// 서주원: 검색 메인 페이지
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { recipeAPI } from "../../api/recipe";
import RecipeGrid from "../../components/RecipeGrid";
import { HiSearch, HiX, HiAdjustments } from "react-icons/hi";
import { userAPI } from "../../api/user";

const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("latest");
  const [excludeAllergy, setExcludeAllergy] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [profile, setProfile] = useState(null);

  // 최근 검색어 불러오기
  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // 사용자 프로필 가져오기 (알레르기 정보)
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await userAPI.getMyProfile();
        setProfile(response.data);
      } catch (error) {
        console.error("프로필 로드 실패:", error);
      }
    };
    fetchProfile();
  }, []);

  // URL 파라미터로 검색어가 있으면 자동 검색
  useEffect(() => {
    const urlKeyword = searchParams.get("keyword");
    if (urlKeyword && urlKeyword !== keyword) {
      setKeyword(urlKeyword);
      handleSearch(urlKeyword);
    }
  }, [searchParams]);

  // 검색 실행
  const handleSearch = async (searchKeyword = keyword) => {
    if (!searchKeyword.trim()) return;

    try {
      setIsLoading(true);
      setHasSearched(true);

      const response = await recipeAPI.searchRecipes(searchKeyword, {
        sort: sortBy,
        excludeAllergy: excludeAllergy,
      });

      setRecipes(response.data || []);

      // 최근 검색어 저장 (중복 제거, 최대 10개)
      const newRecentSearches = [
        searchKeyword,
        ...recentSearches.filter((s) => s !== searchKeyword),
      ].slice(0, 10);
      setRecentSearches(newRecentSearches);
      localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));

      // URL 업데이트
      setSearchParams({ keyword: searchKeyword });
    } catch (error) {
      console.error("검색 실패:", error);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 엔터키 검색
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // 최근 검색어 클릭
  const handleRecentSearchClick = (search) => {
    setKeyword(search);
    handleSearch(search);
  };

  // 최근 검색어 삭제
  const handleDeleteRecentSearch = (searchToDelete) => {
    const newRecentSearches = recentSearches.filter(
      (s) => s !== searchToDelete
    );
    setRecentSearches(newRecentSearches);
    localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));
  };

  // 정렬 변경 시 재검색
  useEffect(() => {
    if (hasSearched && keyword) {
      handleSearch();
    }
  }, [sortBy, excludeAllergy]);

  // 추천 검색어
  const popularKeywords = [
    "김치찌개",
    "파스타",
    "볶음밥",
    "샐러드",
    "닭가슴살",
    "카레",
    "떡볶이",
    "제육볶음",
  ];

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">레시피 검색</h1>

          {/* 검색창 */}
          <div className="relative">
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="어떤 요리를 만들고 싶으세요?"
              className="w-full pl-12 pr-24 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-500 transition-colors text-base"
            />
            <HiSearch
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />

            {keyword && (
              <button
                onClick={() => setKeyword("")}
                className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <HiX size={20} />
              </button>
            )}

            <button
              onClick={() => handleSearch()}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium"
            >
              검색
            </button>
          </div>
        </div>

        {/* 필터 및 정렬 */}
        {hasSearched && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <HiAdjustments size={18} />
                <span className="text-sm font-medium">필터</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">정렬:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-slate-500"
                >
                  <option value="latest">최신순</option>
                  <option value="rating">평점순</option>
                  <option value="match">적합도순</option>
                </select>
              </div>
            </div>

            {/* 필터 옵션 */}
            {showFilters && (
              <div className="bg-gray-50 p-4 rounded-xl space-y-3">
                {profile &&
                  profile.allergies &&
                  profile.allergies.length > 0 && (
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={excludeAllergy}
                        onChange={(e) => setExcludeAllergy(e.target.checked)}
                        className="w-5 h-5 text-slate-700 rounded focus:ring-2 focus:ring-slate-500"
                      />
                      <div>
                        <span className="text-sm font-medium text-gray-900">
                          알레르기 재료 제외
                        </span>
                        <p className="text-xs text-gray-500 mt-0.5">
                          내 알레르기: {profile.allergies.join(", ")}
                        </p>
                      </div>
                    </label>
                  )}

                {(!profile ||
                  !profile.allergies ||
                  profile.allergies.length === 0) && (
                  <p className="text-sm text-gray-500">
                    마이페이지에서 알레르기 정보를 설정하면 필터를 사용할 수
                    있습니다.
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* 검색 결과 */}
        {hasSearched ? (
          <div>
            <div className="mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                '{keyword}' 검색 결과
                {!isLoading && (
                  <span className="text-slate-600">({recipes.length})</span>
                )}
              </h2>
            </div>
            <RecipeGrid recipes={recipes} isLoading={isLoading} />
          </div>
        ) : (
          <div>
            {/* 최근 검색어 */}
            {recentSearches.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  최근 검색어
                </h2>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((search, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-gray-100 rounded-full pl-4 pr-2 py-2"
                    >
                      <button
                        onClick={() => handleRecentSearchClick(search)}
                        className="text-sm text-gray-700 hover:text-gray-900"
                      >
                        {search}
                      </button>
                      <button
                        onClick={() => handleDeleteRecentSearch(search)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <HiX size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 인기 검색어 */}
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-3">
                인기 검색어
              </h2>
              <div className="flex flex-wrap gap-2">
                {popularKeywords.map((popular, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(popular)}
                    className="px-4 py-2 bg-slate-50 text-slate-700 rounded-full text-sm font-medium hover:bg-slate-100 transition-colors"
                  >
                    {popular}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
