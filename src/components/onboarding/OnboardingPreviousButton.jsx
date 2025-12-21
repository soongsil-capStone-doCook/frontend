import { FaChevronLeft } from "react-icons/fa";

const OnboardingPreviousButton = ({ step, onPrevious }) => {
  // 2~4단계에서만 버튼 표시
  if (step < 2 || step > 4) {
    return null;
  }

  return (
    <div className="fixed bottom-28 right 265 z-50">
      <button
        onClick={onPrevious}
        className="group font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg
         transition-all duration-300 bg-indigo-500 hover:bg-indigo-600 text-white
          cursor-pointer transform hover:scale-105 active:scale-95 flex items-center gap-2"
      >
        <FaChevronLeft className="text-sm group-hover:-translate-x-1 transition-transform duration-300" />
        <span>이전</span>
      </button>
    </div>
  );
};

export default OnboardingPreviousButton;
