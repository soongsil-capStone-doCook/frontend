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
    <div className="fixed bottom-28 right-265 z-50">
      <button
        onClick={onNext}
        disabled={!isComplete}
        className={`group font-bold py-3 px-8 rounded-xl shadow-md hover:shadow-lg 
          transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center gap-2 ${
            isComplete
              ? "bg-indigo-500 hover:bg-indigo-600 text-white cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
      >
        <span>다음</span>
        <FaChevronRight
          className={`text-sm transition-transform duration-300 ${
            isComplete ? "group-hover:translate-x-1" : ""
          }`}
        />
      </button>
    </div>
  );
};

export default OnboardingButton;
