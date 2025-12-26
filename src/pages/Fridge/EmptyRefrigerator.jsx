// 빈 냉장고 상태 컴포넌트
import { FaPlus } from "react-icons/fa";

const EmptyRefrigerator = ({ onAddClick }) => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4">
      <div className="w-full max-w-sm">
        {/* 메시지 카드 */}
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-1.5 tracking-tight">
            냉장고가 비어있습니다!
          </h2>
          <p className="mt-2 text-sm text-gray-500 font-medium">
            식재료를 추가해주세요
          </p>
        </div>

        {/* 재료 추가 버튼 */}
        <div className="flex justify-center mt-4">
          <button
            onClick={onAddClick}
            className="bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 
            text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 shadow-md 
            hover:shadow-lg transition-all"
          >
            <FaPlus className="flex-shrink-0" />
            <span className="text-base">재료 추가</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmptyRefrigerator;
