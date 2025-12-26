// 이태건: 냉장고 페이지 버튼 컴포넌트
import { FaPlus, FaTrash } from "react-icons/fa";

// 재료 추가 버튼
export const AddIngredientButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 
      text-white font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 
      shadow-md hover:shadow-lg transition-all"
    >
      <FaPlus className="flex-shrink-0" size={14} />
      <span className="text-xs">재료 추가</span>
    </button>
  );
};

// 재료 삭제 버튼
export const DeleteIngredientButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-red-500 hover:bg-red-600 active:bg-red-700 
      text-white font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 
      shadow-md hover:shadow-lg transition-all"
    >
      <FaTrash className="flex-shrink-0" size={14} />
      <span className="text-xs">재료 삭제</span>
    </button>
  );
};
