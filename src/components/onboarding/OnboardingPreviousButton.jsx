import { FaChevronLeft } from "react-icons/fa";

const OnboardingPreviousButton = ({ step, onPrevious }) => {
  // 2~4단계에서만 버튼 표시
  if (step < 2 || step > 4) {
    return null;
  }

  return (
    <button
      onClick={onPrevious}
      className="group font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg
       transition-all duration-300 bg-indigo-500 hover:bg-indigo-600 text-white
        cursor-pointer transform hover:scale-105 active:scale-95 flex items-center gap-1.5 text-sm"
    >
      <FaChevronLeft className="text-xs group-hover:-translate-x-1 transition-transform duration-300" />
      <span>이전</span>
    </button>
  );
};

export default OnboardingPreviousButton;
