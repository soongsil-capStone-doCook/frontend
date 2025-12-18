// 서주원: 레시피 검색, 상세 정보
import axiosInstance from './axiosInstance';

export const recipeAPI = {
  // 레시피 검색
  searchRecipes: (keyword, params = {}) => {
    return axiosInstance.get('/recipes/search', {
      params: { keyword, ...params },
    });
  },

  // 레시피 상세 정보
  getRecipeDetail: (recipeId) => {
    return axiosInstance.get(`/recipes/${recipeId}`);
  },

  // 인기 레시피
  getPopularRecipes: () => {
    return axiosInstance.get('/recipes/popular');
  },

  // 추천 레시피
  getRecommendedRecipes: () => {
    return axiosInstance.get('/recipes/recommended');
  },

  // 찜 기반 유사 레시피 추천
  getLikedRecommendations: () => {
    return axiosInstance.get('/recipes/recommend/liked');
  },
};

