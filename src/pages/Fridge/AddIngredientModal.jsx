// 이태건: 재료 추가 모달 (단일 및 다중 지원)
import { useState } from "react";
import { FaTimes, FaPlus, FaMinus } from "react-icons/fa";

const STORAGE_CATEGORIES = [
  "채소",
  "과일",
  "육류",
  "해산물",
  "유제품",
  "소스",
  "양념",
  "음료",
  "냉동식품",
  "기타",
];

const AddIngredientModal = ({ isOpen, onClose, onSubmit }) => {
  // 재료 배열로 관리 (기본 1개)
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", storageCategory: "" },
  ]);

  // 특정 재료의 필드 값 변경
  const handleChange = (index, field, value) => {
    setIngredients((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  };

  // 재료 추가
  const handleAddIngredient = () => {
    setIngredients((prev) => [
      ...prev,
      { name: "", quantity: "", storageCategory: "" },
    ]);
  };

  // 재료 제거
  const handleRemoveIngredient = (index) => {
    if (ingredients.length > 1) {
      setIngredients((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 이름이 있는 재료만 필터링
    const validIngredients = ingredients.filter((item) => item.name.trim());

    if (validIngredients.length === 0) return;

    // 빈 문자열을 null로 변환
    const processedIngredients = validIngredients.map((item) => ({
      name: item.name.trim(),
      quantity: item.quantity?.trim() || null,
      storageCategory: item.storageCategory || null,
    }));

    onSubmit(processedIngredients);
    // 초기화
    setIngredients([{ name: "", quantity: "", storageCategory: "" }]);
  };

  const handleClose = () => {
    setIngredients([{ name: "", quantity: "", storageCategory: "" }]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* 배경 오버레이 - fade in */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={handleClose}
      />

      {/* 모달 컨텐츠 - scale up + fade in */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-[scaleUp_0.3s_ease-out] max-h-[90vh] overflow-y-auto">
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors z-10"
        >
          <FaTimes size={20} />
        </button>

        {/* 헤더 */}
        <div className="mb-6 flex items-center justify-between pr-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
              재료 추가
            </h2>
            <p className="text-sm text-gray-500 font-medium mt-1">
              새로운 식재료를 추가해주세요
            </p>
          </div>
          {/* 재료 추가 버튼 */}
          <button
            type="button"
            onClick={handleAddIngredient}
            className="bg-indigo-500 hover:bg-indigo-600 text-white p-2.5 rounded-lg transition-colors shadow-sm hover:shadow"
            title="재료 추가"
          >
            <FaPlus size={14} />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 재료 목록 */}
          {ingredients.map((ingredient, index) => (
            <div
              key={index}
              className="space-y-3 p-4 border border-gray-200 rounded-xl bg-gray-50/50"
            >
              {/* 재료 헤더 */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-600">
                  재료 {index + 1}
                </span>
                {ingredients.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveIngredient(index)}
                    className="text-red-500 hover:text-red-600 p-1 hover:bg-red-50 rounded transition-colors"
                    title="삭제"
                  >
                    <FaMinus size={12} />
                  </button>
                )}
              </div>

              {/* 음식 이름 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  음식 이름
                </label>
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => handleChange(index, "name", e.target.value)}
                  placeholder="예: 우유, 사과, 계란"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white text-sm"
                  required
                />
              </div>

              {/* 양 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  양 <span className="text-gray-400 text-xs">(선택사항)</span>
                </label>
                <input
                  type="text"
                  value={ingredient.quantity}
                  onChange={(e) =>
                    handleChange(index, "quantity", e.target.value)
                  }
                  placeholder="예: 1L, 500g, 10개"
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white text-sm"
                />
              </div>

              {/* 저장 카테고리 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  저장 카테고리{" "}
                  <span className="text-gray-400 text-xs">(선택사항)</span>
                </label>
                <select
                  value={ingredient.storageCategory}
                  onChange={(e) =>
                    handleChange(index, "storageCategory", e.target.value)
                  }
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white text-sm"
                >
                  <option value="">선택해주세요</option>
                  {STORAGE_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}

          {/* 버튼 그룹 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="bg-gray-200 hover:bg-gray-300 flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              추가하기
            </button>
          </div>
        </form>
      </div>

      {/* 애니메이션 스타일 */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes scaleUp {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default AddIngredientModal;
