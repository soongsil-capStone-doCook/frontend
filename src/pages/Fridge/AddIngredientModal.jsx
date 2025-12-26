// 이태건: 재료 추가 모달
import { useState } from "react";
import { FaTimes } from "react-icons/fa";

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
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    storageCategory: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name) {
      // 빈 문자열을 null로 변환
      const submitData = {
        name: formData.name,
        quantity: formData.quantity?.trim() || null,
        storageCategory: formData.storageCategory || null,
      };
      onSubmit(submitData);
      setFormData({ name: "", quantity: "", storageCategory: "" });
    }
  };

  const handleClose = () => {
    setFormData({ name: "", quantity: "", storageCategory: "" });
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
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-[scaleUp_0.3s_ease-out]">
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={20} />
        </button>

        {/* 헤더 */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            재료 추가
          </h2>
          <p className="text-sm text-gray-500 font-medium mt-1">
            새로운 식재료를 추가해주세요
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 음식 이름 */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              음식 이름
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="예: 우유, 사과, 계란"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              required
            />
          </div>

          {/* 양 */}
          <div>
            <label
              htmlFor="quantity"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              양 <span className="text-gray-400 text-xs">(선택사항)</span>
            </label>
            <input
              type="text"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="예: 1L, 500g, 10개 (선택사항)"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>

          {/* 저장 카테고리 */}
          <div>
            <label
              htmlFor="storageCategory"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              저장 카테고리{" "}
              <span className="text-gray-400 text-xs">(선택사항)</span>
            </label>
            <select
              id="storageCategory"
              name="storageCategory"
              value={formData.storageCategory}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white"
            >
              <option value="">카테고리를 선택해주세요 (선택사항)</option>
              {STORAGE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

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
