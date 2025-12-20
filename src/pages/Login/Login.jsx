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

    // authorize()는 리다이렉트를 수행하므로, 콜백 페이지에서 처리합니다
    window.Kakao.Auth.authorize({
      redirectUri: redirectUri,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
          로그인
        </h1>

        <div className="flex flex-col gap-4">
          <p className="text-center text-gray-500 mb-4">
            서비스 이용을 위해 로그인해주세요
          </p>

          {/* 카카오 로그인 버튼 (공식 컬러 #FEE500) */}
          <button
            onClick={handleKakaoLogin}
            className="w-full bg-[#FEE500] hover:bg-[#FDD835] text-[#191919] font-bold py-3.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
          >
            {/* 카카오 심볼 아이콘 (SVG) */}
            <svg viewBox="0 0 32 32" width="20" height="20" fill="currentColor">
              <path d="M16 4C8.832 4 3 8.604 3 14.28c0 3.73 2.536 7.025 6.36 8.797l-1.306 4.81c-.13.48.44.857.818.59l5.59-3.95c.502.05 1.015.074 1.538.074 7.168 0 13-4.604 13-10.28C29 8.604 23.168 4 16 4z" />
            </svg>
            카카오로 시작하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
