// 이태건: 온보딩 4단계 완료 버튼 컴포넌트
import { FaCheck } from "react-icons/fa";

const OnboardingCompleteButton = ({ onComplete }) => {
  return (
    <div className="fixed bottom-28 right-265">
      <button
        onClick={onComplete}
        className="group relative font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white cursor-pointer transform hover:scale-105 active:scale-95 flex items-center gap-2 overflow-hidden"
      >
        {/* 글로우 효과 */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 
        opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300"
        ></div>

        {/* 버튼 내용 */}
        <span className="relative z-10 flex items-center gap-2">
          <FaCheck className="text-lg" />
          <span>완료</span>
        </span>

        <div
          className="absolute inset-0 -translate-x-full group-hover:translate-x-full
         transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        ></div>
      </button>
    </div>
  );
};

export default OnboardingCompleteButton;
