// 이태건: 온보딩 4단계 완료 버튼 컴포넌트
import { FaCheck } from "react-icons/fa";

const OnboardingCompleteButton = ({ onComplete }) => {
  return (
    <button
      onClick={onComplete}
      className="group font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg
       transition-all duration-300 bg-indigo-500 hover:bg-indigo-600 text-white 
       cursor-pointer transform hover:scale-105 active:scale-95 flex items-center gap-1.5 text-sm"
    >
      <FaCheck className="text-xs" />
      <span>완료</span>
    </button>
  );
};

export default OnboardingCompleteButton;
