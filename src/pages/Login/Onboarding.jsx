import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import axiosInstance from "../../api/axiosInstance";
// 온보딩 이미지 import
import checkGender from "../../assets/images/onboarding/checkGender.png";
import checkAge from "../../assets/images/onboarding/checkAge.png";
import checkNonPrefer from "../../assets/images/onboarding/checkNonPrefer.png";
import checkAllergy from "../../assets/images/onboarding/checkAllergy.png";
// react-icons import
import { FaMale, FaFemale } from "react-icons/fa";
import OnboardingNextButton from "../../components/onboarding/OnboardingNextButton";
import OnboardingPreviousButton from "../../components/onboarding/OnboardingPreviousButton";
import OnboardingCompleteButton from "../../components/onboarding/OnboardingCompleteButton";

// 이태건: 온보딩 페이지
const Onboarding = () => {
  const navigate = useNavigate();
  const { isLoggined } = useUserStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    nonPrefer: "",
    allergy: "",
  });

  console.log("로그인 여부", isLoggined);
  // useEffect(() => {
  //   if (!isLoggined) {
  //     navigate("/login");
  //   }
  // }, [isLoggined, navigate]);

  // 다음 단계로 이동
  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
    if (step === 4) {
      handleComplete();
    }
  };

  // 이전 단계로 이동
  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // 온보딩 완료 처리 (성환이 노션 API 구조 참고)
  const handleComplete = async () => {
    console.log("=== 온보딩 완료 여부 조회 시작 ===");

    try {
      console.log("1. API 호출: GET /user/onboarding/check");

      // 백엔드 API 호출 (GET /user/onboarding/check) - 파라미터 없음
      const response = await axiosInstance.get("/user/onboarding/check");

      console.log("2. 백엔드 응답 성공!");
      console.log("   - 응답 상태:", response.status);
      console.log("   - 응답 데이터:", response.data);

      // 응답 확인: { "isOnboardingCompleted": true }
      if (response.data.isOnboardingCompleted) {
        console.log("3. ✅ 온보딩 완료 확인됨 - 메인 페이지로 이동");
        navigate("/");
      } else {
        console.log("3. ⚠️ 온보딩 미완료 - 온보딩 페이지 유지");
      }
    } catch (error) {
      console.error("=== 온보딩 완료 여부 조회 API 에러 ===");
      console.error("에러 타입:", error.name);
      console.error("에러 메시지:", error.message);

      if (error.response) {
        console.error("응답 상태 코드:", error.response.status);
        console.error("응답 데이터:", error.response.data);
      } else if (error.request) {
        console.error("요청은 전송되었지만 응답을 받지 못했습니다.");
      } else {
        console.error("요청 설정 중 에러:", error.message);
      }

      if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("온보딩 완료 여부 확인 중 문제가 발생했습니다.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center pt-32">
      <div className="w-full max-w-md p-6">
        {/* 온보딩 내용 구현 */}
        {step === 1 && (
          <div>
            <h1 className="text-center text-3xl font-extrabold mb-8 text-gray-900 drop-shadow-sm leading-tight break-keep max-w-md mx-auto tracking-tight">
              성별을 선택해주세요
            </h1>

            <div className="flex justify-center mb-8">
              <img src={checkGender} alt="checkGender" />
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => setFormData({ ...formData, gender: "male" })}
                className={`flex-1 py-4 px-6 rounded-xl border-2 transition-all ${
                  formData.gender === "male"
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-blue-300"
                }`}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <FaMale
                      className={`text-4xl ${
                        formData.gender === "male"
                          ? "text-blue-600"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div
                    className={`font-semibold ${
                      formData.gender === "male"
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    남성
                  </div>
                </div>
              </button>

              <button
                onClick={() => setFormData({ ...formData, gender: "female" })}
                className={`flex-1 py-4 px-6 rounded-xl border-2 transition-all ${
                  formData.gender === "female"
                    ? "border-pink-500 bg-pink-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-pink-300"
                }`}
              >
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <FaFemale
                      className={`text-4xl ${
                        formData.gender === "female"
                          ? "text-pink-600"
                          : "text-gray-400"
                      }`}
                    />
                  </div>
                  <div
                    className={`font-semibold ${
                      formData.gender === "female"
                        ? "text-pink-600"
                        : "text-gray-700"
                    }`}
                  >
                    여성
                  </div>
                </div>
              </button>
            </div>
            {/* 1단계 "다음" 버튼 */}
            <OnboardingNextButton
              step={step}
              formData={formData}
              onNext={handleNext}
            />
            <OnboardingPreviousButton step={step} onPrevious={handlePrevious} />
          </div>
        )}
        {step === 2 && (
          <div>
            <h1 className="text-center text-3xl font-extrabold mb-8 text-gray-900 drop-shadow-sm leading-tight break-keep max-w-md mx-auto tracking-tight">
              현재 나이를 알려주세요
            </h1>

            <div className="flex justify-center mb-8">
              <img src={checkAge} alt="checkAge" />
            </div>

            {/* 나이 선택 버튼 */}
            <div className="flex flex-col gap-4">
              {["10대", "20대", "30대", "40대", "50대 이상"].map((age) => (
                <button
                  key={age}
                  onClick={() => setFormData({ ...formData, age: age })}
                  className={`w-full py-4 px-6 rounded-xl border-2 transition-all cursor-pointer ${
                    formData.age === age
                      ? "border-blue-500 bg-blue-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-blue-300"
                  }`}
                >
                  <div
                    className={`font-semibold text-center ${
                      formData.age === age ? "text-blue-600" : "text-gray-700"
                    }`}
                  >
                    {age}
                  </div>
                </button>
              ))}
            </div>

            {/* 2단계 "다음" 버튼 */}
            <OnboardingNextButton
              step={step}
              formData={formData}
              onNext={handleNext}
            />
            <OnboardingPreviousButton step={step} onPrevious={handlePrevious} />
          </div>
        )}
        {step === 3 && (
          <div>
            <h1 className="text-center text-3xl font-extrabold mb-8 text-gray-900 drop-shadow-sm leading-tight break-keep max-w-md mx-auto tracking-tight">
              좋아하지 않는 음식을 알려주세요
            </h1>

            <div className="flex justify-center mb-8">
              <img src={checkNonPrefer} alt="checkNonPrefer" />
            </div>

            {/* 비선호 음식 입력 텍스트박스 */}
            <div className="mb-4">
              <textarea
                value={formData.nonPrefer}
                onChange={(e) =>
                  setFormData({ ...formData, nonPrefer: e.target.value })
                }
                placeholder="예: 오이, 당근, 브로콜리 (쉼표로 구분)"
                className="w-full py-4 px-6 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none resize-none transition-all shadow-sm hover:border-gray-300 min-h-40"
                rows="8"
              />
              <p className="text-sm text-gray-500 mt-2 text-center">
                여러 음식은 쉼표(,)로 구분해주세요
              </p>
            </div>

            {/* 3단계 "다음" 버튼 */}
            <OnboardingNextButton
              step={step}
              formData={formData}
              onNext={handleNext}
            />
            <OnboardingPreviousButton step={step} onPrevious={handlePrevious} />
          </div>
        )}
        {step === 4 && (
          <div>
            <h1 className="text-center text-3xl font-extrabold mb-8 text-gray-900 drop-shadow-sm leading-tight break-keep max-w-md mx-auto tracking-tight">
              알레르기가 있는 음식이 있으신가요?
            </h1>

            <div className="flex justify-center mb-8">
              <img src={checkAllergy} alt="checkAllergy" />
            </div>

            {/* 알레르기 입력 텍스트박스 */}
            <div className="mb-4">
              <textarea
                value={formData.allergy}
                onChange={(e) =>
                  setFormData({ ...formData, allergy: e.target.value })
                }
                placeholder="예: 땅콩, 우유, 대두"
                className="w-full py-4 px-6 rounded-2xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none resize-none transition-all shadow-sm hover:border-gray-300 min-h-40"
                rows="8"
              />
              <p className="text-sm text-gray-500 mt-2 text-center">
                여러 음식은 쉼표(,)로 구분해주세요
              </p>
            </div>

            {/* 4단계 완료 버튼 */}
            <OnboardingCompleteButton onComplete={handleComplete} />
            <OnboardingPreviousButton step={step} onPrevious={handlePrevious} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
