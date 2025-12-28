// 서주원: 검색 메인 페이지
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { recipeAPI } from "../../api/recipe";
import RecipeGrid from "../../components/RecipeGrid";
import { HiSearch, HiX, HiAdjustments } from "react-icons/hi";
import { BiFridge } from "react-icons/bi";
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
  const [currentPage, setCurrentPage] = useState(1);
  const recipesPerPage = 6;

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
        // 실제 응답 형식: { isSuccess, code, message, result: {...} }
        const profileData = response.data?.result || response.data;
        setProfile(profileData);
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

  // 냉장고 재료 기반 검색
  const handleFridgeSearch = async () => {
    try {
      setIsLoading(true);
      setHasSearched(true);
      setKeywords([]); // 키워드 초기화
      setKeyword(""); // 입력창 초기화

      console.log("=== 냉장고 기반 검색 API 호출 ===");
      console.log("엔드포인트: GET /recipes/recommend/fridge/missing");

      const response = await recipeAPI.getMissingRecommendations();

      console.log("응답 데이터:", response.data);

      // BaseResponse 형식: { isSuccess, code, message, result: [...] }
      const recipesData = response.data?.result || [];

      console.log("추출된 레시피 데이터:", recipesData);

      setRecipes(recipesData);
      setCurrentPage(1);

      // URL 파라미터 업데이트
      setSearchParams({});
    } catch (error) {
      console.error("냉장고 기반 검색 실패:", error);
      if (error.response?.status === 401) {
        alert("로그인이 필요한 서비스입니다.");
      }
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 검색 실행
  const handleSearch = async (searchKeywords = keywords) => {
    // 키워드가 없어도 검색 가능 (전체 레시피 조회)
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

      console.log("=== 일반 검색 API 응답 ===");
      console.log("전체 응답:", response.data);

      // 실제 응답 형식: { isSuccess, code, message, result: [...] } 또는 배열 직접 반환
      const recipesData = Array.isArray(response.data)
        ? response.data
        : response.data?.result || [];

      console.log("추출된 레시피 데이터:", recipesData);
      console.log(
        "첫 번째 레시피의 missingIngredients:",
        recipesData[0]?.missingIngredients
      );

      // 부족한 재료 정보 가져오기 (냉장고 기반 추천 API 활용)
      let missingIngredientsMap = {};
      try {
        // 냉장고 기반 추천 API 두 개 모두 호출하여 최대한 많은 레시피 커버
        const [fridgeResponse, missingResponse] = await Promise.all([
          recipeAPI.getFridgeRecommendations(),
          recipeAPI.getMissingRecommendations(),
        ]);

        const fridgeRecipes = fridgeResponse.data?.result || [];
        const missingRecipes = missingResponse.data?.result || [];

        console.log("냉장고 기반 레시피:", fridgeRecipes.length, "개");
        console.log("부족한 재료 레시피:", missingRecipes.length, "개");

        // 두 API 결과를 합쳐서 recipeId를 키로 하는 맵 생성
        [...fridgeRecipes, ...missingRecipes].forEach((recipe) => {
          // 덮어쓰기 방지: 이미 있으면 건너뛰기
          if (
            !(recipe.recipeId in missingIngredientsMap) &&
            recipe.missingIngredients !== undefined
          ) {
            missingIngredientsMap[recipe.recipeId] = recipe.missingIngredients;
          }
        });

        console.log("부족한 재료 맵:", missingIngredientsMap);
        console.log(
          "맵에 저장된 레시피 수:",
          Object.keys(missingIngredientsMap).length
        );
      } catch (error) {
        console.error("부족한 재료 정보 조회 실패:", error);
      }

      // 검색 결과에 부족한 재료 정보 병합
      const recipesWithMissing = recipesData.map((recipe) => ({
        ...recipe,
        missingIngredients:
          missingIngredientsMap[recipe.recipeId] ||
          recipe.missingIngredients ||
          [],
      }));

      // 클라이언트 사이드 필터링 (Mock API 대응)
      let filteredRecipes = recipesWithMissing;

      // 키워드 필터링 (포함 또는 제외 키워드가 있을 때)
      if (includeKeywords.length > 0 || excludeKeywords.length > 0) {
        filteredRecipes = filteredRecipes.filter((recipe) => {
          // 재료 목록 추출 (객체 배열에서 name 필드 추출)
          const recipeIngredients = recipe.ingredients
            ? Array.isArray(recipe.ingredients)
              ? recipe.ingredients
                  .map((ing) =>
                    typeof ing === "object" && ing.name ? ing.name : String(ing)
                  )
                  .join(" ")
              : String(recipe.ingredients)
            : "";

          // 포함 키워드는 제목+설명+재료 전체에서 검색
          const searchTextForInclude = `${recipe.title || ""} ${
            recipe.description || ""
          } ${recipeIngredients}`.toLowerCase();

          // 제외 키워드는 재료+제목+설명 모두에서 검사
          const excludeSearchText = `${recipeIngredients} ${
            recipe.title || ""
          } ${recipe.description || ""}`.toLowerCase();

          // 1. 포함 키워드 체크: 모든 포함 키워드가 포함되어야 함
          const hasAllIncludes =
            includeKeywords.length === 0 ||
            includeKeywords.every((kw) =>
              searchTextForInclude.includes(kw.toLowerCase())
            );

          // 2. 제외 키워드 체크: 제외 키워드가 하나라도 포함되면 제외
          const hasAnyExcludes = excludeKeywords.some((kw) =>
            excludeSearchText.includes(kw.toLowerCase())
          );

          return hasAllIncludes && !hasAnyExcludes;
        });
      }

      setRecipes(filteredRecipes);
      setCurrentPage(1); // 검색 시 첫 페이지로 리셋

      // [임시] Mock API 대응: 검색 결과를 localStorage에 저장
      // TODO: 백엔드 API 완성 후 제거
      const recipesMap = {};
      filteredRecipes.forEach((recipe) => {
        recipesMap[recipe.recipeId] = recipe;
      });
      localStorage.setItem("recipeCache", JSON.stringify(recipesMap));

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

  // 알레르기 필터 토글
  const handleAllergyToggle = (checked) => {
    setExcludeAllergy(checked);

    if (checked && profile?.allergies?.length > 0) {
      // 알레르기 재료를 제외 키워드로 추가
      const allergyKeywords = profile.allergies.map((allergy) => ({
        text: allergy,
        type: "exclude",
      }));

      // 기존 키워드와 합치되 중복 제거
      const existingTexts = keywords.map((kw) => kw.text);
      const newAllergyKeywords = allergyKeywords.filter(
        (ak) => !existingTexts.includes(ak.text)
      );

      const updatedKeywords = [...keywords, ...newAllergyKeywords];
      setKeywords(updatedKeywords);

      if (hasSearched) {
        handleSearch(updatedKeywords);
      }
    } else if (!checked) {
      // 체크 해제 시 알레르기 키워드 제거
      const allergyTexts = profile?.allergies || [];
      const filteredKeywords = keywords.filter(
        (kw) => !(kw.type === "exclude" && allergyTexts.includes(kw.text))
      );
      setKeywords(filteredKeywords);

      if (hasSearched) {
        handleSearch(filteredKeywords);
      }
    }
  };

  // 정렬 변경 시 재검색
  useEffect(() => {
    if (hasSearched && keywords.length > 0) {
      handleSearch(keywords);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy]);

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

          {/* 냉장고 기반 검색 버튼 */}
          <button
            onClick={handleFridgeSearch}
            disabled={isLoading}
            className="w-full mb-4 bg-white border-2 border-gray-800 text-gray-900 rounded-xl p-4 shadow-sm hover:shadow-md hover:bg-gray-50 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="flex items-center justify-center gap-3">
              <BiFridge size={24} className="text-gray-700" />
              <div className="text-left">
                <div className="font-bold text-base">냉장고 재료로 검색</div>
                <div className="text-xs text-gray-600">
                  냉장고에 있는 재료로 만들 수 있는 레시피
                </div>
              </div>
            </div>
          </button>

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
                    handleSearch([
                      ...keywords,
                      { text: keyword.trim(), type: "include" },
                    ]);
                    setKeyword("");
                  } else {
                    handleSearch(keywords);
                  }
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors font-medium"
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
                        onChange={(e) => handleAllergyToggle(e.target.checked)}
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
            <RecipeGrid
              recipes={recipes.slice(
                (currentPage - 1) * recipesPerPage,
                currentPage * recipesPerPage
              )}
              isLoading={isLoading}
            />

            {/* 페이지네이션 */}
            {!isLoading && recipes.length > 0 && (
              <div className="mt-6 flex items-center justify-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  이전
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(Math.ceil(recipes.length / recipesPerPage))].map(
                    (_, idx) => {
                      const pageNum = idx + 1;
                      const totalPages = Math.ceil(
                        recipes.length / recipesPerPage
                      );

                      // 페이지가 많을 때 일부만 표시
                      if (
                        totalPages > 7 &&
                        pageNum !== 1 &&
                        pageNum !== totalPages &&
                        Math.abs(pageNum - currentPage) > 2
                      ) {
                        if (
                          pageNum === currentPage - 3 ||
                          pageNum === currentPage + 3
                        ) {
                          return (
                            <span key={idx} className="px-2 text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === pageNum
                              ? "bg-slate-700 text-white"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    }
                  )}
                </div>

                <button
                  onClick={() =>
                    setCurrentPage((prev) =>
                      Math.min(
                        Math.ceil(recipes.length / recipesPerPage),
                        prev + 1
                      )
                    )
                  }
                  disabled={
                    currentPage === Math.ceil(recipes.length / recipesPerPage)
                  }
                  className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  다음
                </button>
              </div>
            )}
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
