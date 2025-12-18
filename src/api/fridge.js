// 이태건: 냉장고 관련 API
import axiosInstance from './axiosInstance';

export const fridgeAPI = {
  // 냉장고 재료 목록 조회
  getFridgeItems: () => {
    return axiosInstance.get('/fridge');
  },

  // OCR 영수증/사진 인식
  recognizeReceipt: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return axiosInstance.post('/fridge/ocr', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  // 재료 수동 추가
  addIngredient: (ingredient) => {
    return axiosInstance.post('/fridge', ingredient);
  },

  // 재료 수정
  updateIngredient: (ingredientId, ingredient) => {
    return axiosInstance.patch(`/fridge/${ingredientId}`, ingredient);
  },

  // 재료 삭제
  deleteIngredient: (ingredientId) => {
    return axiosInstance.delete(`/fridge/${ingredientId}`);
  },
};

