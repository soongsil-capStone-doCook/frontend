// 서주원: 레시피 검색, 상세 정보
import axiosInstance from "./axiosInstance";

export const recipeAPI = {
  // 레시피 검색
  searchRecipes: (keyword, params = {}) => {
    return axiosInstance.get("recipes/recommend/search", {
      params: { keyword, ...params },
    });
  },

  // 레시피 상세 정보
  getRecipeDetail: (recipeId) => {
    return axiosInstance.get(`/recipes/${recipeId}`);
  },

  // 인기 레시피
  getPopularRecipes: () => {
    return axiosInstance.get("/recipes/popular");
  },

  // 추천 레시피
  getRecommendedRecipes: () => {
    return axiosInstance.get("/recipes/recommended");
  },

  // 찜 기반 레시피 추천 (메인 페이지용)
  getLikedRecommendations: () => {
    return axiosInstance.get("/recipes/recommend/scraps");
  },

  // 냉장고 재료 기반 추천
  getFridgeRecommendations: () => {
    return axiosInstance.get("/recipes/recommend/fridge");
  },

  // 부족한 재료 기반 추천
  getMissingRecommendations: () => {
    return axiosInstance.get("/recipes/recommend/fridge/missing");
  },
};
