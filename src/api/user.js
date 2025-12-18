// 천재민: 마이페이지, 찜하기, 식습관 설정
import axiosInstance from './axiosInstance';

export const userAPI = {
  // 내 정보 조회
  getMyProfile: () => {
    return axiosInstance.get('/users/me');
  },

  // 찜한 레시피 목록
  getFavoriteRecipes: () => {
    return axiosInstance.get('/users/me/scraps');
  },

  // 레시피 찜하기
  addFavorite: (recipeId) => {
    return axiosInstance.post(`/recipes/${recipeId}/scrap`);
  },

  // 찜하기 취소
  removeFavorite: (recipeId) => {
    return axiosInstance.delete(`/recipes/${recipeId}/scrap`);
  },

  // 식습관 설정 업데이트
  updatePreferences: (preferences) => {
    return axiosInstance.patch('/users/me/preferences', preferences);
  },
};

