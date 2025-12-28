// 이태건: 로그인 페이지
import { useEffect } from "react";

const Login = () => {
  const kakaoKey = import.meta.env.VITE_KAKAO_JS_KEY;
  useEffect(() => {
    // 1. 카카오 SDK가 로드되었는지 확인
    if (window.Kakao) {
      // 2. 이미 초기화되었는지 확인 후 초기화
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(kakaoKey);
        console.log("Kakao SDK initialized");
      }
    } else {
      // 3. 만약 window.Kakao가 아직 없다면..
      console.error(
        "No Kakao SDK found in index.html. Please check your index.html file."
      );
    }
  }, [kakaoKey]);

  const handleKakaoLogin = () => {
    // SDK가 로드되고 초기화되었는지 확인
    if (!window.Kakao) {
      console.error("Kakao SDK not loaded.");
      alert("Kakao SDK is loading. Please try again later.");
      return;
    }

    if (!window.Kakao.isInitialized()) {
      console.error("Kakao SDK not initialized.");
      alert("Kakao SDK is initializing. Please try again later.");
      return;
    }

    // 카카오 SDK 2.7.9에서는 authorize() 메서드만 사용 가능 (리다이렉트 방식)
    // redirectUri는 카카오 개발자 콘솔에 등록된 URI와 정확히 일치해야 함
    const redirectUri = `${window.location.origin}/login/kakao/callback`;

    // authorize()는 리다이렉트를 수행하므로, 콜백 페이지에서 처리
    window.Kakao.Auth.authorize({
      redirectUri: redirectUri,
    });
  };

  return (
    <div className="h-screen relative flex items-center justify-center px-4">
      {/* 배경 이미지 */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/doCookBackground2.png')`,
        }}
      >
        {/* 오버레이 */}
        <div 
          className="absolute inset-0 bg-black/50"
          style={{
            backdropFilter: 'blur(2px)',
            WebkitBackdropFilter: 'blur(2px)',
          }}
        ></div>
      </div>

      {/* 콘텐츠 */}
      <div className="relative z-10 w-full max-w-md">
        {/* 브랜드 로고 영역 */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4 tracking-tight drop-shadow-lg">
            냉장고에 뭐 있니?
          </h1>
          <p className="text-lg text-white/90 font-medium drop-shadow-md">
            나만의 냉장고 관리부터 AI 맞춤 레시피까지
          </p>
        </div>

        {/* 카카오 로그인 버튼 */}
        <div className="flex justify-center">
          <button
            onClick={handleKakaoLogin}
            className="w-[75%] bg-[#FEE500] hover:bg-[#FDD835] active:bg-[#FBC02D] text-[#191919] font-bold py-3 px-5 rounded-xl 
            flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99]"
          >
          {/* 카카오 심볼 아이콘 */}
          <svg
            viewBox="0 0 32 32"
            width="20"
            height="20"
            fill="currentColor"
            className="flex-shrink-0"
          >
            <path d="M16 4C8.832 4 3 8.604 3 14.28c0 3.73 2.536 7.025 6.36 8.797l-1.306 4.81c-.13.48.44.857.818.59l5.59-3.95c.502.05 1.015.074 1.538.074 7.168 0 13-4.604 13-10.28C29 8.604 23.168 4 16 4z" />
          </svg>
          <span className="text-sm">카카오로 시작하기</span>
          </button>
        </div>

        {/* 하단 안내 문구 */}
        <p className="text-xs text-white/80 text-center mt-6 drop-shadow-md">
          카카오 계정으로 간편하게 시작하세요
        </p>
      </div>
    </div>
  );
};

export default Login;
