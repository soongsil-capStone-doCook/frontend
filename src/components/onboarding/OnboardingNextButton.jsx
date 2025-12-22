import { FaChevronRight } from "react-icons/fa";

const OnboardingButton = ({ step, formData, onNext }) => {
  const isStepComplete = () => {
    switch (step) {
      case 1:
        return formData.gender !== "";
      case 2:
        return formData.age !== "";
      case 3:
        // 비선호 음식은 선택사항이므로 항상 활성화
        return true;
      default:
        return false;
    }
  };

  // 1~3단계에서만 버튼 표시
  if (step < 1 || step > 3) {
    return null;
  }

  const isComplete = isStepComplete();

  return (
    <button
      onClick={onNext}
      disabled={!isComplete}
      className={`group font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg 
        transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-1.5 text-sm ${
          isComplete
            ? "bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
    >
      <span>다음</span>
      <FaChevronRight
        className={`text-xs transition-transform duration-300 ${
          isComplete ? "group-hover:translate-x-1" : ""
        }`}
      />
    </button>
  );
};

export default OnboardingButton;
