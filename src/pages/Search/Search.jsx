// 서주원: 검색 메인 페이지
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { recipeAPI } from "../../api/recipe";
import RecipeGrid from "../../components/RecipeGrid";
import { HiSearch, HiX, HiAdjustments } from "react-icons/hi";
import { userAPI } from "../../api/user";

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [keyword, setKeyword] = useState("");
  const [keywords, setKeywords] = useState([]); // 다중 키워드 배열: { text: string, type: 'include' | 'exclude' }
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
    if (urlKeyword) {
      const keywordArray = urlKeyword
        .split("+")
        .filter((k) => k.trim())
        .map((kw) => {
          const isExclude = kw.startsWith("-");
          return {
            text: isExclude ? kw.slice(1) : kw,
            type: isExclude ? "exclude" : "include",
          };
        });
      setKeywords(keywordArray);
      handleSearch(keywordArray);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // 키워드 추가 (스페이스바 또는 엔터)
  const handleKeyPress = (e) => {
    if ((e.key === " " || e.key === "Enter") && keyword.trim()) {
      e.preventDefault();
      const trimmedKeyword = keyword.trim();

      // -로 시작하면 제외 키워드
      const isExclude = trimmedKeyword.startsWith("-");
      const keywordText = isExclude ? trimmedKeyword.slice(1) : trimmedKeyword;

      // 중복 체크
      if (!keywords.some((kw) => kw.text === keywordText)) {
        const newKeywords = [
          ...keywords,
          {
            text: keywordText,
            type: isExclude ? "exclude" : "include",
          },
        ];
        setKeywords(newKeywords);
        setKeyword("");

        // 엔터키면 바로 검색
        if (e.key === "Enter") {
          handleSearch(newKeywords);
        }
      } else {
        setKeyword("");
      }
    } else if (e.key === "Enter" && keywords.length > 0) {
      // 현재 입력중인 키워드 없고, 태그만 있을 때
      handleSearch(keywords);
    }
  };

  // 키워드 태그 삭제
  const removeKeyword = (indexToRemove) => {
    const newKeywords = keywords.filter((_, index) => index !== indexToRemove);
    setKeywords(newKeywords);
  };

  // 검색 실행
  const handleSearch = async (searchKeywords = keywords) => {
    if (searchKeywords.length === 0) return;

    try {
      setIsLoading(true);
      setHasSearched(true);

      // 포함/제외 키워드 분리
      const includeKeywords = searchKeywords
        .filter((kw) => kw.type === "include")
        .map((kw) => kw.text);
      const excludeKeywords = searchKeywords
        .filter((kw) => kw.type === "exclude")
        .map((kw) => kw.text);

      // 다중 키워드를 "+" 로 연결 (포함 키워드만)
      const combinedKeyword = includeKeywords.join("+");

      const response = await recipeAPI.searchRecipes(combinedKeyword || "*", {
        sort: sortBy,
        excludeAllergy: excludeAllergy,
      });

      // 클라이언트 사이드 필터링 (Mock API 대응)
      let filteredRecipes = response.data || [];

      // 키워드가 레시피 제목, 설명, 재료에 포함되는지 확인
      if (searchKeywords.length > 0) {
        filteredRecipes = filteredRecipes.filter((recipe) => {
          const searchText = `${recipe.title || ""} ${
            recipe.description || ""
          } ${
            recipe.ingredients ? recipe.ingredients.join(" ") : ""
          }`.toLowerCase();

          // 모든 포함 키워드가 포함되어야 함
          const hasAllIncludes =
            includeKeywords.length === 0 ||
            includeKeywords.every((kw) =>
              searchText.includes(kw.toLowerCase())
            );

          // 제외 키워드가 하나라도 포함되면 제외
          const hasAnyExcludes = excludeKeywords.some((kw) =>
            searchText.includes(kw.toLowerCase())
          );

          return hasAllIncludes && !hasAnyExcludes;
        });
      }

      setRecipes(filteredRecipes);

      // 최근 검색어 저장 (포함+제외 키워드 형식)
      const searchString = searchKeywords
        .map((kw) => (kw.type === "exclude" ? `-${kw.text}` : kw.text))
        .join("+");
      const newRecentSearches = [
        searchString,
        ...recentSearches.filter((s) => s !== searchString),
      ].slice(0, 10);
      setRecentSearches(newRecentSearches);
      localStorage.setItem("recentSearches", JSON.stringify(newRecentSearches));

      // URL 업데이트
      setSearchParams({ keyword: searchString });
    } catch (error) {
      console.error("검색 실패:", error);
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 최근 검색어 클릭
  const handleRecentSearchClick = (search) => {
    const keywordArray = search
      .split("+")
      .filter((k) => k.trim())
      .map((kw) => {
        const isExclude = kw.startsWith("-");
        return {
          text: isExclude ? kw.slice(1) : kw,
          type: isExclude ? "exclude" : "include",
        };
      });
    setKeywords(keywordArray);
    setKeyword("");
    handleSearch(keywordArray);
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
    if (hasSearched && keywords.length > 0) {
      handleSearch(keywords);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <div className="space-y-3">
            {/* 키워드 태그 표시 */}
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {keywords.map((kw, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                      kw.type === "exclude"
                        ? "bg-red-600 text-white"
                        : "bg-slate-600 text-white"
                    }`}
                  >
                    <span>
                      {kw.type === "exclude" ? `-${kw.text}` : kw.text}
                    </span>
                    <button
                      onClick={() => removeKeyword(index)}
                      className={`rounded-full p-0.5 transition-colors ${
                        kw.type === "exclude"
                          ? "hover:bg-red-700"
                          : "hover:bg-slate-700"
                      }`}
                    >
                      <HiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 입력창 */}
            <div className="relative">
              <input
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={
                  keywords.length > 0
                    ? "재료 입력 (스페이스바, -제외)"
                    : "재료 입력 (스페이스바로 추가, -제외)"
                }
                className="w-full pl-12 pr-24 py-3.5 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-slate-500 transition-colors text-base"
              />
              <HiSearch
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />

              {(keyword || keywords.length > 0) && (
                <button
                  onClick={() => {
                    setKeyword("");
                    setKeywords([]);
                  }}
                  className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <HiX size={20} />
                </button>
              )}

              <button
                onClick={() => {
                  if (keyword.trim()) {
                    handleSearch([...keywords, keyword.trim()]);
                    setKeyword("");
                  } else {
                    handleSearch(keywords);
                  }
                }}
                disabled={keywords.length === 0 && !keyword.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                검색
              </button>
            </div>
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
                '
                {keywords
                  .map((kw) =>
                    kw.type === "exclude" ? `-${kw.text}` : kw.text
                  )
                  .join(" + ")}
                ' 검색 결과
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
