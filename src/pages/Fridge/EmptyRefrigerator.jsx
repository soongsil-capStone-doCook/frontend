// 빈 냉장고 상태 컴포넌트
import { FaPlus } from "react-icons/fa";

const EmptyRefrigerator = ({ onAddClick }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
      <div className="w-full max-w-sm">
        {/* 메시지 카드 */}
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2 tracking-tight">
            냉장고가 비어있습니다
          </h2>
          <p className="text-sm text-gray-500">식재료를 추가해주세요</p>
        </div>

        {/* 재료 추가 버튼 */}
        <div className="flex justify-center mt-6">
          <button
            onClick={onAddClick}
            className="bg-white hover:bg-gray-50 border border-gray-300 hover:border-indigo-400
            text-gray-700 hover:text-indigo-600 font-medium py-2.5 px-5 rounded-lg 
            flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all duration-200"
          >
            <FaPlus className="text-xs" />
            <span className="text-sm">재료 추가</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyRefrigerator;
