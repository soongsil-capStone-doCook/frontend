// 이태건: 냉장고 관련 API
import axiosInstance from "./axiosInstance";

export const fridgeAPI = {
  // 냉장고 재료 목록 조회
  getFridgeItems: () => {
    return axiosInstance.get("/fridge");
  },

  // 재료 수동 추가 (단일)
  addIngredient: (ingredient) => {
    return axiosInstance.post("/fridge", ingredient);
  },

  // 재료 수동 추가 (여러개)
  addBatchIngredients: (items) => {
    return axiosInstance.post("/fridge/batch", { items });
  },

  // OCR 영수증/사진 인식 요청
  recognizeReceipt: (imageFile) => {
    const formData = new FormData();
    formData.append("image", imageFile);

    return axiosInstance.post("/fridge/ocr-auto-place", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
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
