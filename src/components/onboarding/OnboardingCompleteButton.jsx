// 이태건: 온보딩 4단계 완료 버튼 컴포넌트
import { FaCheck } from "react-icons/fa";

const OnboardingCompleteButton = ({ onComplete }) => {
  return (
    <div className="fixed bottom-28 right-265">
      <button
        onClick={onComplete}
        className="group font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg
         transition-all duration-300 bg-indigo-500 hover:bg-indigo-600 text-white 
         cursor-pointer transform hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <FaCheck className="text-lg" />
        <span>완료</span>
      </button>
    </div>
  );
};

export default OnboardingCompleteButton;
